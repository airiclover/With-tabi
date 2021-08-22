import firebase from "src/utils/firebase/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { useForm } from "react-hook-form";
import { EmojiMart } from "src/utils/emojimart";
import { Emoji } from "emoji-mart";
import { CloseIcon } from "src/components/common/assets/CloseIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";
import toast from "react-hot-toast";

export const EditPlanForm = (props) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [emoji, setEmoji] = useState(props.plan.planIcon); //アイコン

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const on_submit = (data) => {
    //絵文字等のサロゲートペア対応する
    console.log("編集！！！", data);

    const startDate = new Date(data.startDate);
    const lastDate = new Date(data.lastDate);
    const last = lastDate.setDate(lastDate.getDate() + 1);

    const arrDates = [];

    for (let d = new Date(startDate); d < last; d.setDate(d.getDate() + 1)) {
      startDate.setDate(startDate.getDate() + 1);
      const newDate = new Date(d);
      const month = newDate.getMonth() + 1;
      const date = newDate.getDate();
      arrDates.push(`${month}/${date}`);
    }

    // =================================
    // 👇 日程変更があった場合、不要となる日付を抽出するため以下処理

    const beforeArr = props.plan.arrDates;
    const result = [...beforeArr, ...arrDates]; //元々登録されていたの日程配列と、変更後の日程配列を合わせる
    const duplicateArr = result.filter(
      (x, i, self) => self.indexOf(x) === i && i !== self.lastIndexOf(x)
    ); // 重複しているもののみを抽出
    const setResult = [...beforeArr, ...duplicateArr]; // 変更前の配列と重複している配列を合わせる
    const unnecessaryArr = setResult.filter(
      (x, i, self) => self.indexOf(x) === self.lastIndexOf(x)
    ); // 変更前の配列から不要な値(重複していたもの)のみを抽出
    // =================================

    const planDoc = db.collection("plans").doc(props.plan.id);

    props.plan.unnecessaryDate == false // 詳細プランの日付変更が必要なため処理させない
      ? arrDates.length <= 7 //プラン日程が7日までの場合、かつ、
        ? data.startDate <= data.lastDate // 出発日 < 帰着日の場合
          ? planDoc
              .update({
                title: data.title,
                planIcon: emoji,
                startDate: data.startDate,
                lastDate: data.lastDate,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                arrDates: arrDates,
              })
              .then(() => {
                const changeDateArr = [];

                unnecessaryArr.length != 0 && // 日程変更があり、不要な日付があった場合以下処理をして、変更が必要な詳細データがないかチェックする
                  unnecessaryArr.map((unnecessaryDay) => {
                    const dateArr = [];

                    planDoc
                      .collection("plan")
                      .where("day", "==", unnecessaryDay)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          planDoc.collection("plan").doc(doc.id).update({
                            dateChange: true,
                            updatedAt:
                              firebase.firestore.FieldValue.serverTimestamp(),
                          });
                          dateArr.push(doc.data().day);
                        });

                        // 上記forEachでデータがなかったら以下処理しないよう条件分岐
                        // (でないと空配列が入り1としてカウントされてしまうため)
                        dateArr.length != 0 && changeDateArr.push(dateArr);

                        // 不要な日付に詳細データがあった場合のみ、
                        // 「unnecessaryDate: true」をドキュメントに追加させる
                        changeDateArr.length != 0 &&
                          planDoc.update({ unnecessaryDate: true });
                      });
                  });

                props.closeFixForm();
                props.getUsersPlans(); //startDateを降順でソートしたものを反映したいため関数呼び出し
              })
              .catch((error) => {
                console.error("エラーだよ！: ", error);
              })
          : toast.error("正しい帰着日を登録して下さい。") // 出発日 > 帰着日の場合
        : toast.error("日程が7日を超える場合はプランを分けて登録して下さい。") //プラン日程が8日以上の場合
      : toast.error("プランページで日程変更の必要なデータがあります。");
  };

  const on_submit_detail = (data) => {
    //絵文字等のサロゲートペア対応する
    console.log("detail!!!", data);

    const detailDoc = db
      .collection("plans")
      .doc(props.query)
      .collection("plan")
      .doc(props.plan.id);

    data.lastTime && data.lastTime <= data.startTime // 終了時刻があるかつ、開始時刻と終了時刻が逆の場合
      ? toast.error("正しい時刻を登録して下さい。")
      : detailDoc
          .update({
            title: data.title,
            planIcon: emoji,
            startTime: data.startTime,
            lastTime: data.lastTime,
            memo: data.memo,
            money: data.money,
          })
          .then(() => {
            props.closeFixForm();
            props.getPage(); //startDateを降順でソートしたものを反映したいため関数呼び出し
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
          {/*  プランページと詳細ページでフォームを出し分ける */}
          {props.planPage === "planPage" ? (
            // 👇 プランページの場合のフォーム
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
                  ) : null}
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
          ) : (
            // 👇 プラン詳細ページの場合のフォーム
            <div className="min-h-screen pt-6 pb-10 px-6 inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white">
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

              <form onSubmit={handleSubmit(on_submit_detail)}>
                <label className="pb-7 font-semibold flex flex-col">
                  プランタイトル
                  <input
                    defaultValue={props.plan.title}
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
                      defaultValue={props.plan.startTime}
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
                      defaultValue={props.plan.lastTime}
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
                    defaultValue={props.plan.memo}
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
                    defaultValue={props.plan.money.replaceAll(",", "")}
                    type="text"
                    placeholder="10000 (数値のみ)"
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
                    編集
                  </button>
                </div>
              </form>
            </div>
          )}
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
