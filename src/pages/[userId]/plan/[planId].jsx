import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
import { Emoji } from "emoji-mart";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { fixDate } from "src/components/plan/fixDate";

const PlanId = () => {
  const [plan, setPlan] = useState();
  const [startDate, setStartDate] = useState();
  const [lastDate, setLastDate] = useState();
  const router = useRouter();
  const { fixedDate } = fixDate();
  console.log(router.query.planId);

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
        <div className="py-6 px-4  font-extrabold">
          <h1 className="text-2xl">
            <Emoji emoji={plan?.planIcon} size={25} />
            &nbsp;
            {plan?.title}
          </h1>
          <p className="py-2 text-right">{`${startDate} - ${lastDate}`}</p>
        </div>
      ) : (
        <div>ローディング中</div>
      )}
    </CommonLayout>
  );
};

export default PlanId;
