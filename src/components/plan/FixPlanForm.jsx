import router from "next/router";
import firebase from "src/utils/firebase/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { useForm } from "react-hook-form";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";

export const FixPlanForm = (props) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(props.plan.planIcon); //アイコン

  const { userInfo } = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const on_submit = (data) => {
    console.log("編集！！！", data);

    const planDoc = db.collection("plans").doc(props.plan.id);
    planDoc
      .update({
        title: data.title,
        planIcon: emoji,
        startDate: data.startDate,
        lastDate: data.lastDate,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(async () => {
        props.closeFixForm();
        props.getUsersPlans(); //startDateを降順でソートしたものを反映したいため関数呼び出し
        await router.push(`/${userInfo.uid}/plan`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const openEmoji = () => {
    setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
  };

  return (
    <Transition appear show={props.isOpenFixForm} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto text-gray-800"
        onClose={props.closeFixForm}
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
                onClick={props.closeFixForm}
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

            <form onSubmit={handleSubmit(on_submit)}>
              <label className="pb-7 font-semibold flex flex-col">
                旅行タイトル
                <input
                  defaultValue={props.plan.title}
                  type="text"
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
                  defaultValue={props.plan.beforeStartDate}
                  type="date"
                  {...register("startDate", {
                    required: true,
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
                  defaultValue={props.plan.beforeLastDate}
                  type="date"
                  {...register("lastDate", {
                    required: true,
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
                  編集
                </button>
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
