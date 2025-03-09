import useTranslation from "next-translate/useTranslation"
import getConfig from "next/config"
import { useRouter } from "next/router"
import React from "react"
import { convertCurrency } from "utils/util"

const { publicRuntimeConfig } = getConfig()

const CheckoutCart = ({
  image,
  title,
  duration,
  className,
  sellingPrice,
  basePrice,
  globalCurrRetailPrice,
  globalCurrSellPrice,
  question,
  withBoder = true,
}) => {
  const { t: languageTranslater } = useTranslation("common")
  const { locale } = useRouter()
  const sellingPriceValue = locale === "en" ? globalCurrSellPrice : sellingPrice
  const retailPrice = locale === "en" ? globalCurrRetailPrice : basePrice
  return (
    <div
      className={`bg-white p-4 ${
        withBoder && "border"
      } border-light-gray rounded-lg flex items-center gap-4 flex-wrap md:flex-nowrap justify-between ${className}`}
    >
      <div className="flex items-center gap-3 sm:flex-nowrap flex-wrap">
        <img
          src={publicRuntimeConfig.NEXT_PUBLIC_S3_URL + image}
          className="sm:h-20 sm:w-20 sm:min-w-[80px] w-10 h-10 min-w-[40px] object-cover rounded-lg"
          alt=""
        />
        <div>
          <h4 className="font-bold text-black lg:text-lg mb-1.5">{title}</h4>
          <div className="flex flex-wrap gap-3">
            <p className="text-gray font-medium text-sm">
              {duration} | {question && question === 0 ? "No" : question} {languageTranslater("questions")}
            </p>
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

export default CheckoutCart
