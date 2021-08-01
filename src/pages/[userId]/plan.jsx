import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { db } from "src/utils/firebase/firebase";
import { EmojiMart } from "src/utils/emojimart";
import { useForm } from "react-hook-form";
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
  const [today, setToday] = useState("");
  const [emoji, setEmoji] = useState(null); //アイコン
  // eslint-disable-next-line no-unused-vars
  const [title, setTitle] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [startDate, setStartDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [lastDate, setLastDate] = useState("");

  const router = useRouter();
  const { userInfo } = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useRequireLogin();

  // ---------------------------------------
  useEffect(() => {
    getUsersPlans();
    getToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------

  // ------------プラン取得チェック--------------

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
        plansdata.length == 0 ? setPlans(null) : setPlans(plansdata);
      })
      .catch((error) => {
        console.log("プランデータ【エラー】だよ！", error);
      });
  };
  // ---------------------------------------

  // ------------今日の日付取得---------------
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("00" + (today.getMonth() + 1)).slice(-2);
    const date = ("00" + today.getDate()).slice(-2);
    const formatDate = year + month + date;
    setToday(formatDate);
  };
  // ---------------------------------------

  // ------------モーダル操作-----------------
  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };
  // ---------------------------------------

  // ------------絵文字マート-----------------
  // 👇フォーム開け閉めのstateが更新される事によって再レンダリングが起きるため解決策探す。
  const openEmoji = useCallback(() => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  }, []);
  // ---------------------------------------

  // ---------------フォーム-----------------
  const on_submit = (data) => {
    console.log("on_submit関数内！！！");

    db.collection("plans")
      .add({
        userID: userInfo?.uid,
        title: data.title,
        planIcon: emoji,
        startDate: data.startDate,
        lastDate: data.lastDate,
      })
      .then(async (docRef) => {
        plans == null
          ? setPlans([
              {
                id: docRef.id, //追加されたドキュメントID
                title: data.title,
                planIcon: emoji,
                startDate: data.startDate,
                lastDate: data.lastDate,
              },
            ])
          : setPlans([
              ...plans,
              {
                id: docRef.id, //追加されたドキュメントID
                title: data.title,
                planIcon: emoji,
                startDate: data.startDate,
                lastDate: data.lastDate,
              },
            ]);

        closeModal();
        await router.push(`/${userInfo.uid}/plan`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  // ---------------------------------------

  return (
    <CommonLayout>
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto text-gray-800"
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(on_submit)}>
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

                    <label className="pb-7 font-semibold flex flex-col">
                      旅行タイトル
                      <input
                        placeholder="旅行タイトル"
                        {...register("title", {
                          required: true,
                          minLength: 1,
                          maxLength: 50,
                        })}
                        className="w-full mt-1 p-2 bg-gray-100 rounded-lg"
                      />
                      {errors.title && (
                        <span className="pt-1 text-red-500 text-xs">
                          入力は必須です(50文字以内)
                        </span>
                      )}
                    </label>

                    <label className="pb-7 font-semibold flex flex-col">
                      出発日
                      <input
                        type="number"
                        placeholder={today}
                        {...register("startDate", {
                          required: true,
                          pattern: /[0-9]{8}/,
                          maxLength: 8,
                        })}
                        className="w-full mt-1 p-2 bg-gray-100 rounded-lg"
                      />
                      {errors.startDate && (
                        <span className="pt-1 text-red-500 text-xs">
                          入力は必須です(数値8文字)
                        </span>
                      )}
                    </label>

                    <label className="pb-12 font-semibold flex flex-col">
                      帰着日
                      <input
                        type="number"
                        placeholder={today}
                        {...register("lastDate", {
                          required: true,
                          pattern: /[0-9]{8}/,
                          maxLength: 8,
                        })}
                        className="w-full mt-1 p-2 bg-gray-100 rounded-lg"
                      />
                      {errors.lastDate && (
                        <span className="pt-1 text-red-500 text-xs">
                          入力は必須です(数値8文字)
                        </span>
                      )}
                    </label>
                  </div>

                  {/* ===================================== */}

                  <div className="text-right">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-yellow-500 text-white tracking-widest rounded-full hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                      登録
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </form>
        </Dialog>
      </Transition>

      <div className="px-3 pb-28">
        <div className="py-4 flex items-center relative">
          <CalendarIcon className={"h-9 w-9"} />
          <h1 className="pl-2 text-4xl font-bold tracking-wider">
            Travel Plans
          </h1>
        </div>

        {/* ========================== */}
        {console.log("コンポーネント内:plans", plans)}

        {plans != null ? (
          // 👇プランデータがある、かつデータフェッチ「済」の場合
          plans.length != 0 ? (
            plans.map((plan) => {
              return (
                <Link key={plan.id} href="/">
                  <a>
                    <div className="h-24 bg-white mt-5 py-3 px-4 rounded-xl">
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
                  </a>
                </Link>
              );
            })
          ) : (
            // 👇プランデータが[]からnullもしくはデータフェッチされるまではローディングを表示させる
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
