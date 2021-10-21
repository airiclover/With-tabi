import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import firebase from "src/utils/firebase/firebase";
import { useState } from "react";
import { auth, db } from "src/utils/firebase/firebase";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { GoogleIcon } from "src/components/common/assets/GoogleIcon";

//ソーシャルログインは新規登録・ログインの関数が同じため、Authコンポーネントにまとめて記述
export const Auth = (props) => {
  const [email, setEmail] = useState("login@test.com");
  const [password, setPassword] = useState("test123");
  const [isAuth, setIsAuth] = useState(false);
  const setUserInfo = useSetRecoilState(userState);
  const router = useRouter();

  const twitterLogin = async () => {
    toast.loading("Loading...🏝");
    setIsAuth(true);

    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    await auth
      .signInWithPopup(twitterProvider)
      .then((userCredential) => {
        const userData = userCredential.user;
        commonAuth(userData);
      })
      .catch(function (error) {
        toast.dismiss();
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
        setIsAuth(false);
      });
  };

  const googleLogin = async () => {
    toast.loading("Loading...🏝");
    setIsAuth(true);

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(googleProvider)
      .then((userCredential) => {
        const userData = userCredential.user;
        commonAuth(userData);
      })
      .catch(function (error) {
        toast.dismiss();
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
        setIsAuth(false);
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
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
      });

    toast.dismiss();
    setIsAuth(false);
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
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
        setIsAuth(false);
      });
  };

  // ============================
  //testログイン用
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const testLoginButton = async (e) => {
    toast.loading("Loading...🏝");
    setIsAuth(true);

    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password).then(async () => {
        const userDoc = db
          .collection("users")
          .doc("8gcH4lbpJRb2Z1Pj10K6JUuXrXt2"); //test用uid
        await userDoc.get().then((doc) => {
          const docData = doc.data();
          if (doc.exists) {
            //userDocにデータがある場合
            setUserInfo({
              uid: "8gcH4lbpJRb2Z1Pj10K6JUuXrXt2",
              name: docData.name,
              icon: docData.icon,
              twitter: docData.twitter,
              instagram: docData.instagram,
              introduce: docData.introduce,
            });
          } else {
            console.log("データなし");
          }
        });
        toast.dismiss();
        setIsAuth(false);
        await router.push("/8gcH4lbpJRb2Z1Pj10K6JUuXrXt2/plan");
      });
    } catch (error) {
      toast.dismiss();
      toast.error(
        error,
        ":エラーが発生しました。時間をおいてから試してください。"
      );
      setIsAuth(false);
    }
  };
  // ============================

  return (
    <div
      className={`min-h-screen pt-28 px-4 text-center 
        ${isAuth && "opacity-60"}`}
    >
      <Image src="/img/logo.png" alt="logoImg" width={180} height={42} />

      <div className="mt-20">
        <button
          onClick={twitterLogin}
          className="w-full max-w-md mx-auto mb-12 py-4 bg-blue-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center hover:bg-blue-600"
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
          className="w-full max-w-md mx-auto py-4 bg-gray-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center hover:bg-gray-600"
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

        {props.page === "login" && (
          <div className="mx-auto max-w-md my-10 bg-gray-200 p-6 rounded-lg">
            <p>テストログインはこちら</p>
            <input
              type="text"
              value={email}
              onChange={onChangeEmail}
              className="w-5/6 mt-3 py-1 px-2.5 text-sm rounded-full"
            />
            <input
              type="text"
              value={password}
              onChange={onChangePassword}
              className="w-5/6 mt-3 py-1 px-2.5 text-sm rounded-full"
            />
            <button
              onClick={testLoginButton}
              className="mx-auto mt-4 py-1.5 px-10 bg-gray-400 text-white text-sm rounded-full block"
            >
              ログイン
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
