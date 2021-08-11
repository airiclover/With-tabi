import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Emoji } from "emoji-mart";

export const PlanTab = (props) => {
  console.log("TabCompのarrPlansだよ", props.arrPlans);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group
        onChange={(index) => {
          console.log("Changed selected tab to:", index);
          props.setIsTabId(index);
        }}
      >
        <Tab.List className="flex p-1 space-x-1 rounded-xl">
          {props.plan.arrDates.map((arrDate, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-bold rounded-lg",
                  "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-yellow-500 ring-yellow-500 ring-opacity-60",
                  selected
                    ? "bg-yellow-500 text-white shadow"
                    : "hover:bg-gray-200"
                )
              }
            >
              {arrDate}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2">
          {props.arrPlans.map((arrPlan, index) => (
            <Tab.Panel
              key={index}
              // className={classNames(
              //   "bg-white rounded-xl p-3",
              //   "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-yellow-500 ring-yellow-500 ring-opacity-60"
              // )}
              className="p-2 pb-24"
            >
              {arrPlan.length != 0 ? (
                // 👇 詳細プランデータがある場合
                <ul>
                  {arrPlan.map((plan) => (
                    <li
                      key={plan.id}
                      className="bg-white text-sm mb-5 p-5 rounded-md"
                    >
                      <div className="font-semibold flex items-center">
                        <div className="flex flex-col items-center">
                          <p>{plan.startTime}</p>
                          {plan.lastTime && (
                            <>
                              <p className="text-xxs transform rotate-90">〜</p>
                              <p>{plan.lastTime}</p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center pl-3">
                          {plan.planIcon ? (
                            <div className="pt-3 pr-1.5">
                              <Emoji emoji={plan.planIcon} size={18} />
                            </div>
                          ) : null}
                          <h2 className="pt-1 font-semibold">{plan.title}</h2>
                        </div>
                      </div>

                      {plan.memo && (
                        <div className="mt-4 pt-4 text-xs border-dotted border-t-2 border-gray-400">
                          {plan.memo}
                        </div>
                      )}

                      {plan.money && (
                        <p className="mt-4 pt-4 text-xs pr-2 text-right border-dotted border-t-2 border-gray-400">{`金額：¥${plan.money}`}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                // 👇 詳細プランデータがない場合
                <div>
                  <div className="pt-5 pb-7 pl-4 font-semibold">
                    <p>右下の登録ボタンから</p>
                    <p>旅の詳細プランを作成してみよう！</p>
                  </div>
                  <Image
                    src="/img/undraw_travelplans.svg"
                    alt="travelplansImg"
                    width={100}
                    height={50}
                    loading="eager"
                    priority
                    layout="responsive"
                  />
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
