/* eslint-disable sonarjs/no-extra-arguments */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/no-null */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/jsx-fragments */
import commonApi from "api"
import { getCookie } from "cookies-next"
import CloseIcon from "icons/closeIcon"
import SearchIcon from "icons/searchIcon"
import SearchIcon2 from "icons/searchIcon2"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AsyncSelect from "react-select/async"
import usePaginate from "shared/hook/usePaginate"
import routes from "utils/routes"
import { debounce } from "utils/util"

const SearchSelectDropdown = ({
  name,
  onChangeSelect,
  className,
  id,
  value,
  placeholder = "Select",
  defaultOptions,
  loadOptions,
  module,
  error,
  isMulti,
  label,
  heightIsAuto = false,
  isSearch = true,
  isSearchRightIcon = false,
  dropdownOption = true,
  isClearIcon = false,

  ...other
}) => {
  const [options, setOptions] = useState()
  const [selectValue, setSelectValue] = useState()
  const [searchValue, setSearchValue] = useState()
  const [searchInput, setSearchInput] = useState()
  const [menuIsOpen, setMenuIsOpen] = useState()
  const [isCloseButton, setIsCloseButton] = useState(false)
  const router = useRouter()

  const StylesConfig = {
    control: (provided, { isFocused }) => ({
      ...provided,
      padding: isSearchRightIcon ? "0 50px 0 0" : "0",
      borderRadius: "6px",
      boxShadow: "none",
      fontSize: "15px",
      height: !heightIsAuto ? "50px" : "auto",
      fontWeight: "400",
      borderColor: isFocused ? "#40B5E8" : "#ddd",
      "&:hover": {
        borderColor: "#40B5E8",
      },
      color: "#888",
      border: "none",
      maxWidth: "448px",
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      backgroundColor: isFocused ? "#40B5E8" : "#fff",
      color: isFocused ? "#fff" : "#000",
      fontSize: 15,
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 15,
      fontWeight: 500,
      color: "#000000",
    }),
    valueContainer: (provided, { isFocused }) => ({
      ...provided,
      fontSize: 15,
      fontWeight: isFocused ? 500 : 400,
      color: "#000000",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "250px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: "9999",
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#888",
      }
    },
    indicatorsContainer: (provided) => ({
      ...provided,
      display: "flex",
    }),
  }

  const getData = async (inputValue, callback) => {
    const payload = {
      options: {
        offset: 0,
        limit: 10,
      },
      query: {
        search: inputValue,
        searchColumns: ["assessmentId.title", "projectId.name"],
      },
    }
    await commonApi({
      action: "assessmentList",
      parameters: [getCookie("deviceToken")],
      data: payload,
    }).then(([, response = {}]) => {
      const listData = response?.data?.data?.map((a) => ({
        ...a,
        value: a?.assessmentId?._id,
        label: a?.assessmentId?.title,
      }))

      if (inputValue) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback?.(listData)
      } else {
        setOptions(listData)
      }
      return false
    })
  }

  const loadMasterOptions = debounce(async (inputValue, callback) => {
    setMenuIsOpen(true)
    getData(inputValue, callback)
  })

  const onInputChange = (data) => {
    setIsCloseButton(true)
    setSearchValue(data)
    setSearchInput(data)
  }

  const onKeyDown = (e) => {
    if (e?.keyCode === 13) {
      e.preventDefault()
      setMenuIsOpen(false)
      const searchData = {
        value: searchValue,
        label: searchValue,
      }

      setSelectValue(searchData)

      router.push(`${routes.assessment}?search=${searchValue || ""}`)
    }
  }

  const onClickHandel = () => {
    const searchData = {
      value: searchInput,
      label: searchInput,
    }
    setSelectValue(searchData)

    router.push(`${routes.assessment}?search=${searchInput || ""}`)
  }

  const onChange = (data) => {
    if (!data) {
      setSelectValue()
      setSearchValue()
      return
    }

    router.push(`${routes.assessment}?search=${data?.label}`)

    setSelectValue(data)
  }

  useEffect(() => {
    return () => {
      if (router.query.search) {
        setSelectValue("")
        setSearchValue()
      }
    }
  }, [router.query.slug])

  return (
    <div className="relative flex items-center bg-white pl-2 py-1 rounded-md banner-search w-full">
      <AsyncSelect
        isSearchable
        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
        noOptionsMessage={() => null}
        className={`basic-single text-left ${className} placeholder:capitalize`}
        placeholder={placeholder}
        classNamePrefix={name}
        name={name}
        instanceId="search-select"
        styles={StylesConfig}
        id={id}
        inputValue={searchInput}
        value={value}
        onInputChange={onInputChange}
        onMenuClose={() => setSearchInput(searchValue)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        isClearable
        loadOptions={dropdownOption && loadMasterOptions}
        defaultOptions={options}
        menuIsOpen={menuIsOpen}
        closeMenuOnSelect
        {...other}
      />

      {isClearIcon && searchInput && (
        <div className="absolute right-0 inset-y-0 flex items-center pr-14">
          <button
            onClick={() => {
              setSearchValue("")
              setSearchInput("")
              setIsCloseButton(false)
            }}
            type="button"
            className="h-10 w-10 bg-white transition rounded-md flex items-center justify-center focus:outline-none"
          >
            <CloseIcon fill="#666666" />
          </button>
        </div>
      )}
      {isSearchRightIcon && (
        <div className="absolute right-0 inset-y-0 flex items-center pr-2">
          <button
            onClick={() => onClickHandel(searchValue)}
            type="button"
            className="h-10 w-10 text-white bg-primary hover:bg-dark-blue transition rounded-md flex items-center justify-center focus:outline-none"
          >
            <SearchIcon2 fill="#ffffff" />
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchSelectDropdown
