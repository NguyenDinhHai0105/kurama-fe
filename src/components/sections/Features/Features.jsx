import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { features as fallbackFeatures } from '../../../data/features.js'
import Feature from './Feature.jsx'

export default function Features() {
    const [items, setItems] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const res = await fetch('http://localhost:8080/api/v1/feed')
                const json = await res.json().catch(() => ({}))
                if (!cancelled && json && json.statusCode === 200 && Array.isArray(json.data)) {
                    setItems(json.data)
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
    }, [])

    function formatDateMeta(ts) {
        try {
            if (!ts) return null
            const d = ts ? new Date(ts) : new Date()
            if (isNaN(d.getTime())) return null
            const month = d.toLocaleString(undefined, { month: 'short' }).toUpperCase()
            const day = d.toLocaleString(undefined, { day: '2-digit' })
            return `${month} ${day}`
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
            return 'DEV BLOG'
        }
    }

    const renderFromApi = () => (
        <>
            {items && items.map(item => (
                <Feature
                    key={item.id || item.title}
                    icon="📰"
                    title={item.title || 'Untitled'}
                    backgroundImg={item.backgroundImg}
                    onClick={() => item.id && navigate(`/feed/${item.id}`, { state: { feed: item } })}
                />
            ))}
        </>
    )

    const renderFallback = () => (
        <>
            {fallbackFeatures.map(f => (
                <Feature key={f.title} icon={f.icon} title={f.title}>{f.desc}</Feature>
            ))}
        </>
    )

    return (
        <section className="features" id="features">
            <h2>Latest posts from the Dev Blog</h2>
            <div className="grid">
                {loading && renderFallback()}
                {!loading && !error && items && items.length > 0 && renderFromApi()}
                {!loading && (!items || items.length === 0) && !error && (
                    <p style={{ gridColumn: '1 / -1', color: 'var(--muted)' }}>No posts yet. Check back soon.</p>
                )}
                {!loading && error && renderFallback()}
            </div>
        </section>
    )
}
