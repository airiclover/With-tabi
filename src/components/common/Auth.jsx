import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { auth } from "src/utils/firebase/firebase";
import firebase from "src/utils/firebase/firebase";
import { userState } from "src/utils/recoil/userState";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { GoogleIcon } from "src/components/common/assets/GoogleIcon";

// ❕❕❕6issuesが出てるのでチェックする🗯❕❕❕

//ソーシャルログインは新規登録・ログインの関数が同じため、Authコンポーネントにまとめて記述

export const Auth = (props) => {
  // 👇signupして取得してきたデータをrecoilの関数で書き換え、グローバルでstateを管理する
  const setUserInfo = useSetRecoilState(userState);
  const router = useRouter();

  const twitterLogin = useCallback(async () => {
    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    await auth
      .signInWithPopup(twitterProvider)
      .then(async (userCredential) => {
        setUserInfo({ uid: userCredential.user.uid });
        const uid = userCredential.user.uid;
        await router.push(`/${uid}/plan`);
        return userCredential;
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const googleLogin = useCallback(async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(googleProvider)
      .then(async (userCredential) => {
        setUserInfo({ uid: userCredential.user.uid });
        const uid = userCredential.user.uid;
        await router.push(`/${uid}/plan`);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="min-h-screen pt-28 px-4 text-center">
        <Image src="/img/logo.png" alt="logoImg" width={180} height={42} />

        <div className="mt-20">
          <button
            onClick={twitterLogin}
            className="w-full mb-12 py-4 bg-blue-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center"
          >
            <TwitterIcon />
            <span className="ml-3">
              {props.page === "login"
                ? "Twitterからログイン"
                : "Twitterから新規登録"}
            </span>
          </button>

          <button
            onClick={googleLogin}
            className="w-full py-4 bg-gray-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center"
          >
            <GoogleIcon />
            <span className="ml-3">
              {props.page === "login"
                ? "Googleからログイン"
                : "Googleから新規登録"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
