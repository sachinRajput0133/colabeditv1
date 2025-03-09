import SearchIcon from "icons/searchIcon"
import React from "react"

const SearchInput = ({ type = "text", value, placeholder, className, onChange }) => {
  const handleChange = (event) => onChange && onChange(event.target.value)

  return (
    <div className="text-left">
      <div className="relative flex items-center">
        <div className="absolute right-5">
          <SearchIcon />
        </div>
        <input
          value={value}
          type={type}
          placeholder={placeholder}
          className={`bg-white focus:outline-none px-5 py-3.5 text-sm rounded-md  w-full focus:border focus:border-blue transition border border-light-gray pr-10 ${className}`}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default SearchInput
