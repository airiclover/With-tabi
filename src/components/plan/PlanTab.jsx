import { Tab } from "@headlessui/react";
import { Emoji } from "emoji-mart";
import { Dropdown } from "src/components/plan/Dropdown";
import { NoPlan } from "src/components/plan/NoPlan";

export const PlanTab = (props) => {
  console.log("タブコンポーネントだよ！！！");

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className="max-w-lg mx-auto px-2 sm:px-0">
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
            <Tab.Panel key={index} className="p-2 pb-32">
              {arrPlan.length != 0 ? (
                // 👇 詳細プランデータがある場合
                <ul>
                  {arrPlan.map((plan) => (
                    <li
                      key={plan.id}
                      className="bg-white text-sm mb-5 pt-5 px-5 pb-9 rounded-md relative"
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
                          <div className="pt-1 font-semibold">{plan.title}</div>
                        </div>
                      </div>

                      {plan.memo && (
                        <div className="mt-4 pt-4 text-xs border-dotted border-t-2 border-gray-400 whitespace-pre-wrap">
                          {plan.memo}
                        </div>
                      )}

                      {plan.money && (
                        <p className="mt-4 pt-4 text-xs pr-2 text-right border-dotted border-t-2 border-gray-400">{`金額：¥${plan.money}`}</p>
                      )}

                      <Dropdown
                        page="detailPage"
                        plan={plan}
                        getPage={props.getPage}
                        query={props.query}
                      />
                    </li>
                  ))}

                  {props.arrTotalMoney[index] != 0 && (
                    <p className="pt-4 pr-2 text-sm font-bold text-right">{`合計金額：¥${props.arrTotalMoney[index]}`}</p>
                  )}
                </ul>
              ) : (
                // 👇 詳細プランデータがない場合
                <NoPlan class="pt-5 pb-7" />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
