import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "src/utils/firebase/firebase";

export const CommonBlog = () => {
  const [blogs, setblogs] = useState([]);

  useEffect(() => {
    getAuthorBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthorBlogs = () => {
    db.collection("blogs")
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

  return (
    <div className="pt-28 pb-14 px-4 bg-blue-50 lg:py-28">
      <div className="max-w-screen-md mx-auto">
        <div className="pb-12 relative">
          <p className="text-blue-400 text-opacity-25 text-6xl font-black tracking-wider absolute bottom-16 left-1">
            Blog
          </p>
          <div className="text-2xl font-semibold">旅の思い出</div>
        </div>

        <div className="pt-2 px-4 pb-8 flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-4">
          {blogs.length !== 0 ? (
            // ブログ表示の試し
            <div className="bg-blue-50 flex flex-col items-center">
              {blogs.map((blog) => {
                console.log(blog);

                const updateDate = blog.data.createdAt.toDate();
                const fixUpdateDate = `${updateDate.getFullYear()}年${
                  updateDate.getMonth() + 1
                }月${updateDate.getDate()}日`;

                return (
                  <div key={blog.id} className="flex flex-col mb-8">
                    <Link
                      href={`/${blog.data.uid}/blog/${blog.id}`}
                      prefetch={false}
                    >
                      <a className="h-52 ">
                        <Image
                          src={blog.data.headingImage}
                          alt="exampleImg"
                          width={320}
                          height={208}
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      </a>
                    </Link>

                    {/* <div className="h-28 w-80 p-2 bg-white flex flex-col justify-around rounded-b-lg"> */}
                    <div className="h-20 w-80 p-2 bg-white flex flex-col justify-around rounded-b-lg">
                      <Link
                        href={`/${blog.data.uid}/blog/${blog.id}`}
                        prefetch={false}
                      >
                        <a className="h-full flex flex-col justify-center">
                          <div className="text-lg font-semibold leading-snug break-words line-clamp-2">
                            {blog.data.blogTitle}
                          </div>
                          <div className="text-xs text-gray-500">
                            {fixUpdateDate}
                          </div>
                        </a>
                      </Link>

                      <Link href={`/${blog.data.uid}/blog`} prefetch={false}>
                        <a className="pt-1 pr-3 flex justify-between">
                          <div className="flex items-center">
                            {/* <Image
                                src={account.icon}
                                alt="logoImg"
                                width={25}
                                height={25}
                                objectFit="cover"
                                className="rounded-full"
                              />
                              <div className="pl-1 text-xs">{account.name}</div> */}
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>loading...</div>
          )}
        </div>

        <Link href="/">
          <a>
            <div className="w-full mx-auto max-w-lg py-3.5 text-white font-semibold tracking-wider rounded-full text-center bg-blue-500 hover:bg-blue-600 ">
              もっとブログをみる
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};
