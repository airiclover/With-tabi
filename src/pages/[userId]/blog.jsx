import Image from "next/image";
import { Layout } from "src/components/Layout/Layout";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { InstagramIcon } from "src/components/common/assets/InstagramIcon";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";

const UserBlogPage = () => {
  const { userInfo } = useCurrentUser();

  return (
    <Layout>
      <div className="pt-6 pb-8 px-5">
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
      </div>

      {/* ========================= */}

      <div className="h-80 py-8 px-4 bg-gray-100">
        <div>以下はブログを表示させる？</div>
        <div>このページは誰もが閲覧可能</div>
      </div>
    </Layout>
  );
};

export default UserBlogPage;
