// import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CommonLayout } from "src/components/Layout/CommonLayout";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { PlanIcon } from "src/components/common/assets/PlanIcon";
import { PlusIcon } from "src/components/common/assets/PlusIcon";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";

/* 👇一時的にeslintの絵文字入力を許可 */
/* eslint-disable jsx-a11y/accessible-emoji */

const UserPlanPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [title, setTitle] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [backDate, setBackDate] = useState("");

  // データ取得チェック=========================
  const { userInfo } = useCurrentUser();
  useRequireLogin();
  console.log("プランページ", userInfo);
  // ========================================

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const openEmoji = () => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  };

  const onChangeTitle = (e) => setTitle(e.target.value);

  const onChangeDepartureDate = (e) => setDepartureDate(e.target.value);

  const onChangeBackDate = (e) => setBackDate(e.target.value);

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
                      value={departureDate}
                      onChange={onChangeDepartureDate}
                      className="p-2 bg-gray-100 rounded-lg"
                    />
                  </div>
                  <div className="pb-12">
                    <p className="pb-1 font-semibold">帰着日</p>
                    <input
                      type="text"
                      placeholder="2021/12/10"
                      value={backDate}
                      onChange={onChangeBackDate}
                      className="p-2 bg-gray-100 rounded-lg"
                    />
                  </div>
                </div>
                {/* ===================================== */}

                <div className="text-right">
                  <button
                    type="button"
                    className="px-8 py-3 bg-yellow-500 text-white tracking-widest rounded-full hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
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
          <PlanIcon className={"h-9 w-9"} />
          <h1 className="pl-2 text-4xl font-bold tracking-wider">
            Travel Plans
          </h1>
        </div>

        {/* ========================== */}
        <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
          <h2 className="pb-1 text-lg font-bold line-clamp-2">
            🇦🇺 オーストラリア旅行
          </h2>
          <p className="pl-6 text-sm">2021/12/31(金) - 2022/1/5(水)</p>
        </div>
        {/* ========================== */}

        {/* 👇データがないとき */}

        {/* <div className="pt-10 pb-14 pl-4 font-semibold">
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
      /> */}

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
