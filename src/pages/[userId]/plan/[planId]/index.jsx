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
import Link from "next/link";

const PlanId = () => {
  const [plan, setPlan] = useState();
  const [startDate, setStartDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [arrPlans, setArrPlans] = useState([]);
  const [arrChangePlans, setArrChangePlans] = useState([]);
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

          // 🔸 forEachで回してgetしたデータを「planData」にpushし仮の配列作成
          // 👉 「getPlanData」と「docData.arrDates」の配列の数が同じになったら、setArrPlansでStateを更新
          // 👉 全て揃ったデータでコンポーネントが再レンダリングされる
          getPlanData.length == docData.arrDates.length &&
            setArrPlans(getPlanData);
        });
      })
      .catch((error) => {
        // toast.dismiss();
        console.log("planDetailページエラーだよ！:", error);
        // toast.error("エラーが発生しました。時間をおいてから試してください。");
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
              getPage={getPlan}
              query={router.query.planId}
            />
          ) : (
            <PlanTab
              plan={plan}
              arrPlans={arrPlans}
              getPage={getPlan}
              query={router.query.planId}
              setIsTabId={setIsTabId}
            />
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
        getPage={getPlan}
      />
    </CommonLayout>
  );
};

export default PlanId;
