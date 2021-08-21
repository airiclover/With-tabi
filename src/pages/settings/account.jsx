import Image from "next/image";
import firebase, { storage } from "src/utils/firebase/firebase";
import loadImage from "blueimp-load-image";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { Layout } from "src/components/layouts/Layout";
import { db } from "src/utils/firebase/firebase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Settings = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const router = useRouter();
  const [icon, setIcon] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const on_submit = useCallback(async (data) => {
    const userDoc = db.collection("users").doc(userInfo?.uid);
    await userDoc.update({
      name: data.name,
      twitter: data.twitter,
      instagram: data.instagram,
      introduce: data.introduce,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //Recoilのstate変更
    updateUserRecoil(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserRecoil = useCallback(
    (data) => {
      setUserInfo({
        uid: userInfo?.uid,
        name: data.name,
        icon: userInfo?.icon,
        twitter: data.twitter,
        instagram: data.instagram,
        introduce: data.introduce,
      });
      router.push("/settings");
    },
    [router, setUserInfo, userInfo?.icon, userInfo?.uid]
  );

  const handleChangeIcon = (e) => {
    const image = e.target.files[0];
    setIcon(image);
  };

  const onSetIconSubmit = async (e) => {
    e.preventDefault();
    if (icon === "") {
      toast.error("画像が選択させていません。");
      return;
    }

    toast.loading("画像をアップロード中です。");

    const canvas = await loadImage(icon, {
      maxWidth: 400,
      canvas: true,
    });

    canvas.image.toBlob((blob) => {
      // アップロード処理
      const uploadTask = storage.ref(`/userIcon/${icon.name}`).put(blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("snapshot", snapshot);
        },
        (error) => {
          console.log("エラーだよ！", error);
          toast.dismiss();
          toast.error("エラーが発生しました。時間をおいてから試してください。");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const userDoc = db.collection("users").doc(userInfo?.uid);
            userDoc.update({
              icon: downloadURL,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setUserInfo({
              uid: userInfo?.uid,
              name: userInfo?.name,
              icon: downloadURL,
              twitter: userInfo?.twitter,
              instagram: userInfo?.instagram,
              introduce: userInfo?.introduce,
            });
            setIcon("");
            toast.dismiss();
            toast.success("アイコンの変更が完了しました。");
          });
        }
      );
    }, icon.type);
  };

  const chancelSetIcon = () => {
    setIcon("");
  };

  return (
    <Layout>
      {userInfo ? (
        <div>
          <h1 className="p-4 text-4xl font-bold tracking-wider">Settings</h1>

          <div className="pt-2 pb-6 flex flex-col items-center">
            {icon === "" ? (
              <Image
                src={userInfo?.icon}
                alt="userIcon"
                width={112}
                height={112}
                objectFit="cover"
                className="rounded-full"
                loading="eager"
                priority
              />
            ) : (
              <img
                src={URL.createObjectURL(icon)}
                alt="uploaded"
                className="w-28 h-28 rounded-full object-cover"
              />
            )}

            <label className="text-sm text-gray-500 border-b border-gray-500 cursor-pointer">
              ファイルを選択する
              <input
                type="file"
                onChange={handleChangeIcon}
                accept="image/*"
                className="hidden"
              />
            </label>

            {icon != "" && (
              <>
                <div className="flex my-6">
                  <button
                    className="mr-2 py-2 px-4 text-yellow-500 text-sm rounded-full border border-yellow-500 hover:bg-hover-yellow"
                    onClick={chancelSetIcon}
                  >
                    キャンセル
                  </button>

                  <form onSubmit={onSetIconSubmit}>
                    <button
                      className="py-2 px-4 bg-yellow-500 text-white text-sm rounded-full hover:bg-hover-yellow"
                      onClick={onSetIconSubmit}
                    >
                      アイコンを変更する
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="px-10 pb-6">
            <form onSubmit={handleSubmit(on_submit)}>
              <label className="text-sm mb-4 flex flex-col">
                名前（ニックネーム）
                <input
                  defaultValue={userInfo?.name}
                  placeholder="名前"
                  {...register("name", {
                    required: true,
                    minLength: 1,
                    maxLength: 50,
                  })}
                  className="w-full p-2.5 text-base bg-gray-100 rounded-lg"
                />
                {errors.name && (
                  <span className="pt-1 text-red-500 text-xs">
                    入力は必須です(1-50文字以内)
                  </span>
                )}
              </label>

              <label className="text-sm mb-4 flex flex-col">
                Twitterユーザー名
                <input
                  defaultValue={userInfo?.twitter}
                  placeholder="@なしで入力"
                  {...register("twitter", {
                    required: false,
                    pattern: /^[0-9_a-zA-Z]+$/,
                    maxLength: 15,
                  })}
                  className="w-full p-2.5 text-base bg-gray-100 rounded-lg"
                />
                {errors.twitter && (
                  <span className="pt-1 text-red-500 text-xs">
                    正しいユーザー名を入力してください。
                  </span>
                )}
              </label>

              <label className="text-sm mb-4 flex flex-col">
                Instagramユーザー名
                <input
                  defaultValue={userInfo?.instagram}
                  placeholder="@なしで入力"
                  {...register("instagram", {
                    required: false,
                    pattern: /^[0-9_.a-zA-Z]+$/,
                    maxLength: 30,
                  })}
                  className="w-full p-2.5 text-base bg-gray-100 rounded-lg"
                />
                {errors.instagram && (
                  <span className="pt-1 text-red-500 text-xs">
                    正しいユーザー名を入力してください。
                  </span>
                )}
              </label>

              <label className="text-sm mb-4 flex flex-col">
                自己紹介
                <textarea
                  defaultValue={userInfo?.introduce}
                  placeholder="自己紹介（160文字以内）"
                  {...register("introduce", {
                    required: false,
                    maxLength: 160,
                  })}
                  className="w-full h-24 p-2.5 text-base bg-gray-100 rounded-lg resize-none"
                />
                {errors.introduce && (
                  <span className="pt-1 text-red-500 text-xs">
                    入力は160文字以内です。
                  </span>
                )}
              </label>

              <div className="text-right">
                <button
                  type="submit"
                  className="h-11 w-28 bg-yellow-500 text-white rounded-full hover:bg-hover-yellow"
                >
                  変更する
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>ローディング中！！！</div>
      )}
    </Layout>
  );
};

export default Settings;
