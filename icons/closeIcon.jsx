import React from "react"

const CloseIcon = ({ fill = "#02a2ff" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
      <path
        id="CloseBtn"
        d="M5.455,5.455V0H7.273V5.455h5.455V7.273H7.273v5.455H5.455V7.273H0V5.455Z"
        transform="translate(0 9) rotate(-45)"
        fill={fill}
      />
    </svg>
  )
}

export default CloseIcon
