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
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Load articles
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!feedId) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://localhost:8080/api/v1/feed/${feedId}/articles`)
        const json = await res.json().catch(() => ({}))
        if (!cancelled && json && json.statusCode === 200 && Array.isArray(json.data)) {
          setArticles(json.data)
        } else if (!cancelled) {
          setError(new Error('Invalid response'))
        }
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [feedId])

  const headerTitle = useMemo(() => {
    if (feedMeta?.title) return feedMeta.title
    if (feedMeta?.url) return sourceFromUrl(feedMeta.url)
    return 'Feed'
  }, [feedMeta])

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
                      <div className="post-meta">
                         <div className="post-author">
                           <div className="avatar" style={{ background: '#e2e8f0', display: 'inline-block' }} />
                           <div className="author-text" style={{ lineHeight: 1.15, minWidth: 0 }}>
                             <div className="name fw-semibold" style={{ fontSize: '.95rem' }}>{author || sourceFromUrl(a.link)}</div>
                             <div className="date text-muted" style={{ fontSize: '.85rem' }}>{dateText}</div>
                           </div>
                         </div>
                         {/* Right side placeholder for future actions (e.g., comments) */}
                         <div className="text-muted" aria-hidden="true">&nbsp;</div>
                       </div>
                     </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
