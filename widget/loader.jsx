import React from "react"

const CustomLoader = ({ relative = false, showtext }) => {
  return (
    <div className={`orbit-loader ${relative ? "absolute z-[10]" : "fixed z-[5000]"} `}>
      <div className="font-bold loader-text">{showtext}</div>
      <div className="gooey ">
        <span className="dot" />
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

export default CustomLoader
