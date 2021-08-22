import { useState } from "react";

export const useAddPlan = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const openFormModal = () => {
    setIsOpenModal(true);
  };

  const closeFormModal = () => {
    setIsOpenModal(false);
  };

  return {
    isOpenModal,
    openFormModal,
    closeFormModal,
  };
};
