/* eslint-disable jsx-a11y/label-has-associated-control */
import cx from "classnames"
import React from "react"

const Textarea = ({
  type = "text",
  onChange,
  required,
  mandatory = false,
  placeholder,
  label,
  rest,
  error,
  className = "px-5 py-3",
  value,
  rows = "3",
  disabled = false,
  isContact = false,
}) => {
  const classes = cx(
    className,
    `px-4 focus:outline-none text-sm rounded-md placeholder:capitalize placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray min-h-[128px] `,
    { "bg-disabled-gray": disabled },
    { "!text-red bg-red bg-opacity-5 border-red hover:border-red": error }
  )
  const classesContact = cx(
    className,
    `px-4 focus:outline-none text-sm rounded-md placeholder:capitalize placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray min-h-[128px] ${
      type === "email" ? "" : "capitalize"
    }`,
    { "bg-disabled-gray": disabled },
    { "!text-red bg-red bg-white border-red hover:border-red": error }
  )

  return (
    <div className="text-left">
      <label
        className={`inline-block mb-1.5 text-sm ${
          isContact === true ? "text-white" : "text-dark-gray"
        }   font-semibold`}
      >
        {label}
        {(mandatory || required) && <span className="text-red pl-0.5">*</span>}
      </label>
      <textarea
        type={type}
        placeholder={placeholder}
        className={isContact === true ? classesContact : classes}
        rows={rows}
        // eslint-disable-next-line react/jsx-props-no-spreading
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <p className={`mt-1.5 text-sm ${isContact === true ? "text-[#EE4B2B]" : "text-red"}  `}>{error}</p>}
    </div>
  )
}

export default Textarea
