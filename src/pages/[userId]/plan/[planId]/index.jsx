import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
import { Emoji } from "emoji-mart";
import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { PlanDetailForm } from "src/components/plan/PlanDetailForm";
import { useAddPlan } from "src/hooks/plan/useAddPlan";
import { useFixDate } from "src/hooks/plan/useFixDate";
import { PlanTab } from "src/components/plan/PlanTab";
import { DetailWrap } from "src/components/plan/DetailWrap";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { ButtonAddPlan } from "src/components/plan/ButtonAddPlan";

const PlanId = () => {
  const [plan, setPlan] = useState();
  const [startDate, setStartDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [arrPlans, setArrPlans] = useState([]);
  const [arrTotalMoney, setArrTotalMoney] = useState([]);
  const [arrChangePlans, setArrChangePlans] = useState([]);
  const [isTabId, setIsTabId] = useState(0);
  const { isOpenModal, openFormModal, closeFormModal } = useAddPlan();
  const router = useRouter();
  const { fixedDate } = useFixDate();
  const { userInfo } = useCurrentUser();

  useRequireLogin();

  useEffect(() => {
    getPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlan = async () => {
    const planDoc = db.collection("plans").doc(router.query.planId);

    await planDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        const fixStartDate = fixedDate(docData.startDate);
        const fixLastDate = fixedDate(docData.lastDate);

        setPlan(docData);
        setStartDate(fixStartDate);
        setLastDate(fixLastDate);

        const getPlanData = [];
        const arrTotalMoney = [];

        docData.arrDates.map(async (arrDate) => {
          const querySnapshot = await planDoc
            .collection("plan")
            .where("day", "==", arrDate)
            .orderBy("startTime") //startDateを降順でソートかける
            .get();

          const planData = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data);

            planData.push({
              id: doc.id,
              planIcon: data.planIcon,
              title: data.title,
              startTime: data.startTime,
              lastTime: data.lastTime,
              memo: data.memo,
              money: data.money.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),
            });
          });

          getPlanData.push(planData);

          // ===========================
          // 合計金額の配列を作成
          const totalMoney = planData.reduce((sum, element) => {
            return sum + Number(element.money.replace(/,/g, ""));
          }, 0);
          // arrTotalMoney.push(totalMoney);
          const money = String(totalMoney).replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g,
            "$1,"
          );
          arrTotalMoney.push(money);
          // ===========================

          // 🔸 forEachで回してgetしたデータを「planData」にpushし仮の配列作成
          // 👉 「getPlanData」と「docData.arrDates」の配列の数が同じになったら、setArrPlansでStateを更新
          // 👉 全て揃ったデータでコンポーネントが再レンダリングされる
          getPlanData.length == docData.arrDates.length &&
            setArrPlans(getPlanData);
          getPlanData.length == docData.arrDates.length &&
            setArrTotalMoney(arrTotalMoney);
        });
      })
      .catch((error) => {
        console.log("planDetailページエラーだよ！:", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });

    // ==============================
    // planページで日程変更をしたものがあるかチェックし、ある場合以下処理
    const dateChangeArr = [];

    const dateChange = await planDoc
      .collection("plan")
      .where("dateChange", "==", true)
      .get();

    dateChange.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data();
        dateChangeArr.push(data);
        console.log("日付変更あるよ", data);
      } else {
        console.log("日付変更ないよ");
      }
    });

    dateChangeArr.length != 0 && setArrChangePlans(dateChangeArr);
    // ==============================
  };

  return (
    <CommonLayout>
      <div className="max-w-screen-sm mx-auto">
        {/* 念の為、「arrPlans.length == plan.arrDates.length」のチェックも挟む */}
        {plan && arrPlans.length == plan.arrDates.length ? (
          <div>
            <div className="pt-6 pb-4 px-4 font-extrabold">
              <div className="flex items-center">
                {plan?.planIcon && (
                  <div className="pt-1 pr-1.5">
                    <Emoji emoji={plan?.planIcon} size={25} />
                  </div>
                )}
                <div className="text-2xl leading-snug">{plan?.title}</div>
              </div>

              <p className="py-2 text-right">{`${startDate} - ${lastDate}`}</p>
            </div>

            {arrChangePlans.length != 0 && (
              <Link
                href="/[userId]/plan/[planId]/changeplan"
                as={`/${userInfo.uid}/plan/${router.query.planId}/changeplan`}
              >
                <a className="bg-red-300 mb-5 mx-3 py-3 text-xs font-semibold text-center block border-4 border-red-400 rounded-lg">
                  {`日付の変更が必要なデータが${arrChangePlans.length}件あります →`}
                </a>
              </Link>
            )}

            {plan.arrDates.length <= 1 ? (
              <DetailWrap
                arrPlans={arrPlans}
                arrTotalMoney={arrTotalMoney}
                getPage={getPlan}
                query={router.query.planId}
              />
            ) : (
              <PlanTab
                plan={plan}
                arrTotalMoney={arrTotalMoney}
                arrPlans={arrPlans}
                getPage={getPlan}
                query={router.query.planId}
                setIsTabId={setIsTabId}
              />
            )}
          </div>
        ) : (
          // スケルトンローディングを表示
          <>
            <div className="pt-6 pb-4 px-4">
              <div className="animate-pulse flex flex-col space-y-2 space-x-2">
                <div className="flex items-center">
                  <div className="h-7 w-7 mr-2 bg-gray-200 rounded-full"></div>
                  <div className="w-5/6 h-7 bg-gray-200 rounded"></div>
                </div>
                <div className="w-3/4 h-7 bg-gray-200 rounded self-end"></div>
              </div>
            </div>

            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className="h-24 mb-5 mx-4 py-3 px-2 rounded-xl bg-white bg-opacity-50"
              >
                <div className="animate-pulse flex space-x-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-4">
                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <ButtonAddPlan openFormModal={openFormModal} />

        <PlanDetailForm
          userInfo={userInfo}
          plan={plan}
          isOpenModal={isOpenModal}
          closeFormModal={closeFormModal}
          query={router.query.planId}
          isTabId={isTabId}
          getPage={getPlan}
        />
      </div>
    </CommonLayout>
  );
};

export default PlanId;
