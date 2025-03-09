import React from "react"

const CustomCheckbox = ({ title, id, checked, onChange, className, labelClassName }) => {
  return (
    <div className="flex items-center gap-3">
      {title && (
        <label className={`text-sm inline-block  normal-case text-left showCustomCheck ${labelClassName}`} htmlFor={id}>
          {title}
          <input type="checkbox" id={id} name="mcq" checked={checked} onChange={onChange} />
          <span className={`checkmark ${className}`} />
        </label>
      )}
    </div>
  )
}

export default CustomCheckbox
