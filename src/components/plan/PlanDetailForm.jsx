// import router from "next/router";
// import firebase from "src/utils/firebase/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
// import { db } from "src/utils/firebase/firebase";
import { useForm } from "react-hook-form";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";

export const PlanDetailForm = (props) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(""); //アイコン

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm();

  const on_submit = (data) => {
    //絵文字等のサロゲートペア対応する
    console.log("on_submit関数内！！！", data);

    // db.collection("plans")
    //   .add({
    //     userID: props.userInfo?.uid,
    //     title: data.title,
    //     planIcon: emoji,
    //     startDate: data.startDate,
    //     lastDate: data.lastDate,
    //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //     updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    //   })
    //   .then(async () => {
    //     const result = {
    //       title: "",
    //       startDate: "",
    //       lastDate: "",
    //     };
    //     reset(result);

    //     setEmoji("");
    //     props.closeFormModal();
    //     props.getUsersPlans(); //startDateを降順でソートしたものを反映したいため関数呼び出し
    //     await router.push(`/${props.userInfo.uid}/plan`);
    //   })
    //   .catch((error) => {
    //     console.error("Error adding document: ", error);
    //   });
  };

  const openEmoji = () => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
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
          <div className="min-h-screen pt-6 px-4 inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white">
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
                <p className="pt-2">
                  {emoji ? <Emoji emoji={emoji} size={30} /> : ""}
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

              <label className="pb-7 font-semibold flex flex-col">
                出発日
                <input
                  type="time"
                  {...register("startDate", {
                    required: true,
                    pattern: /^[0-9]+$/,
                    maxLength: 10,
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
                  type="time"
                  {...register("lastDate", {
                    required: true,
                    pattern: /^[0-9]+$/,
                    maxLength: 10,
                  })}
                  className="w-full mt-1 p-2 bg-gray-100 rounded-lg"
                />
                {errors.lastDate && (
                  <span className="pt-1 text-red-500 text-xs">
                    入力は必須です(数値8文字)
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
