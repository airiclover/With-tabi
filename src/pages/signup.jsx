import Image from "next/image";
import { useCallback } from "react";
import { auth } from "src/utils/firebase/firebase";
import firebase from "src/utils/firebase/firebase";

// ❕❕❕6issuesが出てるのでチェックする🗯❕❕❕

const SignUp = () => {
  const googleLogin = useCallback(async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth
      .signInWithPopup(googleProvider)
      .then((result) => {
        return result;
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const twitterLogin = useCallback(async () => {
    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    await auth
      .signInWithPopup(twitterProvider)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch(function (error) {
        console.log(error);
      });
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-brand-twitter"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z" />
            </svg>
            <span className="ml-3">Twitterから新規登録</span>
          </button>

          <button
            onClick={googleLogin}
            className="w-full py-4 bg-gray-500 text-white font-semibold tracking-wider rounded-full flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-brand-google"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
            </svg>
            <span className="ml-3">Googleから新規登録</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUp;
