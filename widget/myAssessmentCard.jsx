/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable unicorn/consistent-function-scoping */
import CalendarIcon from "icons/calendarIcon"
import ClockIcon from "icons/clockIcon"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
// import ReactTooltip from "react-tooltip"
import routes from "utils/routes"
import { ASSESSMENT_TYPE } from "utils/constant"

const MyAssessmentCard = ({
  testAssessment,
  title,
  assessmentType,
  subTitle,
  fromTime,
  toTime,
  btn,
  status,
  languageTranslater,
  duration,
  isB2CRealtime,
  slug,
  bussinessModel,
  type,
  assessmenData = {},
  rightBtn,
  isReviewSts,
  showClock,
}) => {
  const { push } = useRouter()
  const { t } = useTranslation("common")
  const attemptLeft =
    Number.parseInt(assessmenData.noOfAttempt, 10) -
    Number.parseInt(assessmenData.projectAssessment?.userAssessment?.practiceAttempt || 0, 10)

  return (
    <div className="p-4 bg-white rounded-md primary-shadow">
      {assessmentType && (
        <div className="mb-2 flex items-center gap-1.5 relative">
          <span
            className={`text-[11px] font-semibold bg-opacity-20 px-2 py-1 rounded ${
              assessmentType === 2 ? "text-primary bg-primary" : "text-dark-gray bg-dark-gray "
            }`}
          >
            {assessmentType === 2 ? "Realtime" : "Batch"}
          </span>
          {testAssessment && (
            <span
              className={`text-[11px] font-semibold bg-opacity-20 px-2 py-1 rounded 
             text-primary bg-primary
            `}
            >
              {languageTranslater("common:practiceTest")}
            </span>
          )}
          {bussinessModel === 2 && (
            <span
              className={`text-[11px] font-semibold bg-opacity-20 px-2 py-1 rounded 
             text-primary bg-primary
            `}
            >
              {languageTranslater("invited")}
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between gap-2">
        <div className="min-h-[75px]">
          <p
            className={`font-bold capitalize line-clamp-2  ${bussinessModel === 1 && "cursor-pointer"}`}
            onClick={() =>
              type === 1
                ? bussinessModel === 1 && push(`/${routes.assessment}/${slug}`)
                : bussinessModel === 1 && push(`/${routes.surveyDetails}/${slug}`)
            }
            data-tip={title}
          >
            {title}
          </p>
          {/* <ReactTooltip /> */}
          {isB2CRealtime ? (
            <p className="text-sm capitalize text-gray">Drona</p>
          ) : (
            <div className="flex gap-2 items-center  content-center ">
              {" "}
              <p className="text-sm capitalize text-gray  ">{subTitle}</p>
              {type === 2 && bussinessModel === 2 && (
                <span
                  className={`text-[11px] font-semibold bg-opacity-20 px-2 py-1 rounded 
             text-primary bg-primary
            `}
                >
                  {languageTranslater("invited")}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="min-w-[24%]">
          <div className="flex flex-col gap-2 justify-center">
            <div
              className={`border ${
                status === "completed"
                  ? "border-green-500 bg-green-50"
                  : status === "onGoing"
                  ? "border-primary bg-[#3AA4DA14]"
                  : "border-[#F59E0B] bg-[#EB2F2F12] "
              } px-2 py-1 inline-block rounded-md `}
            >
              <p
                className={`text-xs text-center font-medium ${
                  status === "completed" ? "text-green-500" : status === "onGoing" ? "text-primary" : "text-[#F59E0B]"
                }`}
              >
                {isReviewSts ? languageTranslater("inReview") : status ? languageTranslater(status) : ""}
              </p>
            </div>
            {testAssessment && attemptLeft > 0 && (
              <div className=" text-xs text-gray text-start">
                <p>
                  {" "}
                  {attemptLeft > 1
                    ? `${attemptLeft} ${languageTranslater("atmpt")}s ${languageTranslater("left")}`
                    : `${attemptLeft} ${languageTranslater("atmpt")} ${languageTranslater("left")}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between my-5 text-xs text-gray">
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <p>{fromTime ? (isB2CRealtime ? fromTime : `${fromTime} To ${toTime}`) : toTime}</p>
        </div>

        {duration && showClock ? (
          <div className="flex items-center gap-2">
            <ClockIcon />
            <p>{duration}</p>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex items-center justify-between">
        {btn} {rightBtn}
      </div>
    </div>
  )
}

export default MyAssessmentCard
