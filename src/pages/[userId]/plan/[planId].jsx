import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
import { Emoji } from "emoji-mart";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { FixDate } from "src/components/plan/FixDate";
import { PlanTab } from "src/components/plan/PlanTab";
import { PlusIcon } from "src/components/common/assets/PlusIcon";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { PlanDetailForm } from "src/components/plan/PlanDetailForm";

const PlanId = () => {
  const [plan, setPlan] = useState();
  const [startDate, setStartDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const { fixedDate } = FixDate();
  const { userInfo } = useCurrentUser();

  useRequireLogin();

  useEffect(() => {
    getPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFormModal = () => {
    setIsOpenModal(true);
  };

  const closeFormModal = () => {
    setIsOpenModal(false);
  };

  const getPlan = async () => {
    const planDoc = db.collection("plans").doc(router.query.planId);

    await planDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        const fixStartDate = fixedDate(docData.startDate);
        const fixLastDate = fixedDate(docData.lastDate);

        if (doc.exists) {
          setPlan(docData);
          setStartDate(fixStartDate);
          setLastDate(fixLastDate);
        } else {
          console.log("データないよ！！！");
        }
      })
      .catch((error) => {
        // toast.dismiss();
        console.log("planDetailページエラーだよ！:", error);
        // toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  return (
    <CommonLayout>
      {plan ? (
        <div>
          <div className="pt-6 pb-3 px-4 font-extrabold">
            <h1 className="text-2xl leading-snug">
              <Emoji emoji={plan?.planIcon} size={25} />
              &nbsp;
              {plan?.title}
            </h1>
            <p className="py-2 text-right">{`${startDate} - ${lastDate}`}</p>
          </div>

          <PlanTab plan={plan} />
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
        isOpenModal={isOpenModal}
        closeFormModal={closeFormModal}
        // getUsersPlans={getUsersPlans}
      />
    </CommonLayout>
  );
};

export default PlanId;
