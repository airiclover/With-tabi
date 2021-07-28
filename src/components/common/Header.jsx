import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";
import { PlanIcon } from "src/components/common/assets/PlanIcon";
import { BlogIcon } from "src/components/common/assets/BlogIcon";

export const Header = () => {
  const { userInfo } = useCurrentUser();

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

        {userInfo ? (
          // ユーザー情報がある場合
          <div className="w-3/5">
            <div className="h-16 flex items-center text-xxs">
              <Link href="/[userId]/plan" as={`/${userInfo.uid}/plan`}>
                <a className="py-2 flex-1 hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <PlanIcon className={"h-6 w-6"} />
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
          <div className="w-3/5 pr-2 text-right">
            <Link href="/login">
              <a className="mr-2 py-1.5 px-2.5 text-xs text-yellow-500 border border-yellow-500 rounded-full leading-6">
                ログイン
              </a>
            </Link>

            <Link href="/signup">
              <a className="text-xs py-1.5 px-2.5 bg-yellow-500 text-white border border-yellow-500 rounded-full leading-6 hover:bg-hover-yellow">
                新規登録
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
