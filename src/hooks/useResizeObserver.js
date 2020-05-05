import { useEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null)
    useEffect(() => {
        const observerTarget = ref.current
        const resizedObserver = new ResizeObserver(entries => {
            entries.forEach(entry => setDimensions(entry.contentRect))
        })
        resizedObserver.observe(observerTarget)
        return () => {
            resizedObserver.unobserve(observerTarget)
        }
    }, [ref])
    return dimensions
}