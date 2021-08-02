import { useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { Menu } from "@headlessui/react";
import { Modal } from "src/components/common/Modal";
import { DotsIcon } from "src/components/common/assets/DotsIcon";
import toast from "react-hot-toast";

export const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const isEdit = () => {
    console.log("isEdit", props.planID);
  };

  const isPlanDelete = () => {
    const planDoc = db.collection("plans").doc(props?.planID);
    planDoc
      .delete()
      .then(() => {
        console.log("planデータ削除したよ！");
        toast.success("データを削除しました。");
        props.getUsersPlans();
      })
      .catch((error) => {
        console.error("doc削除エラー: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Menu>
        <div className="static">
          <Menu.Button className="mb-1 mr-2 p-0.5 absolute bottom-0 right-0 rounded-full hover:bg-gray-100">
            <DotsIcon />
          </Menu.Button>
        </div>
        <Menu.Items className="py-1.5 px-1 bg-white text-sm rounded-md shadow-lg flex flex-col z-10 absolute -bottom-20 right-0 ring-2 ring-gray-200 ring-opacity-25">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={isEdit}
                className={`${active && "bg-gray-100"} py-1.5 px-6 rounded-md`}
              >
                編集
              </button>
            )}
          </Menu.Item>
          <span className="border-t"></span>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={openModal}
                className={`${active && "bg-gray-100"} py-1.5 px-6 rounded-md`}
              >
                削除
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        isDelete={isPlanDelete}
        title="プランを削除"
        subTitle="プランが削除されます。よろしいですか？"
        button1="キャンセル"
        button2="削除する"
      />
    </>
  );
};
