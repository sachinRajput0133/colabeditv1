import React from "react"

const BuyIcon = ({ size = "24", className, ...other }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      className={className}
      viewBox="0 0 18.663 18.921"
      {...other}
    >
      <path
        id="Path_19740"
        data-name="Path 19740"
        d="M3.653,5.9.757,3.017l1.264-1.26,2.9,2.889H18.527a.891.891,0,0,1,.856,1.146l-2.143,7.126a.893.893,0,0,1-.856.635H5.439v1.781h9.823v1.781H4.546a.892.892,0,0,1-.893-.891Zm1.786.522v5.344h10.28l1.607-5.344ZM4.993,20.678a1.336,1.336,0,1,1,1.34-1.336A1.338,1.338,0,0,1,4.993,20.678Zm10.716,0a1.336,1.336,0,1,1,1.34-1.336A1.338,1.338,0,0,1,15.709,20.678Z"
        transform="translate(-0.757 -1.757)"
        fill="currentColor"
      />
    </svg>
  )
}

export default BuyIcon
