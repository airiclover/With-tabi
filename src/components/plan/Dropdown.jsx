import toast from "react-hot-toast";
import { useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { Menu } from "@headlessui/react";
import { Modal } from "src/components/common/Modal";
import { DotsIcon } from "src/components/common/assets/DotsIcon";
import { FixPlanForm } from "src/components/plan/FixPlanForm";

export const Dropdown = (props) => {
  const [isOpenFixForm, setIsOpenFixForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isPlanEdit = () => {
    console.log("isEdit", props.plan);
    openFixForm();
  };

  const isPlanDelete = () => {
    const planDoc = db.collection("plans").doc(props.plan.id);
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

  const isPlanDetailDelete = () => {
    const detailDoc = db
      .collection("plans")
      .doc(props.query)
      .collection("plan")
      .doc(props.plan.id);
    detailDoc
      .delete()
      .then(() => {
        console.log("planデータ削除したよ！");
        toast.success("データを削除しました。");
        props.getPlan();
      })
      .catch((error) => {
        console.error("doc削除エラー: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  // ========== Form for edit ===========
  const openFixForm = () => {
    setIsOpenFixForm(true);
  };

  const closeFixForm = () => {
    setIsOpenFixForm(false);
  };
  // ====================================

  // ======== Modal for delete ========
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  // ====================================

  return (
    <>
      <Menu>
        <div className="static">
          <Menu.Button className="mb-1 mr-2 p-0.5 absolute bottom-0 right-0 rounded-full hover:bg-gray-100">
            <DotsIcon />
          </Menu.Button>
        </div>
        <Menu.Items className="py-1.5 px-1 bg-white text-sm rounded-md shadow-lg flex flex-col z-10 absolute -bottom-20 right-0">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={isPlanEdit}
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

      <FixPlanForm
        plan={props.plan}
        getUsersPlans={props.getUsersPlans}
        isOpenFixForm={isOpenFixForm}
        closeFixForm={closeFixForm}
      />

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        isDelete={props.page === "planPage" ? isPlanDelete : isPlanDetailDelete}
        title="プランを削除"
        subTitle="プランが削除されます。よろしいですか？"
        button1="キャンセル"
        button2="削除する"
      />
    </>
  );
};
