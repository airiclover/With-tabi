import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header>
      <div className="h-14 p-2 flex justify-between items-center">
        <Link href="/">
          <a>
            <Image
              src="/img/logo.png"
              alt="logoImg"
              width={120}
              height={28}
              loading="eager"
              priority
            />
          </a>
        </Link>

        <div>
          <button className="mr-1.5 py-1.5 px-2.5 text-xs text-yellow-500 border border-yellow-500 rounded-full">
            ログイン
          </button>
          <button className="text-xs py-1.5 px-2.5 bg-yellow-500 text-white border border-yellow-500 rounded-full">
            新規登録
          </button>
        </div>
      </div>
    </header>
  );
};
