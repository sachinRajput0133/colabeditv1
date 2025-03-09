/* eslint-disable unicorn/prefer-set-has */
/* eslint-disable jsx-a11y/label-has-associated-control */
import cx from "classnames"
import React from "react"

const Input = ({
  type = "text",
  disabled = false,
  placeholder,
  label,
  rest,
  error,
  className,
  id,
  value,
  onChange,
  topClass = false,
  mandatory = false,
  isListPage = false,
  isNumber = false,
  isContact = false,
}) => {
  const IGNORE = ["e", "E", "-", ".", "+"]
  const classes = cx(
    className,
    `px-4  ${
      isListPage && "pr-20"
    }  h-10 focus:outline-none text-sm rounded-md placeholder:capitalize placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray`,
    { "bg-disabled-gray": disabled },
    { "!text-red bg-red bg-opacity-5 border-red hover:border-red": error }
  )
  const classesContact = cx(
    className,
    `px-4  ${
      isListPage && "pr-20"
    }  h-10 focus:outline-none text-sm rounded-md placeholder:capitalize placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray`,
    { "bg-disabled-gray": disabled },
    { "!text-red  bg-opacity-100  bg-white border-red hover:border-red": error }
  )

  return (
    <div className={`${topClass}   text-left w-full  `}>
      {label && (
        <label
          className={`inline-block mb-1.5 text-sm ${
            isContact === true ? "text-white" : "text-dark-gray"
          }   font-semibold`}
        >
          {label}
          {mandatory && <span className="text-red pr  pl-0.5">*</span>}
        </label>
      )}
      <input
        onKeyDown={(evt) => isNumber && IGNORE.includes(evt.key) && evt.preventDefault()}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        className={isContact === true ? classesContact : classes}
        value={value}
        onChange={onChange}
        id={id}
        {...rest}
      />
      {error && <p className={`mt-1.5 text-sm ${isContact === true ? "text-[#EE4B2B]" : "text-red"}  `}>{error}</p>}
    </div>
  )
}

export default Input
