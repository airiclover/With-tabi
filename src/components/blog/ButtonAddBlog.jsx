import { PlusIcon } from "src/components/common/assets/PlusIcon";

export const ButtonAddBlog = () => {
  return (
    <button className="fixed bottom-6 right-6">
      <div className="h-16 w-16 bg-blue-500 text-center rounded-full flex flex-col relative hover:bg-blue-600">
        <PlusIcon />
        <p className="text-xs text-white font-semibold absolute top-10 left-5">
          投稿
        </p>
      </div>
    </button>
  );
};
