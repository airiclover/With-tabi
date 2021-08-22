import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { auth } from "src/utils/firebase/firebase";
import { useSetRecoilState } from "recoil";
import { userState } from "src/utils/recoil/userState";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { InstagramIcon } from "src/components/common/assets/InstagramIcon";
import { EmojiIcon } from "src/components/common/assets/EmojiIcon";
import { LogoutIcon } from "src/components/common/assets/LogoutIcon";

const UserPage = () => {
  const { userInfo } = useCurrentUser();
  const setUserInfo = useSetRecoilState(userState);
  const router = useRouter();

  useRequireLogin();
  console.log("アカウントページ", userInfo);

  const logoutButton = () => {
    auth
      .signOut()
      .then(() => {
        setUserInfo(undefined);
      })
      .catch((error) => {
        console.log(error);
      });
    router.push("/");
  };

  return (
    <CommonLayout>
      {userInfo ? (
        <div>
          <div className="pl-4 pt-4 flex items-center">
            <EmojiIcon className="w-8 h-8" />
            <h1 className="pl-1 text-2xl font-bold tracking-wider">
              アカウント
            </h1>
          </div>

          <div className="bg-white mt-4 mx-5 mb-8 p-4 rounded-xl">
            <div className="flex">
              <Image
                src={userInfo?.icon}
                alt="userIcon"
                width={110}
                height={110}
                objectFit="cover"
                className="rounded-full"
                loading="eager"
                priority
              />

              <div className="pl-3 flex items-end">
                {userInfo?.twitter ? (
                  <a
                    href={`https://twitter.com/${userInfo?.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pr-1.5"
                  >
                    <TwitterIcon width="30" height="30" fill="#A1A1AA" />
                  </a>
                ) : null}

                {userInfo?.instagram ? (
                  <a
                    href={`https://www.instagram.com/${userInfo?.instagram}/?hl=ja`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                ) : null}
              </div>
            </div>
            <p className="py-4 text-2xl font-bold">{userInfo?.name}</p>
            <p className="tracking-tight">{userInfo?.introduce}</p>

            <Link href="/settings/account">
              <a>
                <div className="my-5 py-0.5 px-5 bg-yellow-500 text-white rounded-full text-center leading-10 hover:bg-hover-yellow">
                  プロフィールを編集
                </div>
              </a>
            </Link>
          </div>

          <button
            className="w-full py-4 px-6 text-sm border-t-2 text-left flex items-center hover:bg-gray-200"
            onClick={logoutButton}
          >
            <LogoutIcon />
            <p className="pl-2">ログアウト</p>
          </button>

          <Link href="/settings/delete_account">
            <a className="py-4 px-6 text-sm border-t-2 border-b-2 block hover:bg-gray-200">
              アカウントを削除
            </a>
          </Link>
        </div>
      ) : (
        <div>ローディング中！！！</div> // 仮実装
      )}
    </CommonLayout>
  );
};

export default UserPage;
