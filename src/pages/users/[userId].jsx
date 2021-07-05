// import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { PlanLayout } from "src/components/Layout/PlanLayout";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";

/* 👇一時的にeslintの絵文字入力を許可 */
/* eslint-disable jsx-a11y/accessible-emoji */

const UserPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [title, setTitle] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [backDate, setBackDate] = useState("");

  //モーダルを開ける
  const openModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  //モーダルを閉める
  const closeModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  //emoji-martの開け閉め
  const openEmoji = useCallback(() => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  }, []);

  //タイトル登録
  const onChangeTitle = useCallback((e) => setTitle(e.target.value), []);

  //出発日登録
  const onChangeDepartureDate = useCallback(
    (e) => setDepartureDate(e.target.value),
    []
  );

  //帰着日登録
  const onChangeBackDate = useCallback((e) => setBackDate(e.target.value), []);

  return (
    <PlanLayout>
      {/* 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛 */}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
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

      {/* 💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛💛 */}

      <div className="py-4 flex items-center relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h1 className="pl-2 text-4xl font-bold tracking-wider">Travel Plans</h1>
      </div>

      {/* ========================== */}
      <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺 オーストラリア旅行
        </h2>
        <p className="pl-6 text-sm">2021/12/31(金) - 2022/1/5(水)</p>
      </div>
      {/* <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺 Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h2>
        <p className="pl-6 text-xs">2021/12/31(金) - 2022/1/5(水)</p>
      </div>
      <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺 Eius maiores dolores impedit architecto adipisci doloremque
          perferendis odio consequuntur, obcaecati velit accusamus enim ad?
          Veniam, necessitatibus rem! Fugiat eligendi praesentium a.
        </h2>
        <p className="pl-6 text-xs">2021/12/31(金) - 2022/1/5(水)</p>
      </div>
      <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺 オーストラリア旅行
        </h2>
        <p className="pl-6 text-xs">2021/12/31(金) - 2022/1/5(水)</p>
      </div>
      <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺 アジア・オセアニア・ヨーロッパ3ヶ月旅
        </h2>
        <p className="pl-6 text-xs">2021/12/31(金) - 2022/1/5(水)</p>
      </div>
      <div className="h-24 bg-white mt-5 py-2 px-4 rounded-xl">
        <h2 className="pb-1 text-lg font-bold line-clamp-2">
          🇦🇺
          オーストラリア旅行オーストラリア旅行オーストラリア旅行オーストラリア旅行
        </h2>
        <p className="pl-6 text-xs">2021/12/31(金) - 2022/1/5(水)</p>
      </div> */}
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

      <button
        onClick={openModal}
        // onClick={() => console.log("登録")}
        className="fixed bottom-6 right-6"
      >
        <div className="h-16 w-16 bg-yellow-500 text-center rounded-full flex flex-col relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white absolute top-1.5 left-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-white font-semibold absolute top-10 left-5">
            登録
          </p>
        </div>
      </button>
    </PlanLayout>
  );
};

export default UserPage;
