/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
import cx from "classnames"
import EyeIcon from "icons/eye"
import EyeCloseIcon from "icons/eyeClose"
import React, { useState } from "react"

const PasswordInput = ({
  placeholder,
  rest,
  error,
  disabled = false,
  label = false,
  mandatory = false,
  className,
  value,
  onChange = () => false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const classes = cx(
    className,
    `px-4 h-10 focus:outline-none text-sm rounded-md placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray`,
    { "bg-disabled-gray": disabled },
    { "!text-red bg-red bg-opacity-5 border-red hover:border-red": error }
  )

  return (
    <div className="text-left">
      {label && (
        <label className="inline-block mb-1.5 text-sm text-dark-gray font-semibold">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3 relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={classes}
          {...rest}
        />

        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4">
          {showPassword ? <EyeIcon fill="#888" /> : <EyeCloseIcon />}
        </button>
      </div>
      {error && <p className="text-sm mt-1.5 text-red">{error}</p>}
    </div>
  )
}

export default PasswordInput
