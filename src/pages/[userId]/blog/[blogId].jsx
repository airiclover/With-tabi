import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
// import { convertToHTML } from "draft-convert";
import toast from "react-hot-toast";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import Image from "next/image";
import { TwitterIcon } from "src/components/common/assets/TwitterIcon";
import { InstagramIcon } from "src/components/common/assets/InstagramIcon";
import Link from "next/link";

// import { convertToHTML } from "draft-convert";

const BlogID = () => {
  const [blog, setBlog] = useState({});
  const [authorData, setAuthorData] = useState({});
  // const [convertedContent, setConvertedContent] = useState("");
  const router = useRouter();

  // const onEditorStateChange = (state) => {
  //   setEditorState(state);
  //   convertContentToHTML();
  // };

  // const convertContentToHTML = () => {
  //   let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
  //   setConvertedContent(currentContentAsHTML);
  // };

  useEffect(() => {
    getBlogData();
    getAuthorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBlogData = async () => {
    const blogDoc = db.collection("blogs").doc(router.query.blogId);

    await blogDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        if (doc.exists) {
          //blogDocにデータがある場合
          setBlog(docData);
        } else {
          //blogDocにデータがない場合
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

  const getAuthorData = async () => {
    const userDoc = db.collection("users").doc(router.query.userId);
    console.log("userDoc", userDoc);

    await userDoc
      .get()
      .then((doc) => {
        const docData = doc.data();
        if (doc.exists) {
          //userDocにデータがある場合
          setAuthorData(docData);
        } else {
          //userDocにデータがない場合
          console.log("どうするか後で決める");
        }
      })
      .catch((error) => {
        toast.error(
          error,
          ":エラーが発生しました。時間をおいてから試してください。"
        );
      });
  };

  const updateDate = blog?.createdAt?.toDate();
  const fixUpdateDate = `${updateDate?.getFullYear()}年${
    updateDate?.getMonth() + 1
  }月${updateDate?.getDate()}日`;

  return (
    <CommonLayout>
      {blog?.length !== 0 ? (
        <div className="min-h-screen bg-white">
          <div className="mx-6">
            <Image
              src="/img/example.webp"
              alt="exampleImg"
              width={650}
              height={460}
              objectFit="cover"
            />
          </div>

          <div className="mx-6 pb-6">
            <h2 className="text-2xl font-bold pt-3">{blog?.blogTitle}</h2>
            <p className="py-2 text-sm">{fixUpdateDate}</p>
            <div className="py-6">
              {blog?.html?.blocks.map((block) => {
                return <div key={block.key}>{block.text}</div>;
              })}
            </div>
          </div>

          {/* ユーザー情報========== */}
          <div className="mb-6 border">
            <div className="py-6 mx-6">
              <div className="flex items-center">
                {authorData?.icon ? (
                  <Link href={`/${router.query.userId}/blog`} prefetch={false}>
                    <a className="flex-shrink-0">
                      <Image
                        src={authorData?.icon}
                        alt="userIcon"
                        width={60}
                        height={60}
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </a>
                  </Link>
                ) : (
                  <div>loading...</div>
                )}

                <div className="pl-4 flex flex-col">
                  <p className="text-xl font-bold">{authorData?.name}</p>
                  <div className="flex">
                    {authorData?.twitter ? (
                      <a
                        href={`https://twitter.com/${authorData?.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pr-1.5"
                      >
                        <TwitterIcon width="30" height="30" fill="#A1A1AA" />
                      </a>
                    ) : null}

                    {authorData?.instagram ? (
                      <a
                        href={`https://www.instagram.com/${authorData?.instagram}/?hl=ja`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
              <p className="py-2 px-1 text-sm tracking-tight">
                {authorData?.introduce}
              </p>
            </div>
          </div>
          {/* ==================== */}
        </div>
      ) : (
        <div>loading...</div>
      )}
    </CommonLayout>
  );
};

export default BlogID;
