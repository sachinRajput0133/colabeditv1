import useTranslation from "next-translate/useTranslation"
import getConfig from "next/config"
import { useRouter } from "next/router"
import React from "react"
// import ReactTooltip from "react-tooltip"
import { convertCurrency } from "utils/util"
import OrbitLink from "widget/orbitLink"

const { publicRuntimeConfig } = getConfig()

const CartCard = ({
  image,
  title,
  className,
  minutes,
  slug = "no-slug",
  sellingPrice,
  basePrice,
  withBoder = true,
  removeAssessment = true,
  assessmentId,
  question,
  removeCartItem,
  globalCurrRetailPrice,
  globalCurrSellPrice
}) => {
  const { locale } = useRouter()
  const handleCartItem = () => {
    removeCartItem(assessmentId)
  }
  const { t: languageTranslater } = useTranslation("common")
  const sellingPriceValue = locale === "en" ? globalCurrSellPrice : sellingPrice
  const retailPrice = locale === "en" ? globalCurrRetailPrice : basePrice

  return (
    <div
      className={`bg-white p-4 ${
        withBoder && "border"
      } border-light-gray rounded-md flex items-center gap-4 md:flex-nowrap flex-wrap justify-between ${className}`}
    >
      <div className="flex items-center gap-3 sm:flex-nowrap flex-wrap">
        <img
          src={publicRuntimeConfig.NEXT_PUBLIC_S3_URL + image}
          className="sm:h-20 sm:w-20 sm:min-w-[80px] w-10 h-10 min-w-[40px] object-cover rounded-md"
          alt=""
        />
        <div>
          <OrbitLink href={`/assessment/${slug}`}>
            <h4 className="font-bold text-black lg:text-lg mb-1.5" data-tip={title}>
              {title}
            </h4>
            {/* <ReactTooltip /> */}
          </OrbitLink>
          <div className="flex flex-wrap gap-3">
            <p className="text-gray font-medium text-sm">
              {minutes} | {question && `${question === 0 ? "No" : question}`} {languageTranslater("questions")}
            </p>
            {removeAssessment && (
              <button type="button" onClick={() => handleCartItem()} className="text-primary text-sm underline">
                {languageTranslater("removeAssessment")}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end items-end gap-2">
        <h4 className="text-lg font-bold text-primary">
          {convertCurrency(sellingPriceValue, locale, languageTranslater, false)}
        </h4>
        <h6 className="font-semibold text-gray line-through text-base">{convertCurrency(retailPrice, locale)}</h6>
      </div>
    </div>
  )
}

export default CartCard
