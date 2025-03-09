/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable no-unused-vars */
import getConfig from "next/config"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { convertCurrency, getTime } from "utils/util"
import ReactTooltip from "react-tooltip"
import Button from "./button"
import OrbitLink from "./orbitLink"
import { useRouter } from "next/router"
// import { t } from "i18next"
const { publicRuntimeConfig } = getConfig()

const Card = (properties) => {
  const { t: languageTranslater } = useTranslation("common")
  const {
    testAssessment,
    loading,
    title,
    duration,
    question,
    price,
    realPrice,
    buttonTitle,
    onClick,
    img,
    slug,
    instr,
    globalCurrRetailPrice,
    globalCurrSellPrice,
    type = 1,
    // startSurvey = false,
  } = properties
  const { locale } = useRouter()
  const sellingPrice = locale === "en" ? globalCurrSellPrice : price
  const retailPrice = locale === "en" ? globalCurrRetailPrice : realPrice

  return (
    <OrbitLink href={type === 1 ? `/assessment/${slug}` : `/survey-details/${slug}`}>
      <div className="flex flex-col h-full p-6 transition-all border rounded-[10px]  border-light-gray group hover:border-primary hover:blue-shadow">
        <div className="lg:flex grid items-center justify-between gap-3 ">
          <div className="flex items-center gap-3 ">
            <div className="">
              <img
                src={`${publicRuntimeConfig.NEXT_PUBLIC_S3_URL + img}`}
                className="h-14 w-14 min-w-[56px] object-cover rounded-full"
                alt="Drona"
              />
            </div>

            <h4 className="font-semibold cursor-pointer line-clamp-2 w-full" data-tip={title}>
              {" "}
              {title}
            </h4>
            <ReactTooltip />
          </div>
          {testAssessment && (
            <div className="flex  items-center min-w-[30%] ">
              <span className="border border-primary  px-2.5 py-1 text-xs  text-primary bg-primary bg-opacity-10 font-semibold rounded inline-block w-auto">
                {languageTranslater("common:practiceTest")}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-[#666666] mt-3   border-light-gray font-medium">
          {duration ? getTime(duration || "00:00") : ""} | {question && question === 0 ? "No" : question}{" "}
          {languageTranslater("questions")}
        </p>

        <p
          className="text-sm my-3 h-[60px] border-light-gray line-clamp-3  font-sm card-description !text-[#666666] !font-normal"
          dangerouslySetInnerHTML={{ __html: instr }}
        />
        {/* <p className="w-full h-[0.2px] bg-[#66666638]" /> */}
        {/* norder */}
        {/* <h4 className="mb-2 text-sm font-semibold text-black">Project : {project}</h4> */}
        {/* <p className="flex gap-1 text-xs text-dark-gray ">
        By
        <OrbitLink href="#" className="font-semibold transition text-primary hover:text-dark-blue">
          {company}
        </OrbitLink>
      </p> */}
        {/* <div className="w-full h-[1px] bg-slate-300 bg-opacity-30 "></div> */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 pt-3 border-t  border-light-gray">
            {type === 1 && (
              <>
                <p className="text-lg font-bold text-primary"> {convertCurrency(  sellingPrice, locale , languageTranslater, false)}</p>
                <p className="font-semibold line-through text-gray">
                  {realPrice === "0" ? "" : convertCurrency(retailPrice ,locale)}
                </p>
              </>
            )}
          </div>

          <Button isWidth loading={loading} onClick={onClick} className="mt-4" outline title={buttonTitle} />
        </div>
      </div>
    </OrbitLink>
  )
}

export default Card
