import React from "react"
import Button from "widget/button"
import OrbitLink from "widget/orbitLink"

const NotificationCard = ({ image, title, className, days, time }) => {
  return (
    <OrbitLink className="flex gap-3 py-4 overflow-hidden rounded-lg" href="/notification">
      <span className="shrink-0">
        <img
          src={image}
          className="min-h-[64px] h-16 min-w-[64px] w-16 object-cover rounded-md"
          alt=""
          loading="lazy"
        />
      </span>
      <span className={`grid w-full gap-2 ${className}`}>
        <span className="grid gap-1">
          <span className="flex flex-row items-center w-full gap-3">
            <span className="flex-col gap-1.5 flex justify-between">
              <h4 className="font-semibold line-clamp-2">{title}</h4>
              <p className="text-xs text-dark-gray">{time}</p>
            </span>
            <OrbitLink
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="text-primary font-bold text-xs ml-auto p-2 border rounded-md whitespace-nowrap z-40"
            >
              Mark As Read
            </OrbitLink>
          </span>
          <span className="flex items-center gap-3">
            <span>
              <p>Good Morning.</p>
            </span>
          </span>
        </span>
      </span>
    </OrbitLink>
  )
}

export default NotificationCard
