import Link from "next/link";
import Image from "next/image";

export const BlogWrap = () => {
  return (
    <div className="flex pb-4">
      <Link href="/" prefetch={false}>
        <a className="flex-none">
          <Image
            src="/img/example.webp"
            alt="exampleImg"
            width={112}
            height={112}
            objectFit="cover"
            className="rounded-l-2xl"
          />
        </a>
      </Link>

      <div className="h-28 bg-white flex flex-col justify-between flex-grow rounded-r-2xl">
        <Link href="/" prefetch={false}>
          <a className="pt-2 px-1.5 flex-1">
            <h2 className="text-lg font-semibold break-all line-clamp-2">
              グアム4泊5日旅行
            </h2>
            <div className="text-xs text-gray-500">2021年10月20日</div>
          </a>
        </Link>

        <Link href="/" prefetch={false}>
          <a className="pb-2 pl-1.5 pr-4 flex justify-between">
            <div className="flex items-center">
              <Image
                src="/img/icon.png"
                alt="logoImg"
                width={25}
                height={25}
                objectFit="cover"
                className="rounded-full"
              />
              <div className="pl-1 text-xs">あいり</div>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <div className="pt-0.5 text-xs">500</div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};
