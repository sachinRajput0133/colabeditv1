import React from "react"

const Checkbox = ({ title, For, id, checked, topClass, onChange, rest, isContact = false }) => {
  return (
    <div className={`flex   gap-3 ${topClass}`}>
      <input
        className={`cursor-pointer ${isContact === true ? "mt-0.5" : "mt-1"} `}
        checked={checked}
        type="checkbox"
        onChange={onChange}
        {...rest}
        id={id}
        name="mcq"
      />
      {title && (
        <label className={`text-sm inline-block ${isContact === true && "text-white"} cursor-pointer`} htmlFor={For}>
          {title}
        </label>
      )}
    </div>
  )
}

export default Checkbox
