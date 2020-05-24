import React from 'react'

const Legend = ({ keys, colors }) => {
    return (
        <article className="legend">
            {
                keys.map((key, i) => {
                    // Capitalise first letter of key
                    const capitalisedKey = `${key.charAt(0).toUpperCase()}${key.substring(1)}`
                    return (
                        <div key={i} className="key" style={{ backgroundColor: colors[i] }}>
                            <p>{capitalisedKey}</p>
                        </div>
                    )
                })
            }
        </article>
    )
}

export default Legend