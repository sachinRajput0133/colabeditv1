/* eslint-disable no-empty */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-fragments */
import commonApi from "api"
import SearchIcon from "icons/searchIcon"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AsyncSelect from "react-select/async"

const MasterSelect = ({
  name,
  onChangeSelect,
  className,
  id,
  value,
  placeholder,
  defaultOptions,
  isSearchable = true,
  onChange,
  loadOptions,
  code,
  onInputChange = () => {},
  isSearch = true,
  error,
  isMulti,
  searchNDropDown = false,
  label,
  dropDownIcon = true,
  isClearable = true,
  mandatory = false,
  ...other
}) => {
  const router = useRouter()
  const { locale } = router
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState()
  const loadMasterOptions = async (inputValue, callback) => {
    try {
      await commonApi({
        action: "list",
        module: "masters",
        data: {
          query: {
            searchColumns: ["name", "code"],
            search: inputValue,
            parentCode: code,
            isActive: true,
          },
        },
        common: true,
        config: {
          headers: { lng: locale },
        },
      }).then(([, { data = {} }]) => {
        const optionList = data?.data?.map((list = {}) => {
          if ((list?._id || list?.id) === value?.value) {
            setSelected({
              value: list?._id || list?.id,
              label: list?.names?.[locale] || list?.name,
              names: list?.names,
            })
          }
          return {
            value: list?._id || list?.id,
            label: list?.names?.[locale] || list?.name,
            names: list?.names,
          }
        })

        callback?.(optionList)
        setOptions(optionList)
        return false
      })
    } finally {
    }
  }

  const onSelectChange = (data) => {
    onChange?.(data)
    setSelected(data)
  }

  useEffect(() => {
    loadMasterOptions()
  }, [])

  useEffect(() => {
    const optionList = options?.map((prev) => ({ ...prev, label: prev?.names?.[locale] || prev.label }))
    setOptions(optionList)
    if (selected) {
      if (Array.isArray(selected)) {
        const select = selected.map((e) => ({ ...e, label: e?.names?.[locale] || e?.label }))
        setSelected(select)
      } else {
        setSelected({
          ...selected,
          label: selected?.names?.[locale] || selected?.label,
        })
      }
    }
  }, [locale])

  useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  const stylesConfig = {
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
      padding: isSearch ? "0 12px 0 32px" : "0 12px",
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
      display: isSearch && searchNDropDown ? "flex" : isSearch ? "none" : "flex",
    }),
    dropdownIndicator: (previousStyle) => ({
      ...previousStyle,
      display: dropDownIcon ? "flex" : "none",
    }),
  }

  return (
    <div className="text-left">
      {label && (
        <label className="inline-block mb-1.5 text-sm text-dark-gray font-semibold">
          {label}
          {mandatory && <span className="text-red pl-0.5 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        {isSearch && (
          <div className="absolute z-[1] top-2/4 -translate-y-2/4 left-4">
            <SearchIcon />
          </div>
        )}
        <AsyncSelect
          isSearchable={isSearchable}
          isClearable={isClearable}
          className={`basic-single text-left ${className}`}
          classNamePrefix={name}
          name={name}
          styles={stylesConfig}
          id={id}
          placeholder={placeholder}
          value={selected}
          onInputChange={onInputChange}
          onChange={onSelectChange}
          loadOptions={loadMasterOptions}
          defaultOptions={options}
          isMulti={isMulti}
          {...other}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red">{error}</p>}
    </div>
  )
}

export default MasterSelect
