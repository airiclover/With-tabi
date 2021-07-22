import Image from "next/image";
import { useRouter } from "next/router";
import firebase from "src/utils/firebase/firebase";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { Layout } from "src/components/Layout/Layout";
import { db } from "src/utils/firebase/firebase";
import { InputSettings } from "src/components/common/InputSettings";

const Settings = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const [userProfile, setUserProfile] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [userIcon, setUserIcon] = useState(userInfo.icon);
  const [userName, setUserName] = useState(userInfo.name);
  const [userTwitter, setUserTwitter] = useState(userInfo.twitter);
  const [userInstagram, setUserInstagram] = useState(userInfo.instagram);
  const [userIntroduce, setUserIntroduce] = useState(userInfo.introduce);
  const router = useRouter();

  const onChangeUserName = useCallback((e) => setUserName(e.target.value), []);
  const onChangeUserTwitter = useCallback(
    (e) => setUserTwitter(e.target.value),
    []
  );
  const onChangeUserInstagram = useCallback(
    (e) => setUserInstagram(e.target.value),
    []
  );
  const onChangeUserIntroduce = useCallback(
    (e) => setUserIntroduce(e.target.value),
    []
  );

  //recoilにセットしてるuidよりデータ取得
  const getUserProfile = useCallback(async () => {
    const userDoc = db.collection("users").doc(userInfo.uid);

    await userDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        setUserProfile(docData);
      })
      .catch((error) => {
        console.log("settingページエラーだよ！:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  // (仮)アイコン画像変更チェック=========================
  const changeIcon = useCallback(() => {
    console.log("アイコンチェンジ！");
  }, []);
  // ==================================================

  const updateSettingsButton = useCallback(async () => {
    const userDoc = db.collection("users").doc(userInfo.uid);
    await userDoc.update({
      name: userName,
      icon: userIcon,
      twitter: userTwitter,
      instagram: userInstagram,
      introduce: userIntroduce,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //Recoilのstate変更
    updateUserRecoil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userIcon,
    userInfo.uid,
    userInstagram,
    userIntroduce,
    userName,
    userTwitter,
  ]);

  const updateUserRecoil = async () => {
    setUserInfo({
      uid: userInfo.uid,
      name: userName,
      icon: userIcon,
      twitter: userTwitter,
      instagram: userInstagram,
      introduce: userIntroduce,
    });
    await router.push(`/${userInfo.uid}`);
  };

  return (
    <Layout>
      {userProfile ? (
        <div>
          {console.log("コンポーネント内", userProfile)}

          <h1 className="p-4 text-4xl font-bold tracking-wider">Settings</h1>
          <div className="px-10 pb-6">
            {/* 💬【todo】画像変更処理を追加する */}
            <div className="pt-2 pb-6 flex flex-col items-center">
              <Image
                src={userIcon}
                alt="userIcon"
                width={110}
                height={110}
                objectFit="cover"
                className="rounded-full"
                loading="eager"
                priority
              />
              <button className="text-sm text-gray-500" onClick={changeIcon}>
                アイコンを変更する
              </button>
            </div>

            {/* 💬【todo】以下全てにバリデーションかける処理を記述する */}
            {/* 1文字以上50文字以内 */}
            <InputSettings
              title="名前（ニックネーム）"
              placeholder="名前"
              userName={userName}
              onChangeUserName={onChangeUserName}
            />

            {/* 15文字以内  */}
            <InputSettings
              title="Twitterユーザー名"
              placeholder="@なしで入力"
              userName={userTwitter}
              onChangeUserName={onChangeUserTwitter}
            />

            {/* 30文字以内  */}
            <InputSettings
              title="Instagramユーザー名"
              placeholder="@なしで入力"
              userName={userInstagram}
              onChangeUserName={onChangeUserInstagram}
            />

            {/* 160文字以内 */}
            <label className="text-sm">
              自己紹介
              <textarea
                type="text"
                placeholder="自己紹介（160文字以内）"
                value={userIntroduce}
                onChange={onChangeUserIntroduce}
                className="w-full mb-4 h-24 p-2.5 text-base bg-gray-100 rounded-lg resize-none"
              />
            </label>

            {/* 💬【todo】ボタンのコンポーネント分割する？ */}
            <div className="text-right">
              <button
                className="h-11 w-28 bg-yellow-500 text-white rounded-full"
                onClick={updateSettingsButton}
              >
                変更する
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h1>ローディング中！！！</h1>
      )}
      {/* 💬【todo】👆ローディング中のスケルトンローダーを入れる */}
    </Layout>
  );
};

export default Settings;
