import toast from "react-hot-toast";
import firebase from "src/utils/firebase/firebase";
import { useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { Menu } from "@headlessui/react";
import { Modal } from "src/components/common/Modal";
import { DotsIcon } from "src/components/common/assets/DotsIcon";
import { EditPlanForm } from "src/components/plan/EditPlanForm";
import { EditDateModal } from "src/components/plan/EditDateModal";

export const Dropdown = (props) => {
  const [isOpenFixForm, setIsOpenFixForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selected, setSelected] = useState(props.arrDates);

  const isPlanEdit = () => {
    openFixForm();
  };

  const planDoc = db.collection("plans").doc(props.plan.id);
  const planDocQuery = db.collection("plans").doc(props.query);
  const detailDoc = db
    .collection("plans")
    .doc(props.query)
    .collection("plan")
    .doc(props.plan.id);

  const isPlanDelete = () => {
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
    detailDoc
      .delete()
      .then(() => {
        toast.success("データを削除しました。");
        props.getPage();

        props.page == "changeDetailPage" && closeModal();
      })
      .catch((error) => {
        console.error("doc削除エラー: ", error);
        toast.error("エラーが発生しました。時間をおいてから試してください。");
      });
  };

  const isDateEdit = () => {
    detailDoc
      .update({
        day: selected,
        dateChange: firebase.firestore.FieldValue.delete(),
      })
      .then(async () => {
        toast.success("日付を変更しました。");
        props.getPage();
      });
    // 👇 残り1つになったものが削除されたら0になるので、
    //   「unnecessaryDate: false」を実行。
    props.arrChangePlans.length == 1 &&
      planDocQuery.update({ unnecessaryDate: false });
    closeEditModal();
  };

  // ========== Form for edit ===========
  const openFixForm = () => {
    setIsOpenFixForm(true);
  };

  const closeFixForm = () => {
    setIsOpenFixForm(false);
  };
  // ====================================

  // ======== Modal for delete ==========
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  // ====================================

  // ======== Modal for date edit =======
  const closeEditModal = () => {
    setIsOpenEditModal(false);
  };

  const openEditModal = () => {
    setIsOpenEditModal(true);
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
                onClick={
                  props.page == "changeDetailPage" ? openEditModal : isPlanEdit
                }
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

      <EditPlanForm
        planPage={props.page}
        plan={props.plan}
        query={props.query}
        getUsersPlans={props.getUsersPlans}
        getPage={props.getPage}
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

      {props.page == "changeDetailPage" && (
        <EditDateModal
          isOpenEditModal={isOpenEditModal}
          closeEditModal={closeEditModal}
          isDateEdit={isDateEdit}
          selected={selected}
          setSelected={setSelected}
          arrDates={props.docData.arrDates}
          title="プラン日付変更"
          subTitle="変更する日付を選んでください。"
          button1="キャンセル"
          button2="変更する"
        />
      )}
    </>
  );
};
