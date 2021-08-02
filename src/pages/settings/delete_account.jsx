import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { auth, db } from "src/utils/firebase/firebase";
import { useSetRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { Modal } from "src/components/common/Modal";
import { useState } from "react";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { useRequireLogin } from "src/components/common/hooks/useRequireLogin";

const DeleteAccount = () => {
  const setUserInfo = useSetRecoilState(userState);
  const { userInfo } = useCurrentUser();
  const router = useRouter();

  useRequireLogin();
  console.log("アカウント削除ページ", userInfo);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const deleteAccount = () => {
    isPlanDelete();
    deleteUserDoc();

    const user = auth.currentUser;
    user
      .delete()
      .then(() => {
        setUserInfo(undefined);

        toast.success("アカウントが削除されました");
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const deleteUserDoc = () => {
    const userDoc = db.collection("users").doc(userInfo?.uid);
    userDoc
      .delete()
      .then(() => {
        console.log("docデータ削除したよ！");
      })
      .catch((error) => {
        console.error("doc削除エラー: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const isPlanDelete = () => {
    console.log("プラン取得チェック");
    db.collection("plans")
      .where("userID", "==", userInfo?.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("プランデータを消したよ！");
          doc.ref.delete();
        });
      })
      .catch((error) => {
        console.log("プランデータ削除【エラー】だよ！", error);
      });
  };

  return (
    <CommonLayout>
      <div className="px-4">
        <h1 className="py-10 text-xl font-semibold">
          アカウントを削除しますか？
        </h1>
        <div className="pb-8">
          <p>アカウントを削除すると全てのデータが失われます。</p>
          <p>データは復元することができません。</p>
        </div>
        <button
          onClick={openModal}
          className="py-2 px-3 text-yellow-500 border border-yellow-500 rounded-full leading-6"
        >
          アカウントを削除
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        isDelete={deleteAccount}
        title="アカウントを削除"
        subTitle="アカウントが削除されます。よろしいですか？"
        button1="キャンセル"
        button2="削除する"
      />
    </CommonLayout>
  );
};

export default DeleteAccount;
