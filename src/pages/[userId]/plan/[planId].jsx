import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
import { Emoji } from "emoji-mart";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { PlanDetailForm } from "src/components/plan/PlanDetailForm";
import { fixDate } from "src/components/plan/fixDate";
import { PlanTab } from "src/components/plan/PlanTab";
import { DetailWrap } from "src/components/plan/DetailWrap";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { PlusIcon } from "src/components/common/assets/PlusIcon";

const PlanId = () => {
  const [plan, setPlan] = useState();
  const [startDate, setStartDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [arrPlans, setArrPlans] = useState([]);
  const [isTabId, setIsTabId] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const { fixedDate } = fixDate();
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

        docData.arrDates.map((arrDate) => {
          return planDoc
            .collection("plan")
            .where("day", "==", arrDate)
            .orderBy("startTime") //startDateを降順でソートかける
            .get()
            .then((querySnapshot) => {
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
                  money: data.money,
                });
              });

              getPlanData.push(planData);

              // 🔸 forEachで回してgetしたデータを「planData」にpushし仮の配列作成
              // 👉 「getPlanData」と「docData.arrDates」の配列の数が同じになったら、setArrPlansでStateを更新
              // 👉 全て揃ったデータでコンポーネントが再レンダリングされる
              getPlanData.length == docData.arrDates.length &&
                setArrPlans(getPlanData);
            });
        });
      })
      .catch((error) => {
        // toast.dismiss();
        console.log("planDetailページエラーだよ！:", error);
        // toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const openFormModal = () => {
    setIsOpenModal(true);
  };

  const closeFormModal = () => {
    setIsOpenModal(false);
  };

  return (
    <CommonLayout>
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
              <h1 className="text-2xl leading-snug">{plan?.title}</h1>
            </div>

            <p className="py-2 text-right">{`${startDate} - ${lastDate}`}</p>
          </div>

          {plan.arrDates.length <= 1 ? (
            <DetailWrap arrPlans={arrPlans} />
          ) : (
            <PlanTab plan={plan} arrPlans={arrPlans} setIsTabId={setIsTabId} />
          )}
        </div>
      ) : (
        <div>ローディング中</div>
      )}

      <button onClick={openFormModal} className="fixed bottom-6 right-6">
        <div className="h-16 w-16 bg-yellow-500 text-center rounded-full flex flex-col relative hover:bg-hover-yellow">
          <PlusIcon />
          <p className="text-xs text-white font-semibold absolute top-10 left-5">
            登録
          </p>
        </div>
      </button>

      <PlanDetailForm
        userInfo={userInfo}
        plan={plan}
        isOpenModal={isOpenModal}
        closeFormModal={closeFormModal}
        query={router.query.planId}
        isTabId={isTabId}
        getPlan={getPlan}
      />
    </CommonLayout>
  );
};

export default PlanId;
