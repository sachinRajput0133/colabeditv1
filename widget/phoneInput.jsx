import commonApi from "api"
import cx from "classnames"
import React, { useEffect, useState } from "react"
import { debounce } from "utils/util"

import Dropdown from "./dropdown"

const PhoneInput = ({
  type = "text",
  disabled = false,
  placeholder,
  label,
  rest,
  error,
  className,
  value,
  onChange,
  mandatory = false,
  maxLength,
  minLength,
  defaultValue = "",
  register,
  setValue,
  values,
  isIcon = true,
  isSearch = false,
  isContact = false,
  setCountryList = () => {},
  // isLoading = false,
  onKeyDown = () => false,
}) => {
  const [countryCode, setCountryCode] = useState()
  const [loading, setloading] = useState(true)

  const classes = cx(
    className,
    `px-4 h-10 !pl-28 focus:outline-none text-sm rounded-md placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray`,
    { "bg-disabled-gray": disabled },
    { "!text-red bg-red bg-opacity-5 border-red hover:border-red": error }
  )
  const classesContact = cx(
    className,
    `px-4 h-10 !pl-28 focus:outline-none text-sm rounded-md placeholder:text-gray-50 w-full focus:border focus:border-primary transition border border-light-gray`,
    { "bg-disabled-gray": disabled },
    { "!text-red  bg-white border-red hover:border-red": error }
  )

  const getCountryCode = debounce(async (search, callback) => {
    const payload = {
      options: {
        pagination: false,
      },
      query: {
        searchColumns: ["name", "code"],
        search: "",
      },
    }

    if (search) {
      payload.query.search = search
      payload.query.searchColumns = ["name", "code"]
    }
    if (!countryCode) {
      setloading(true)
    }
    try {
      await commonApi({
        action: "countryCode",
        data: payload,
      }).then((data) => {
        const response = data[1]?.data.data
        const country =
          response?.map(({ ISDCode, name }) => ({
            value: ISDCode,
            label: `+${ISDCode}-${name}`,
          })) || []
        setloading(false)
        if (search) {
          callback?.(country)
        } else {
          if (!countryCode) {
            setCountryCode(country)
            setCountryList(response)
          }
        }
        // eslint-disable-next-line promise/always-return
        return callback?.([])
      })
    } catch (error_) {
      return error_
    }
  }, 500)

  useEffect(() => {
    getCountryCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="text-left">
      {label && (
        <label
          htmlFor="phoneInput"
          className={`inline-block mb-1.5 text-sm ${
            isContact === true ? "text-white" : "text-dark-gray"
          }   font-semibold`}
        >
          {label}
          {mandatory && <span className="text-red pl-0.5 font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <Dropdown
          isLoading={loading}
          isIcon={isIcon}
          id="phoneInput"
          isSearch={isSearch}
          topClass="absolute inset-y-0 left-0 z-[10] inline-flex items-center countryCode !w-auto"
          isPhone
          setValue={setValue}
          isClearable={false}
          isDisabled={disabled}
          value={values ? { value: values, label: `+${values}` } : ""}
          defaultOptions={countryCode}
          loadOptions={getCountryCode}
          register={register("countryCode")}
          onChange={(opt) => {
            setValue("countryCode", opt?.value)
          }}
          placeholder=""
        />
        <input
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          className={isContact ? classesContact : classes}
          maxLength={maxLength}
          minLength={minLength}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...rest}
        />
      </div>

      {error && <p className={`mt-1.5 text-sm ${isContact === true ? "text-[#EE4B2B]" : "text-red"}  `}>{error}</p>}
    </div>
  )
}

export default PhoneInput
