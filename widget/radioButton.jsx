import React from "react"

const RadioButton = ({ title, For, id, onChange, name, checked, className = "text-sm", defaultChecked = false }) => {
  return (
    <div className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        className="cursor-pointer radio-input"
        type="radio"
        id={id}
        name={name}
        onChange={onChange}
        checked={checked}
        defaultChecked={defaultChecked}
      />
      <label className="inline-block cursor-pointer" htmlFor={For}>
        {title}
      </label>
    </div>
  )
}

export default RadioButton
