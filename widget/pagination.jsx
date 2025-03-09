/* eslint-disable no-unused-vars */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable unicorn/consistent-function-scoping */
import PaginationLeft from "icons/paginationLeft"
import PaginationRight from "icons/paginationRight"
import React, { useMemo } from "react"
import OrbitLink from "./orbitLink"

// import PaginationLeft from "../icons/paginationLeft"
// import PaginationRight from "../icons/paginationRight"
// import OrbitLink from "./orbitLink"

const DOTS = "..."
const range = (start, end) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}
export const usePagination = ({ pageCount, siblingCount = 1, currentPage }) => {
  return useMemo(() => {
    if (pageCount <= 6) {
      return range(1, pageCount)
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, pageCount)
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < pageCount - 2
    const firstPageIndex = 1
    const lastPageIndex = pageCount
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, pageCount]
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(pageCount - rightItemCount + 1, pageCount)
      return [firstPageIndex, DOTS, ...rightRange]
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
    return false
  }, [pageCount, currentPage, siblingCount])
}

const Paginate = ({ paginate = {}, onPaginationChange = {} }) => {
  const { currentPage, hasNextPage, hasPrevPage, pageCount = 1, next, prev, offset } = paginate

  const paginationRange = usePagination({
    currentPage,
    pageCount,
  })

  const forword = offset + 12
  const backword = offset - 12

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold pagination text-dark-gray">
      <OrbitLink
        onClick={() => hasPrevPage && onPaginationChange(backword)}
        className={`flex items-center justify-center w-10 h-10 border rounded-md border-light-gray ${
          hasPrevPage ? "cursor-pointer hover:border-primary" : "cursor-not-allowed opacity-60"
        }`}
      >
        <PaginationLeft />
      </OrbitLink>
      {paginationRange.map((i) => {
        const offsetValue = i * 12 - 12
        return (
          <OrbitLink
            onClick={() => i !== DOTS && i !== currentPage && onPaginationChange(offsetValue)}
            className={`flex items-center justify-center w-10 h-10 border rounded-md  hover:border-primary cursor-pointer  ${
              i === currentPage ? "bg-primary text-white border-primary" : "bg-white text-gray border-light-gray"
            }`}
          >
            {i}
          </OrbitLink>
        )
      })}
      <OrbitLink
        onClick={() => hasNextPage && onPaginationChange(forword)}
        className={`flex items-center justify-center w-10 h-10 border rounded-md border-light-gray ${
          hasNextPage ? "cursor-pointer hover:border-primary" : "cursor-not-allowed opacity-60"
        }`}
      >
        <PaginationRight />
      </OrbitLink>
    </div>
  )
}

export default Paginate
