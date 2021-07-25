import Link from "next/link";
import { BlogWrap } from "src/components/blog/BlogWrap";

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

        <Link href="/">
          <a>
            <div className="w-full py-3.5 text-white font-semibold tracking-wider rounded-full text-center bg-blue-500 hover:bg-blue-600">
              もっとブログをみる
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};
