import { BlogWrap } from "src/components/blog/BlogWrap";
import { CommonButton } from "src/components/common/CommonButton";

export const CommonBlog = () => {
  return (
    <div>
      <div className="pt-20 pb-14 px-4 bg-blue-50">
        <h1 className="pb-12 text-2xl font-bold tracking-wider">Blog</h1>

        <div className="pb-10">
          <BlogWrap />
          <BlogWrap />
          <BlogWrap />
          <BlogWrap />
          <BlogWrap />
          <BlogWrap />
        </div>

        <CommonButton text="もっとブログをみる" bgColor="bg-blue-500" />
      </div>
    </div>
  );
};
