import { Emoji } from "emoji-mart";
import { Dropdown } from "src/components/plan/Dropdown";
import { NoPlan } from "src/components/plan/NoPlan";

export const DetailWrap = (props) => {
  return (
    <div className="px-2">
      {props.arrPlans.map((arrPlan, index) => (
        <div key={index} className="p-2 pb-24">
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
              {props.arrTotalMoney != 0 && (
                <p className="pt-4 pr-2 text-sm font-bold text-right">{`合計金額：¥${props.arrTotalMoney[0]}`}</p>
              )}
            </ul>
          ) : (
            // 👇 詳細プランデータがない場合
            <NoPlan class="pt-5 pb-7" />
          )}
        </div>
      ))}
    </div>
  );
};
