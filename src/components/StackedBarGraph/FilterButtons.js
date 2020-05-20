import React from 'react'

const FilterButtons = ({ keysState, keysArray, setKeysArray, colors, onCheckboxChange } ) => {
    return (
        <div className="fields">
          {
            keysArray.map(key => (
              <div key={key} className="fieldContainer mentalHealthFieldContainer" style={{ backgroundColor: colors[key] }}>
                <div className="field">
                  <input
                    id={key}
                    type="checkbox"
                    checked={keysState.includes(key)}
                    onChange={(e) => onCheckboxChange(e, key, keysState, setKeysArray)}
                  />
                  <label htmlFor={key}>
                    {/* The key is in camel case, so this will split it into individual words */}
                    {`${key.charAt(0).toUpperCase()}${key.substring(1).replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
                  </label>
                </div>
              </div>
            ))
          }
        </div>
    )
}

export default FilterButtons