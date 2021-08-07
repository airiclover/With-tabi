import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import firebase from "src/utils/firebase/firebase";
import { auth, db } from "src/utils/firebase/firebase";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { GoogleIcon } from "src/components/common/assets/GoogleIcon";

//ソーシャルログインは新規登録・ログインの関数が同じため、Authコンポーネントにまとめて記述
export const Auth = (props) => {
  const setUserInfo = useSetRecoilState(userState);
  const router = useRouter();

  const twitterLogin = async () => {
    toast.loading("Loading...🏝");

    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    await auth
      .signInWithPopup(twitterProvider)
      .then((userCredential) => {
        const userData = userCredential.user;
        commonAuth(userData);
      })
      .catch(function (error) {
        toast.dismiss();
        console.log(error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const googleLogin = async () => {
    toast.loading("Loading...🏝");

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(googleProvider)
      .then((userCredential) => {
        const userData = userCredential.user;
        commonAuth(userData);
      })
      .catch(function (error) {
        toast.dismiss();
        console.log(error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const commonAuth = async (userData) => {
    const uid = userData.uid;
    const providerData = userData.providerData[0];
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
        toast.dismiss();
        console.log("Auth(共通)エラーだよ！:", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });

    toast.dismiss();
    await router.push(`/${uid}/plan`);
  };

  // docに該当uidが存在しない場合、プロバイダ情報やプロフィールをsetする
  const setUserDoc = (uid, providerData) => {
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
        toast.dismiss();
        console.error("Auth新規登録エラーだよ！: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  return (
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

        <Link href={`/${props.textlink}`}>
          <a>
            <div className="mt-10 text-sm text-gray-400 border-b border-gray-400 inline-block hover:text-gray-800 hover:border-gray-800">
              {props.text}
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};
