import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { auth, db } from "src/utils/firebase/firebase";
import firebase from "src/utils/firebase/firebase";
import { userState } from "src/utils/recoil/userState";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { GoogleIcon } from "src/components/common/assets/GoogleIcon";
import toast from "react-hot-toast";

//ソーシャルログインは新規登録・ログインの関数が同じため、Authコンポーネントにまとめて記述
export const Auth = (props) => {
  const setUserInfo = useSetRecoilState(userState);
  const router = useRouter();

  const twitterLogin = useCallback(async () => {
    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    await auth
      .signInWithPopup(twitterProvider)
      .then(async (userCredential) => {
        commonAuth(userCredential);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const googleLogin = useCallback(async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(googleProvider)
      .then(async (userCredential) => {
        commonAuth(userCredential);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commonAuth = async (userCredential) => {
    const uid = userCredential.user.uid;
    const providerData = userCredential.user.providerData[0];
    const userDoc = db.collection("users").doc(uid);

    await userDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        if (doc.exists) {
          //userDocにデータがある場合
          setUserInfo({
            uid: uid,
            name: docData.name,
            icon: docData.icon,
            twitter: docData.twitter,
            instagram: docData.instagram,
            introduce: docData.introduce,
          });
        } else {
          //userDocにデータがない場合
          setUserInfo({
            uid: uid,
            name: providerData.displayName,
            icon: providerData.photoURL,
            twitter: "",
            instagram: "",
            introduce: "",
          });
          setUserDoc(uid, providerData);
        }
      })
      .catch((error) => {
        console.log("Auth(twitter)エラーだよ！:", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });

    await router.push(`/${uid}/plan`);
  };

  // docに該当uidが存在しない場合、プロバイダ情報やプロフィールをsetする
  const setUserDoc = useCallback((uid, providerData) => {
    db.collection("users")
      .doc(uid)
      .set({
        name: providerData.displayName,
        icon: providerData.photoURL,
        twitter: "",
        instagram: "",
        introduce: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        toast.success("アカウントが新規作成されました");
      })
      .catch((error) => {
        console.error("Auth新規登録エラーだよ！: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  }, []);

  return (
    <>
      <div className="min-h-screen pt-28 px-4 text-center">
        <Image src="/img/logo.png" alt="logoImg" width={180} height={42} />

        <div className="mt-20">
          <button
            onClick={twitterLogin}
            className="w-full mb-12 py-4 bg-blue-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center hover:bg-blue-600"
          >
            <TwitterIcon width="24" height="24" fill="#fff" />
            <span className="ml-3">
              {props.page === "login"
                ? "Twitterからログイン"
                : "Twitterから新規登録"}
            </span>
          </button>

          <button
            onClick={googleLogin}
            className="w-full py-4 bg-gray-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center hover:bg-gray-600"
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
