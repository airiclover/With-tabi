import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "src/utils/firebase/firebase";
import { Layout } from "src/components/layouts/Layout";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { ButtonAddBlog } from "src/components/blog/ButtonAddBlog";
import { BlogWrap } from "src/components/blog/BlogWrap";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { InstagramIcon } from "src/components/common/assets/InstagramIcon";
import { ExclamationIcon } from "src/components/common/assets/ExclamationIcon";

const UserBlogPage = () => {
  const { userInfo } = useCurrentUser();
  const [account, setAccount] = useState();
  const [blogs, setblogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (userInfo && userInfo.uid === router.query.userId) {
      // 管理者の場合
      setAccount(userInfo);
      getAuthorBlogs();
    } else {
      // 管理者じゃない場合
      checkAccount();
      getAuthorBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.userId]);

  const checkAccount = async () => {
    const userDoc = db.collection("users").doc(router.query.userId);

    await userDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        if (doc.exists) {
          //userDocにデータがある場合
          setAccount(docData);
        } else {
          //userDocにデータがない場合
          console.log("404ページに飛ばすかUI変更させる");
        }
      })
      .catch((error) => {
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
      });
  };

  // ================================
  // ブログ表示など
  const getAuthorBlogs = () => {
    db.collection("blogs")
      .where("uid", "==", router.query.userId)
      .orderBy("createdAt", "desc") //createdAtを降順でソートかける
      .get()
      .then((snapshot) => {
        setblogs(
          snapshot.docs.map((docs) => ({
            id: docs.id,
            data: docs.data(),
          }))
        );
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  // ================================

  return (
    <Layout>
      {account ? (
        <>
          <div className="pt-6 pb-8 px-5">
            <div className="flex">
              <Image
                src={account?.icon}
                alt="userIcon"
                width={112}
                height={112}
                objectFit="cover"
                className="rounded-full"
                loading="eager"
                priority
              />

              <div className="pl-3 flex items-end">
                {account?.twitter ? (
                  <a
                    href={`https://twitter.com/${account?.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pr-1.5"
                  >
                    <TwitterIcon width="30" height="30" fill="#A1A1AA" />
                  </a>
                ) : null}

                {account?.instagram ? (
                  <a
                    href={`https://www.instagram.com/${account?.instagram}/?hl=ja`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                ) : null}
              </div>
            </div>

            <p className="py-4 text-2xl font-bold">{account?.name}</p>
            <p className="tracking-tight">{account?.introduce}</p>
          </div>

          {/* ========================= */}
          {blogs.length !== 0 ? (
            // ブログ表示の試し
            <div className="pt-12 pb-24 px-4 bg-blue-50 flex flex-col items-center">
              {blogs.map((blog) => {
                console.log("blog", blog);
                return <BlogWrap key={blog.id} account={account} blog={blog} />;
              })}
            </div>
          ) : (
            <div className="h-96 py-12 bg-blue-50 font-semibold">
              <div className="pb-12 pl-4 text-sm">
                <div className="flex">
                  <ExclamationIcon />
                  {userInfo.uid === router.query.userId ? (
                    <p className="pl-1">
                      右下の投稿ボタンから
                      <br />
                      ブログを書いて投稿しよう！
                    </p>
                  ) : (
                    <p className="pl-1">まだ投稿がありません。</p>
                  )}
                </div>
              </div>

              <Image
                src="/img/undraw_wallpost.svg"
                alt="blogImg"
                width={70}
                height={25}
                loading="eager"
                priority
                layout="responsive"
              />
            </div>
          )}

          {/* =================== */}
          {/* 試し！！！ */}
          <div className="p-4 bg-pink-300">
            <Link href={`/${userInfo.uid}/blog/tameshi`}>
              <a>
                <div>試しページ1</div>
              </a>
            </Link>
          </div>
          {/* =================== */}

          {/* 👇 自分のアカウントページだったら以下表示させる */}
          {userInfo.uid === router.query.userId && (
            <Link href={`/${userInfo.uid}/blog/post`}>
              <a>
                <ButtonAddBlog />
              </a>
            </Link>
          )}
        </>
      ) : (
        // スケルトンローディングを表示
        <div className="pt-6 pb-8 px-5">
          <div className="animate-pulse space-y-4">
            <div className="h-28 w-28 rounded-full bg-gray-200"></div>
            <div className="space-y-4">
              <div className="w-2/5 h-6 bg-gray-200 rounded"></div>
              <div className="w-10/12 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserBlogPage;
