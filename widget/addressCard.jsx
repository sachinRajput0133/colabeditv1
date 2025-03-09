/* eslint-disable simple-import-sort/imports */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import useAddress from "components/ProfileSetting/useAddress"
import CheckIcon from "icons/checkIcon"
import DeleteIcon from "icons/deleteIcon"
import EditIcon from "icons/editIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import OrbitLoader from "./loader"
import OrbitLink from "./orbitLink"

const AddressCard = ({
  title,
  isDefault = false,
  setIsEdit,
  data,
  removeAddress,
  getAddressDetail,
  setOpen,
  setAsDefault,
  defaultLoader,
}) => {
  const handleSubmit = (id) => {
    setOpen(true)
    setIsEdit(true)
    getAddressDetail(id)
  }

  const { t } = useTranslation("common")

  return (
    <div className="relative shadow grid grid-cols-12 gap-y-4 gap-x-6 bg-white p-4 rounded-md border border-white hover:border-light-gray">
      <div className=" col-span-12 md:col-span-8 xl:col-span-9 flex flex-col gap-1">
        <h5 className="font-bold text-black text-base mdtext-lg">{title}</h5>
        <p className="text-sm md:text-base text-gray">
          {data?.addrLine1}, {data?.addrLine2}
        </p>
        <p className="text-sm md:text-base text-gray">
          {data?.cityNm}, {data?.stateNm}, {data?.countryNm} - {data?.zipcode}
        </p>
      </div>
      <div className=" col-span-12 md:col-span-4 xl:col-span-3 flex items-center justify-between md:justify-end gap-3">
        <div className="md:order-2 flex items-center gap-4">
          <button type="button" onClick={() => handleSubmit(data?._id)} className="text-gray ">
            <EditIcon size="22" />
          </button>
          {isDefault ? (
            <div className="md:order-1 text-xs text-primary bg-primary/20 font-semibold px-2 py-1 rounded-md border border-primary inline-flex items-center gap-1">
              <CheckIcon size="16" /> {t("default")}
            </div>
          ) : (
            <>
              <button type="button" onClick={() => removeAddress(data?._id)}>
                <DeleteIcon />
              </button>
              <button
                type="button"
                onClick={() => setAsDefault(data?._id)}
                className="text-primary hover:text-dark-primary"
              >
                {defaultLoader.isLoading && defaultLoader.id === data?._id ? (
                  <svg
                    className="inline-block animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                  >
                    <path
                      fill="currentColor"
                      d="M5.5,12a1,1,0,1,1,1,1A1,1,0,0,1,5.5,12ZM1.75,10.5A1.25,1.25,0,1,1,3,11.75,1.25,1.25,0,0,1,1.75,10.5Zm7.531.031a.75.75,0,1,1,.75.75A.75.75,0,0,1,9.281,10.531ZM0,7A1.5,1.5,0,1,1,1.5,8.5,1.5,1.5,0,0,1,0,7ZM11,7a.5.5,0,1,1,.5.5A.5.5,0,0,1,11,7ZM1.875,4.637a1.62,1.62,0,0,1,0-2.275,1.582,1.582,0,0,1,2.253,0,1.62,1.62,0,0,1,0,2.275,1.582,1.582,0,0,1-2.253,0ZM4.5,2a2,2,0,1,1,2,2A2,2,0,0,1,4.5,2ZM9.75,3.5a.25.25,0,1,1,.25.25A.25.25,0,0,1,9.75,3.5Z"
                    />
                  </svg>
                ) : (
                  t("setAsDefault")
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressCard
