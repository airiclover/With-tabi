import Link from "next/link";
import { BlogWrap2 } from "src/components/blog/BlogWrap";

export const CommonBlog = () => {
  return (
    <div className="pt-28 pb-14 px-4 bg-blue-50">
      <div className="pb-12 relative">
        <p className="text-blue-400 text-opacity-25 text-6xl font-black tracking-wider absolute bottom-16 left-1">
          Blog
        </p>
        <div className="text-2xl font-semibold">旅の思い出</div>
      </div>

      <div className="pb-10 flex flex-col items-center">
        <BlogWrap2 />
        <BlogWrap2 />
        <BlogWrap2 />
        <BlogWrap2 />
        <BlogWrap2 />
        <BlogWrap2 />
      </div>

      <Link href="/">
        <a>
          <div className="w-full py-3.5 text-white font-semibold tracking-wider rounded-full text-center bg-blue-500 hover:bg-blue-600">
            もっとブログをみる
          </div>
        </a>
      </Link>
    </div>
  );
};
