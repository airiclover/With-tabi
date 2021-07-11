import Link from "next/link";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { PlanIcon } from "src/components/common/assets/PlanIcon";
import { BlogIcon } from "src/components/common/assets/BlogIcon";

export const Header = () => {
  const userStateCheck = useRecoilValue(userState);
  const uid = userStateCheck.uid;

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

        {/* 👇ユーザー情報がある場合とない場合でHeaderの表示を分ける */}
        {uid ? (
          <div className="w-3/5">
            <div className="h-16 flex items-center text-xxs">
              <Link href="/[userId]/plan" as={`/${uid}/plan`}>
                <a className="mr-1 py-2 flex-1">
                  <div className="flex flex-col items-center">
                    {/* <PlanIcon size="6" /> */}
                    <PlanIcon className={"h-6 w-6"} />
                    <p className="pt-1.5">旅行プラン</p>
                  </div>
                </a>
              </Link>

              <Link href="/">
                <a className="py-2 flex-1 border-r-2 border-l-2">
                  <div className="flex flex-col items-center">
                    <BlogIcon />
                    <p className="pt-1.5">ブログ</p>
                  </div>
                </a>
              </Link>

              <Link href="/">
                <a className="mr-1 py-2 flex-1">
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
            </div>
          </div>
        ) : (
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
          </div>
        )}
      </div>
    </header>
  );
};
