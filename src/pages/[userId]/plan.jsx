// import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { db } from "src/utils/firebase/firebase";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { CommonLayout } from "src/components/Layout/CommonLayout";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";
import { CalendarIcon } from "src/components/common/assets/CalendarIcon";
import { PlusIcon } from "src/components/common/assets/PlusIcon";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";

const UserPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(null); //アイコン
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  const router = useRouter();

  // データ取得チェック=========================
  const { userInfo } = useCurrentUser();
  useRequireLogin();
  console.log("プランページ", userInfo);

  // プラン取得チェック=========================
  const getUsersPlans = () => {
    db.collection("plans")
      .where("userID", "==", userInfo.uid)
      .get()
      .then((querySnapshot) => {
        const plansdata = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          plansdata.push({
            id: doc.id,
            title: data.title,
            planIcon: data.planIcon,
            startDate: data.startDate,
            lastDate: data.lastDate,
          });
        });
        setPlans(plansdata);
        console.log("plansdata", plansdata);
      })
      .catch((error) => {
        console.log("プランデータ【エラー】だよ！", error);
      });
  };

  useEffect(() => {
    getUsersPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========================================

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const addPlan = () => {
    db.collection("plans")
      .add({
        userID: userInfo?.uid,
        title: title,
        planIcon: emoji,
        startDate: startDate,
        lastDate: lastDate,
      })
      .then(async (docRef) => {
        setPlans([
          ...plans,
          {
            id: docRef.id, //追加されたドキュメントID
            title: title,
            planIcon: emoji,
            startDate: startDate,
            lastDate: lastDate,
          },
        ]);
        closeModal();
        await router.push(`/${userInfo.uid}/plan`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const openEmoji = () => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  };

  const onChangeTitle = (e) => setTitle(e.target.value);

  const onChangeStartDate = (e) => setStartDate(e.target.value);

  const onChangeLastDate = (e) => setLastDate(e.target.value);

  return (
    <CommonLayout>
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto text-gray-800"
          onClose={closeModal}
        >
          <div>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="min-h-screen pt-6 px-4 inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white">
                <div className="text-right">
                  <button
                    type="button"
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={closeModal}
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* ===================================== */}
                <div>
                  <div className="pt-6 pb-7">
                    <p className="pb-1 font-semibold">アイコンを選択</p>
                    <div className="flex">
                      <button
                        onClick={openEmoji}
                        className="p-2.5 bg-gray-100 rounded-lg mr-3"
                      >
                        <EmojiIcon className="w-6 h-6" />
                      </button>
                      <p className="pt-2">
                        {emoji ? <Emoji emoji={emoji} size={30} /> : null}
                      </p>
                    </div>

                    {/* emoji-mart */}
                    {isOpenEmoji ? (
                      <EmojiMart
                        setEmoji={setEmoji}
                        setIsOpenEmoji={setIsOpenEmoji}
                      />
                    ) : null}
                  </div>

                  <div className="pb-7">
                    <p className="pb-1 font-semibold">タイトル</p>
                    <input
                      type="text"
                      placeholder="旅行タイトル"
                      value={title}
                      onChange={onChangeTitle}
                      className="w-full p-2 bg-gray-100 rounded-lg"
                    />
                  </div>
                  <div className="pb-7">
                    <p className="pb-1 font-semibold">出発日</p>
                    <input
                      type="text"
                      placeholder="2021/12/1"
                      value={startDate}
                      onChange={onChangeStartDate}
                      className="p-2 bg-gray-100 rounded-lg"
                    />
                  </div>
                  <div className="pb-12">
                    <p className="pb-1 font-semibold">帰着日</p>
                    <input
                      type="text"
                      placeholder="2021/12/10"
                      value={lastDate}
                      onChange={onChangeLastDate}
                      className="p-2 bg-gray-100 rounded-lg"
                    />
                  </div>
                </div>
                {/* ===================================== */}

                <div className="text-right">
                  <button
                    type="button"
                    className="px-8 py-3 bg-yellow-500 text-white tracking-widest rounded-full hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={addPlan}
                  >
                    登録
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="px-3">
        <div className="py-4 flex items-center relative">
          <CalendarIcon className={"h-9 w-9"} />
          <h1 className="pl-2 text-4xl font-bold tracking-wider">
            Travel Plans
          </h1>
        </div>

        {/* ========================== */}

        {console.log("プランの数！", plans.length)}
        {plans.map((plan) => {
          return (
            <div
              key={plan.id}
              className="h-24 bg-white mt-5 py-3 px-4 rounded-xl"
            >
              <h2 className="text-lg font-bold leading-5 line-clamp-2">
                {plan.planIcon ? (
                  <span className="pr-1.5">
                    <Emoji emoji={plan.planIcon} size={18} />
                  </span>
                ) : null}
                <span>{plan.title}</span>
              </h2>
              <p className="pt-1 pl-6 text-sm">{`${plan.startDate} - ${plan.lastDate}`}</p>
            </div>
          );
        })}

        {/* 👇プランデータがないとき */}
        {/* <div>
            <div className="pt-10 pb-14 pl-4 font-semibold">
              <p>右下の登録ボタンから</p>
              <p>旅のプランを作成してみよう。</p>
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
          </div> */}

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
