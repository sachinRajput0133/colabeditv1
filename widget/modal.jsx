/* eslint-disable write-good-comments/write-good-comments */
import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

const Modal = ({ open = false, setOpen, children, title, maxWidthSm = "sm:max-w-2xl" }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-30" onClose={setOpen}>
        <div className="relative flex items-center justify-center h-screen px-4 text-center overflow-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-black bg-opacity-80" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block text-left align-bottom transition-all transform bg-white rounded-md shadow-xl my-6 sm:my-8 sm:align-middle ${maxWidthSm} w-full p-4 md:p-6`}
            >
              <div className="relative modal-header mb-6">
                <p className="text-xl lg:text-2xl font-bold">{title}</p>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
