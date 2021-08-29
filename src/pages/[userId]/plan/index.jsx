import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { PlanForm } from "src/components/plan/PlanForm";
import { Emoji } from "emoji-mart";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
import { useAddPlan } from "src/hooks/plan/useAddPlan";
import { useFixDate } from "src/hooks/plan/useFixDate";
import { Dropdown } from "src/components/plan/Dropdown";
import { NoPlan } from "src/components/plan/NoPlan";
import { CalendarIcon } from "src/components/common/assets/CalendarIcon";
import { ButtonAddPlan } from "src/components/plan/ButtonAddPlan";

const UserPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const { isOpenModal, openFormModal, closeFormModal } = useAddPlan();
  const { fixedDate } = useFixDate();

  const { userInfo } = useCurrentUser();

  useRequireLogin();

  useEffect(() => {
    getUsersPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsersPlans = () => {
    console.log("プラン取得チェック");
    db.collection("plans")
      .where("userID", "==", userInfo.uid)
      .orderBy("startDate", "desc") //startDateを降順でソートかける
      .get()
      .then(async (querySnapshot) => {
        const plansData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const fixStartDate = fixedDate(data.startDate);
          const fixLastDate = fixedDate(data.lastDate);

          plansData.push({
            id: doc.id,
            title: data.title,
            planIcon: data.planIcon,
            startDate: fixStartDate,
            lastDate: fixLastDate,
            beforeStartDate: data.startDate,
            beforeLastDate: data.lastDate,
            arrDates: data.arrDates,
            unnecessaryDate: data.unnecessaryDate,
          });
        });
        plansData.length == 0 ? setPlans(null) : setPlans(plansData);
      })
      .catch((error) => {
        console.log("プランデータ【エラー】だよ！", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  return (
    <CommonLayout>
      <div className="px-3 pb-28">
        <div className="py-4 flex items-center relative">
          <CalendarIcon className={"h-9 w-9"} />
          <div className="pl-2 text-4xl font-bold tracking-wide">
            Travel Plans
          </div>
        </div>

        {plans != null ? (
          // 👇プランデータがある、かつデータフェッチ「済」の場合
          plans.length != 0 ? (
            plans.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className="h-24 bg-white mt-5 py-3 px-4 rounded-xl relative"
                >
                  <Link
                    href="/[userId]/plan/[planId]"
                    as={`/${userInfo.uid}/plan/${plan.id}`}
                  >
                    <a>
                      <div className="text-lg font-bold leading-tight">
                        <div className="flex items-center">
                          {plan.planIcon ? (
                            <div className="pt-1 pr-1.5">
                              <Emoji emoji={plan.planIcon} size={18} />
                            </div>
                          ) : null}
                          <div className="line-clamp-2">{plan.title}</div>
                        </div>
                      </div>
                      <p className="pt-1 pl-6 text-sm">{`${plan.startDate} - ${plan.lastDate}`}</p>
                    </a>
                  </Link>
                  <Dropdown
                    page="planPage"
                    plan={plan}
                    getUsersPlans={getUsersPlans}
                  />
                </div>
              );
            })
          ) : (
            // プランデータがnullに変わるまでの間、もしくはデータフェッチされるまでの間は
            // スケルトンローディングを表示
            <>
              {[1, 2, 3, 4].map((number) => (
                <div
                  key={number}
                  className="h-24 mt-5 py-3 px-2 rounded-xl bg-white bg-opacity-50"
                >
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-4">
                      <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )
        ) : (
          // 👇プランデータがない場合
          <NoPlan class="pt-10 pb-14" />
        )}

        <ButtonAddPlan openFormModal={openFormModal} />
      </div>

      <PlanForm
        userInfo={userInfo}
        isOpenModal={isOpenModal}
        closeFormModal={closeFormModal}
        getUsersPlans={getUsersPlans}
      />
    </CommonLayout>
  );
};

export default UserPlanPage;
