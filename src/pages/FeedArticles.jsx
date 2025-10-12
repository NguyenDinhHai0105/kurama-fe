import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'

function formatDate(ts) {
  try {
    const d = ts ? new Date(ts) : null
    if (!d || isNaN(d.getTime())) return null
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  } catch {
    return null
  }
}

function sourceFromUrl(u) {
  try {
    const url = new URL(u)
    const parts = url.hostname.replace('www.', '').split('.')
    const core = parts.length > 1 ? parts[parts.length - 2] : parts[0]
    return core.replace(/[-_]/g, ' ').toUpperCase()
  } catch {
    return 'SOURCE'
  }
}

function extractFirstImage(html) {
  try {
    if (!html) return null
    const match = String(html).match(/<img[^>]+src=["']?([^"'> ]+)["']?[^>]*>/i)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function plainText(html) {
  try { return String(html || '').replace(/<[^>]*>/g, '') } catch { return '' }
}

export default function FeedArticles() {
  const { feedId } = useParams()
  const location = useLocation()
  const feedFromState = location.state?.feed
  const [feedMeta, setFeedMeta] = useState(feedFromState || null)

  // paging state
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(8)
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0, hasNext: false, hasPrevious: false })

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Reset page when feed changes
  useEffect(() => { setPage(0) }, [feedId])

  // Resolve feed meta if not present via navigation state
  useEffect(() => {
    let cancelled = false
    async function ensureFeedMeta() {
      if (feedMeta || !feedId) return
      try {
        const res = await fetch('http://localhost:8080/api/v1/feed')
        const json = await res.json().catch(() => ({}))
        if (!cancelled && json && json.statusCode === 200 && Array.isArray(json.data)) {
          const found = json.data.find(f => f.id === feedId)
          if (found) setFeedMeta(found)
        }
      } catch {
        // ignore meta failures
      }
    }
    ensureFeedMeta()
    return () => { cancelled = true }
  }, [feedId, feedMeta])

  // Load articles (server-side paging)
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!feedId) return
      setLoading(true)
      setError(null)
      try {
        const url = new URL(`http://localhost:8080/api/v1/feed/${feedId}/articles`)
        url.searchParams.set('page', String(page))
        url.searchParams.set('size', String(size))
        const res = await fetch(url.toString())
        const json = await res.json().catch(() => ({}))
        if (!cancelled && json && json.statusCode === 200) {
          // Support new shape: data.items + page metadata
          const d = json.data
          if (d && Array.isArray(d.items)) {
            setArticles(d.items)
            setPageInfo({
              totalPages: Number(d.totalPages ?? 0),
              totalElements: Number(d.totalElements ?? d.items.length ?? 0),
              hasNext: Boolean(d.hasNext),
              hasPrevious: Boolean(d.hasPrevious),
            })
          } else if (Array.isArray(json.data)) {
            // Legacy fallback; treat as single page
            setArticles(json.data)
            setPageInfo({ totalPages: 1, totalElements: json.data.length, hasNext: false, hasPrevious: false })
          } else {
            throw new Error('Invalid response structure')
          }
        } else if (!cancelled) {
          throw new Error('Invalid response')
        }
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [feedId, page, size])

  const headerTitle = useMemo(() => {
    if (feedMeta?.title) return feedMeta.title
    if (feedMeta?.url) return sourceFromUrl(feedMeta.url)
    return 'Feed'
  }, [feedMeta])

  function goToPage(p) {
    const tp = pageInfo.totalPages || 0
    if (p < 0 || (tp > 0 && p > tp - 1)) return
    setPage(p)
    // Scroll to top of list on page change
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {}
  }

  function paginationWindow() {
    const total = pageInfo.totalPages || 0
    if (total <= 1) return { pages: [], start: 0, end: 0 }
    const maxButtons = 5
    const half = Math.floor(maxButtons / 2)
    const start = Math.max(0, Math.min(page - half, total - maxButtons))
    const end = Math.min(total, start + maxButtons)
    const pages = Array.from({ length: end - start }, (_, i) => start + i)
    return { pages, start, end, total }
  }

  function rangeLabel() {
    const total = Number(pageInfo.totalElements || 0)
    if (!total) return '0 of 0'
    const start = page * size + 1
    const end = Math.min(total, (page + 1) * size)
    return `${start}–${end} of ${total}`
  }

  function onSizeChange(e) {
    const next = Number(e.target.value)
    if (Number.isFinite(next) && next > 0) {
      setSize(next)
      setPage(0)
    }
  }

  return (
    <div className="feed-page">
      <Header />
      <main className="container py-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Link to="/" className="btn btn-outline-secondary">← Back</Link>
          <h1 className="m-0 h3">{headerTitle}</h1>
        </div>

        {feedMeta?.backgroundImg && (
          <div className="mb-3">
            <img src={feedMeta.backgroundImg} alt="" style={{ height: 56, width: 56, objectFit: 'contain' }} />
          </div>
        )}

        {loading && (
          <p className="text-secondary">Loading articles…</p>
        )}

        {!loading && error && (
          <div className="text-danger">
            <p className="mb-1">Failed to load articles.</p>
            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{String(error.message || error)}</pre>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className="text-secondary">No articles for this feed yet.</p>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
              {articles.map(a => {
                const text = plainText(a.description)
                const preview = text.slice(0, 160)
                const imgFromContent = extractFirstImage(a.content)
                const imgFromDesc = extractFirstImage(a.description)
                const thumb = imgFromContent || imgFromDesc || null
                const dateText = formatDate(a.publishDate) || ''
                const author = a.author || ''
                return (
                  <div key={a.guid} className="col">
                    <div className="post-card h-100">
                      <div className="post-thumb-wrapper" style={{ aspectRatio: '16/9' }}>
                        {thumb ? (
                          <img className="post-thumb" src={thumb} alt="" loading="lazy" />
                        ) : (
                          <div className="post-thumb" style={{ background: 'linear-gradient(135deg,#e2e8f0,#f8fafc)' }} />
                        )}
                      </div>
                      <div className="post-content p-3">
                        <h5 className="post-title mb-2 position-relative">
                          <a href={a.link} target="_blank" rel="noreferrer" className="stretched-link">{a.title || 'Untitled'}</a>
                        </h5>
                        {preview && (
                          <p className="post-desc mb-0">{preview}{text.length > 160 ? '…' : ''}</p>
                        )}
                      </div>
                      <div className="post-footer border-top">
                        <div className="post-meta post-meta-fixed">
                          <div className="post-author">
                            <div className="avatar" style={{ background: '#e2e8f0', display: 'inline-block' }} />
                            <div className="author-text" style={{ lineHeight: 1.15, minWidth: 0 }}>
                              <div className="name fw-semibold" style={{ fontSize: '.95rem' }}>{author || sourceFromUrl(a.link)}</div>
                              <div className="date text-muted" style={{ fontSize: '.85rem' }}>{dateText}</div>
                            </div>
                          </div>
                          <div className="text-muted" aria-hidden="true">&nbsp;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Material-like pager bar */}
            {pageInfo.totalPages > 1 && (() => {
              const { pages, start, end, total } = paginationWindow()
              return (
                <div className="pager-bar mt-4">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label small mb-0 text-muted">Rows per page</label>
                    <select className="form-select form-select-sm w-auto" value={size} onChange={onSizeChange} aria-label="Rows per page">
                      <option value="8">8</option>
                      <option value="12">12</option>
                      <option value="16">16</option>
                      <option value="24">24</option>
                    </select>
                  </div>

                  <div className="text-muted small">{rangeLabel()}</div>

                  <nav aria-label="Articles pagination">
                    <ul className="pagination material mb-0">
                      <li className={`page-item ${page <= 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(0)} aria-label="First" disabled={page <= 0}>&laquo;</button>
                      </li>
                      <li className={`page-item ${!pageInfo.hasPrevious ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(page - 1)} aria-label="Previous" disabled={!pageInfo.hasPrevious}>&lsaquo;</button>
                      </li>

                      {start > 0 && (
                        <li className="page-item disabled"><span className="page-link" aria-hidden>…</span></li>
                      )}

                      {pages.map(p => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => goToPage(p)}>{p + 1}</button>
                        </li>
                      ))}

                      {end < total && (
                        <li className="page-item disabled"><span className="page-link" aria-hidden>…</span></li>
                      )}

                      <li className={`page-item ${!pageInfo.hasNext ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(page + 1)} aria-label="Next" disabled={!pageInfo.hasNext}>&rsaquo;</button>
                      </li>
                      <li className={`page-item ${page >= (pageInfo.totalPages - 1) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(pageInfo.totalPages - 1)} aria-label="Last" disabled={page >= (pageInfo.totalPages - 1)}>&raquo;</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )
            })()}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
