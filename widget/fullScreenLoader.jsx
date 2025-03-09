import React from "react"

const FullScreenLoader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white    bg-opacity-50 flex flex-col items-center justify-center">
      <div className="orbit-loader  opacity-100 ">
        <div className="gooey ">
          <span className="dot" />
          <div className="dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullScreenLoader
