import React from 'react'

const DropShadow = ({ stdDeviation, slope }) => {
    return (
        <defs>
            <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={stdDeviation}/> 
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope={slope}/>
            </feComponentTransfer>
            <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
            </feMerge>
            </filter>
        </defs>
    )
}

export default DropShadow