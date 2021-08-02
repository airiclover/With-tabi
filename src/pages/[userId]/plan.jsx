import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { PlanForm } from "src/components/plan/PlanForm";
import { Emoji } from "emoji-mart";
import { CommonLayout } from "src/components/layout/CommonLayout";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";
import { Dropdown } from "src/components/plan/Dropdown";
import { CalendarIcon } from "src/components/common/assets/CalendarIcon";
import { PlusIcon } from "src/components/common/assets/PlusIcon";

const UserPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

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
      .then((querySnapshot) => {
        const plansData = [];

        const fixDate = (str) => {
          return `${str.substr(0, 4)}/${str.substr(4, 2)}/${str.substr(6, 2)}`;
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const fixStartDate = fixDate(data.startDate);
          const fixLastDate = fixDate(data.lastDate);

          plansData.push({
            id: doc.id,
            title: data.title,
            planIcon: data.planIcon,
            startDate: fixStartDate,
            lastDate: fixLastDate,
          });
        });
        plansData.length == 0 ? setPlans(null) : setPlans(plansData);
      })
      .catch((error) => {
        console.log("プランデータ【エラー】だよ！", error);
      });
  };

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <CommonLayout>
      <PlanForm
        userInfo={userInfo}
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        getUsersPlans={getUsersPlans}
      />

      <div className="px-3 pb-28">
        <div className="py-4 flex items-center relative">
          <CalendarIcon className={"h-9 w-9"} />
          <h1 className="pl-2 text-4xl font-bold tracking-wider">
            Travel Plans
          </h1>
        </div>

        {plans != null ? (
          // 👇プランデータがある、かつデータフェッチ「済」の場合
          plans.length != 0 ? (
            plans.map((plan) => {
              return (
                <div key={plan.id} className="relative">
                  <Link href="/">
                    <a>
                      <div className="h-24 bg-white mt-5 py-3 px-4 rounded-xl">
                        <h2 className="text-lg font-bold leading-5">
                          <div className="flex">
                            {plan.planIcon ? (
                              <div className="pr-2">
                                <Emoji emoji={plan.planIcon} size={18} />
                              </div>
                            ) : null}
                            <div className="line-clamp-2">{plan.title}</div>
                          </div>
                        </h2>
                        <p className="pt-1 pl-6 text-sm">{`${plan.startDate} - ${plan.lastDate}`}</p>
                      </div>
                    </a>
                  </Link>
                  <Dropdown planID={plan.id} getUsersPlans={getUsersPlans} />
                </div>
              );
            })
          ) : (
            // 👇プランデータが[]からnullに変わるまでの間、もしくはデータフェッチされるまでの間は以下表示
            <div>ローディング中...</div>
          )
        ) : (
          // 👇プランデータがない場合
          <div>
            <div className="pt-10 pb-14 pl-4 font-semibold">
              <p>右下の登録ボタンから</p>
              <p>旅のプランを作成してみよう！</p>
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
        {/* ========================== */}

        <button onClick={openModal} className="fixed bottom-6 right-6">
          <div className="h-16 w-16 bg-yellow-500 text-center rounded-full flex flex-col relative hover:bg-hover-yellow">
            <PlusIcon />
            <p className="text-xs text-white font-semibold absolute top-10 left-5">
              登録
            </p>
          </div>
        </button>
      </div>
    </CommonLayout>
  );
};

export default UserPlanPage;
