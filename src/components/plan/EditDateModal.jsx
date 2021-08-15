import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Fragment } from "react";
import { CheckCircleIcon } from "src/components/common/assets/CheckCircleIcon";

export const EditDateModal = (props) => {
  return (
    <Transition appear show={props.isOpenEditModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.closeEditModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {props.title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{props.subTitle}</p>
              </div>

              {/* ========= 以下は「Radio Group」 ========= */}

              <div className="w-full px-4 py-10">
                <RadioGroup
                  value={props?.selected}
                  onChange={props.setSelected}
                >
                  <div className="space-y-2.5">
                    {props.arrDates.map((arrDate, index) => (
                      <RadioGroup.Option
                        key={index}
                        value={arrDate}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? "ring-2 ring-offset-2 ring-offset-yellow-500 ring-white ring-opacity-60"
                              : ""
                          }
                  ${
                    checked
                      ? "bg-yellow-500"
                      : "border-2 border-yellow-400 rounded-lg"
                  }
                    relative rounded-lg shadow-md px-5 py-2.5 flex focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <div className="flex items-center justify-between w-full">
                            <div className="text-sm tracking-widest">
                              <RadioGroup.Label
                                as="p"
                                className={
                                  checked
                                    ? "text-white font-bold"
                                    : "text-gray-800"
                                }
                              >
                                {arrDate}
                              </RadioGroup.Label>
                            </div>
                            {checked && (
                              <div className="text-white">
                                <CheckCircleIcon class="opacity-70" />
                              </div>
                            )}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {/* ======================================= */}

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="mr-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
                  onClick={props.closeEditModal}
                >
                  {props.button1}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                  onClick={props.isDateEdit}
                >
                  {props.button2}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
