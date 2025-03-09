/* eslint-disable sonarjs/no-identical-functions */
import SearchIcon from "icons/searchIcon"
import React, { useEffect } from "react"
import AsyncSelect from "react-select/async"

const Dropdown = ({
  className,
  id,
  value,
  placeholder,
  defaultOptions,
  onChange,
  loadOptions = () => {},
  error,
  label,
  isMulti = false,
  isSearch = true,
  mandatory = false,
  topClass,
  isIcon = true,
  isPhone,
  isLoading = false,
  isClearable = false,
  dropDownIcon = false,
  searchNDropDown = false,
  ...other
}) => {
  const stylesConfig = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        textTransform: "capitalize",
      }
    },
    control: (provided, { isFocused, isDisabled }) => ({
      ...provided,
      borderRadius: "6px",
      minHeight: 40,
      height: isMulti ? "auto" : 40,
      boxShadow: "none",
      fontSize: "14px",
      borderColor: error ? "#FA5050" : isFocused ? "#40B5E8" : "#E8E6EA",
      "&:hover": {
        borderColor: "#40B5E8",
      },
      color: "#888",
      backgroundColor: error ? "#fcf3f4" : isDisabled ? "#fafafa" : "#ffffff",
      padding: isSearch && isIcon ? "0 12px 0 32px" : "0 5px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 99,
    }),
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        fontSize: 14,
        fontWeight: 500,
        textTransform: "capitalize",
        background: isFocused ? "rgba(64, 181, 232, 0.15)" : "#ffffff",
        color: isFocused ? "rgba(64, 181, 232, 1)" : "rgba(0, 0, 0, 1)",
      }
    },
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      fontWeight: 500,
      color: "#000000",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
      }
    },
    indicatorsContainer: (previousStyle) => ({
      ...previousStyle,
      display: isSearch && searchNDropDown ? "flex" : isSearch && isIcon ? "none" : "flex",
    }),
    dropdownIndicator: (previousStyle) => ({
      ...previousStyle,
      display: dropDownIcon ? "flex" : "none",
    }),
  }

  const phoneStyle = {
    control: (provided, { isFocused, isDisabled }) => ({
      ...provided,
      borderRadius: "6px",
      minHeight: 40,
      boxShadow: "none",
      fontSize: "14px",
      width: "100px",
      minWidth: "100px",
      maxWidth: "100px",
      textAlign: "center",
      border: "0 1px 0 0 solid",
      borderColor: error ? "#FA5050" : isFocused ? "#40B5E8" : "#E8E6EA",
      "&:hover": {
        borderColor: "#40B5E8",
      },
      color: "#888",
      backgroundColor: error ? "#fcf3f4" : isDisabled ? "#fafafa" : "#ffffff",
      padding: "0 6px 0 0 ",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 99,
      width: "250px",
    }),
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        fontSize: 14,
        fontWeight: 500,
        textTransform: "capitalize",
        background: isFocused ? "rgba(64, 181, 232, 0.15)" : "#ffffff",
        color: isFocused ? "rgba(64, 181, 232, 1)" : "rgba(0, 0, 0, 1)",
      }
    },
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      fontWeight: 500,
      color: "#000000",
    }),
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        display: "none",
      }
    },
    indicatorsContainer: (previousStyle) => ({
      ...previousStyle,
      display: isSearch && isIcon ? "none" : "flex",
    }),
  }

  useEffect(() => {
    loadOptions("")
  }, [])

  return (
    <div className={` text-left w-full ${topClass}`}>
      {label && (
        <label htmlFor={id} className="inline-block mb-1.5 text-sm text-dark-gray font-semibold">
          {label}
          {mandatory && <span className="text-red pl-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {isSearch && isIcon && (
          <div className="absolute top-2/4 -translate-y-2/4 left-3.5 z-[1]">
            <SearchIcon />
          </div>
        )}

        <AsyncSelect
          isLoading={isLoading}
          isSearchable={isSearch}
          isClearable={isClearable}
          id={id}
          menuPlacement="auto"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          classNamePrefix="react-select"
          // onCreateOption={onCreateOption}
          onInputChange={(e) => {
            if (!e) {
              loadOptions("")
            }
          }}
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          styles={isPhone ? phoneStyle : stylesConfig}
          isMulti={isMulti}
          {...other}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red">{error}</p>}
    </div>
  )
}

export default Dropdown
