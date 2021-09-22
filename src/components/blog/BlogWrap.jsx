import Link from "next/link";
import Image from "next/image";

export const BlogWrap = (props) => {
  console.log("props", props);

  const updateDate = props?.blog.data.createdAt.toDate();
  const fixUpdateDate = `${updateDate.getFullYear()}年${
    updateDate.getMonth() + 1
  }月${updateDate.getDate()}日`;

  return (
    <div className="flex flex-col mb-8">
      {props?.blog.data.headingImage ? (
        <Link
          href={`/${props?.blog.data.uid}/blog/${props?.blog.id}`}
          prefetch={false}
        >
          <a className="h-52 ">
            <Image
              src={props?.blog.data.headingImage}
              alt="exampleImg"
              width={320}
              height={208}
              objectFit="cover"
              className="rounded-t-lg"
            />
          </a>
        </Link>
      ) : (
        <div className="bg-gray-200 h-52 w-80 animate-pulse" />
      )}

      <div className="h-28 w-80 p-2 bg-white flex flex-col justify-around rounded-b-lg">
        <Link
          href={`/${props?.blog.data.uid}/blog/${props?.blog.id}`}
          prefetch={false}
        >
          <a className="h-full flex flex-col justify-center">
            <div className="text-lg font-semibold leading-snug break-words line-clamp-2">
              {props?.blog.data.blogTitle}
            </div>
            <div className="text-xs text-gray-500">{fixUpdateDate}</div>
          </a>
        </Link>

        <Link href={`/${props?.blog.data.uid}/blog`} prefetch={false}>
          <a className="pt-1 pr-3 flex justify-between">
            <div className="flex items-center">
              <Image
                src={props?.account.icon}
                alt="logoImg"
                width={25}
                height={25}
                objectFit="cover"
                className="rounded-full"
              />
              <div className="pl-1 text-xs">{props?.account.name}</div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};
