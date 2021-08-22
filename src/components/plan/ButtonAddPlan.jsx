import { PlusIcon } from "src/components/common/assets/PlusIcon";

export const ButtonAddPlan = (props) => {
  return (
    <button onClick={props.openFormModal} className="fixed bottom-6 right-6">
      <div className="h-16 w-16 bg-yellow-500 text-center rounded-full flex flex-col relative hover:bg-hover-yellow">
        <PlusIcon />
        <p className="text-xs text-white font-semibold absolute top-10 left-5">
          登録
        </p>
      </div>
    </button>
  );
};
