import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { CalendarIcon } from "src/components/common/assets/CalendarIcon";
import { BlogIcon } from "src/components/common/assets/BlogIcon";

export const Header = () => {
  const { userInfo } = useCurrentUser();

  return (
    <header className="h-16 flex items-center lg:h-18">
      <div className="w-2/5 lg:w-9/12">
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

      {userInfo ? (
        // ユーザー情報がある場合
        <div className="w-3/5 lg:w-3/12">
          <div className="h-16 flex items-center text-xxs">
            <Link href="/[userId]/plan" as={`/${userInfo.uid}/plan`}>
              <a className="py-2 flex-1 hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <CalendarIcon className={"h-6 w-6"} />
                  <p className="pt-1.5">旅行プラン</p>
                </div>
              </a>
            </Link>

            <Link href="/[userId]/blog" as={`/${userInfo.uid}/blog`}>
              <a className="py-2 flex-1 border-r-2 border-l-2 hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <BlogIcon />
                  <p className="pt-1.5">ブログ</p>
                </div>
              </a>
            </Link>

            <Link href="/settings">
              <a className="py-2 flex-1 hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <Image
                    src={userInfo.icon}
                    alt="userIcon"
                    width={28}
                    height={28}
                    objectFit="cover"
                    className="rounded-full"
                    loading="eager"
                    priority
                  />
                  <p className="pt-0.5">マイページ</p>
                </div>
              </a>
            </Link>
          </div>
        </div>
      ) : (
        // ユーザー情報がない場合
        <div className="w-3/5 pr-2 text-right lg:pr-5">
          <Link href="/login">
            <a className="mr-2 py-1.5 px-2.5 text-xs text-yellow-500 border border-yellow-500 rounded-full leading-6 lg:mr-3 lg:py-2 lg:px-4">
              ログイン
            </a>
          </Link>

          <Link href="/signup">
            <a className="text-xs py-1.5 px-2.5 bg-yellow-500 text-white border border-yellow-500 rounded-full leading-6 hover:bg-hover-yellow lg:py-2 lg:px-4">
              新規登録
            </a>
          </Link>
        </div>
      )}
    </header>
  );
};
