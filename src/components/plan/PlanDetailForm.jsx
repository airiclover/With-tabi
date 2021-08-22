import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { useForm } from "react-hook-form";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";
import toast from "react-hot-toast";

export const PlanDetailForm = (props) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(""); //アイコン

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const on_submit = (data) => {
    //絵文字等のサロゲートペア対応する
    console.log("on_submitディテール！", data);

    data.lastTime && data.lastTime <= data.startTime // 終了時刻があるかつ、開始時刻と終了時刻が逆の場合
      ? toast.error("正しい時刻を登録して下さい。")
      : db
          .collection("plans")
          .doc(props.query)
          .collection("plan")
          .add({
            userID: props.plan.userID,
            day: props.plan.arrDates[props.isTabId], // Tabで選択した日にち
            planIcon: emoji,
            title: data.title,
            startTime: data.startTime,
            lastTime: data.lastTime,
            memo: data.memo,
            money: data.money,
          })
          .then(() => {
            props.getPage(); //Tabで日付分けたい＆startTimeを降順でソートしたものを反映したいため関数呼び出し
            props.closeFormModal();

            const result = {
              title: "",
              startTime: "",
              lastTime: "",
              memo: "",
              money: "",
            };
            reset(result);
            setEmoji("");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
  };

  const openEmoji = () => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  };

  const handleEmojiReset = () => {
    setEmoji("");
  };

  return (
    <Transition appear show={props.isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto text-gray-800"
        onClose={props.closeFormModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="min-h-screen pt-6 pb-10 px-6 inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white">
            <div className="text-right">
              <button
                type="button"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
                onClick={props.closeFormModal}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="pt-6 pb-7">
              <p className="pb-1 font-semibold">アイコンを選択</p>
              <div className="flex">
                <button
                  onClick={openEmoji}
                  className="p-2.5 bg-gray-100 rounded-lg mr-3"
                >
                  <EmojiIcon className="w-6 h-6" />
                </button>
                {emoji ? (
                  <div className="flex items-center">
                    <Emoji emoji={emoji} size={30} />
                    <button
                      onClick={handleEmojiReset}
                      className="mt-1 ml-4 text-xs text-gray-400 border-b border-gray-400"
                    >
                      リセット
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* emoji-mart */}
              {isOpenEmoji ? (
                <EmojiMart
                  setEmoji={setEmoji}
                  setIsOpenEmoji={setIsOpenEmoji}
                />
              ) : null}
            </div>

            <form onSubmit={handleSubmit(on_submit)}>
              <label className="pb-7 font-semibold flex flex-col">
                プランタイトル
                <input
                  type="text"
                  placeholder="プランタイトル"
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

              <div className="flex pb-6">
                <label className="w-5/12 mr-6 font-semibold">
                  開始時刻
                  <input
                    type="time"
                    {...register("startTime", {
                      required: true,
                    })}
                    className="w-full mt-1 p-2 bg-gray-100 rounded-lg inline-block"
                  />
                  {errors.startTime && (
                    <span className="pt-1 text-red-500 text-xs">
                      入力は必須です
                    </span>
                  )}
                </label>

                <label className="w-5/12 font-semibold">
                  <div className="flex items-center">
                    <p>終了時刻</p>
                    <input
                      type="button"
                      onClick={() =>
                        reset({
                          lastTime: "",
                        })
                      }
                      className="ml-3 bg-white text-xs text-gray-400 border-b border-gray-400 cursor-pointer"
                      value="リセット"
                    />
                  </div>
                  <input
                    type="time"
                    {...register("lastTime", {
                      required: false,
                    })}
                    className="w-full mt-1 p-2 bg-gray-100 rounded-lg"
                  />
                </label>
              </div>

              <label className="mb-6 font-semibold flex flex-col">
                メモ
                <textarea
                  placeholder="メモ"
                  {...register("memo", {
                    required: false,
                    maxLength: 800,
                  })}
                  className="w-full h-24 p-2.5 text-base bg-gray-100 rounded-lg resize-none"
                />
                {errors.memo && (
                  <span className="pt-1 text-red-500 text-xs">
                    入力は800文字以内です。
                  </span>
                )}
              </label>

              <label className="mb-10 font-semibold flex flex-col">
                推定金額
                <input
                  type="text"
                  placeholder="10000(数値のみ)"
                  {...register("money", {
                    required: false,
                    pattern: /^[0-9]+$/,
                    maxLength: 8,
                  })}
                  className="w-full p-2 bg-gray-100 rounded-lg"
                />
                {errors.money && (
                  <span className="pt-1 text-red-500 text-xs">
                    数値(半角8桁以内)を入力して下さい。
                  </span>
                )}
              </label>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-yellow-500 text-white tracking-widest rounded-full hover:opacity-90 focus:outline-none"
                >
                  登録
                </button>
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
