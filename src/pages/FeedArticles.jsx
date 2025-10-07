import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'

function formatDate(ts) {
  try {
    const d = ts ? new Date(ts) : null
    if (!d || isNaN(d.getTime())) return null
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
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
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link to="/" className="btn btn-ghost">← Back</Link>
          <h1 style={{ margin: 0 }}>{headerTitle}</h1>
        </div>

        {feedMeta?.backgroundImg && (
          <div style={{ marginBottom: '1rem' }}>
            <img src={feedMeta.backgroundImg} alt="" style={{ height: 56, width: 56, objectFit: 'contain' }} />
          </div>
        )}

        {loading && (
          <p style={{ color: 'var(--muted)' }}>Loading articles…</p>
        )}

        {!loading && error && (
          <div style={{ color: 'var(--danger)' }}>
            <p>Failed to load articles.</p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error.message || error)}</pre>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No articles for this feed yet.</p>
        )}

        {!loading && !error && articles.length > 0 && (
          <ul className="articles" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
            {articles.map(a => (
              <li key={a.guid} className="article-card" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
                <h2 style={{ marginTop: 0, marginBottom: '.25rem' }}>
                  <a href={a.link} target="_blank" rel="noreferrer">{a.title || 'Untitled'}</a>
                </h2>
                <p style={{ margin: 0, color: 'var(--muted)' }}>
                  {a.author ? `${a.author} · ` : ''}{formatDate(a.publishDate) || ''}
                </p>
                {a.description && (
                  <p style={{ marginTop: '.5rem' }}>
                    {a.description.replace(/<[^>]*>/g, '').slice(0, 240)}{a.description.length > 240 ? '…' : ''}
                  </p>
                )}
                <div style={{ marginTop: '.5rem' }}>
                  <a className="btn" href={a.link} target="_blank" rel="noreferrer">Read more</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  )
}

