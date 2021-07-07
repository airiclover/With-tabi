import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header>
      <div className="h-16 flex items-center">
        <div className="w-2/5">
          <Link href="/">
            <a className="py-5 px-2">
              <Image
                src="/img/logo.png"
                alt="logoImg"
                width={110}
                height={25}
                loading="eager"
                priority
              />
            </a>
          </Link>
        </div>

        {/* 👇ログインしていない場合はこちらを表示させる */}
        <div className="w-3/5 pr-2 text-right">
          <Link href="/login">
            <a className="mr-2 py-1.5 px-2.5 text-xs text-yellow-500 border border-yellow-500 rounded-full leading-6">
              ログイン
            </a>
          </Link>

          <Link href="/signup">
            <a className="text-xs py-1.5 px-2.5 bg-yellow-500 text-white border border-yellow-500 rounded-full leading-6">
              新規登録
            </a>
          </Link>
          {/* -------------------------- */}

          {/* 👇ログインしている場合は、こちらを表示させる */}
          {/* <div className="w-3/5">
          <div className="h-16 flex items-center text-xxs">
            <Link href="/">
              <a className="mr-1 py-2 bg-gray-100 flex-1 rounded-lg">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  <p className="pt-1.5">プラン作成</p>
                </div>
              </a>
            </Link>

            <Link href="/">
              <a className="mr-1 py-2 bg-gray-100 flex-1 rounded-lg">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="pt-1.5">ブログ</p>
                </div>
              </a>
            </Link>

            <Link href="/">
              <a className="mr-1 py-2 bg-gray-100 flex-1 rounded-lg">
                <div className="flex flex-col items-center">
                  <Image
                    src="/img/icon.png"
                    alt="logoImg"
                    width={24}
                    height={24}
                    objectFit="cover"
                    className="rounded-full"
                    loading="eager"
                    priority
                  />
                  <p className="pt-1.5">マイページ</p>
                </div>
              </a>
            </Link>
          </div> */}
          {/* -------------------------- */}
        </div>
      </div>
    </header>
  );
};
