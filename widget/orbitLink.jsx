import Link from "next/link"
import React from "react"

const OrbitLink = ({ href, className, children, dataTip, ...other }) => {
  if (!href) {
    return (
      <a className={className} data-tip={dataTip} {...other}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} prefetch={false} className={className} data-tip={dataTip} {...other}>
      {children}
    </Link>
  )
}

export default OrbitLink
