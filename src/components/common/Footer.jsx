import Link from "next/link";
import Image from "next/image";

const LINKSLEFT = [
  {
    href: "/",
    title: "使いかた",
  },
  {
    href: "/",
    title: "よくある質問",
  },
  {
    href: "/",
    title: "with tabiとは",
  },
];

const LINKSRIGHT = [
  {
    href: "/",
    title: "利用規約",
  },
  {
    href: "/",
    title: "プライバシーポリシー",
  },
  {
    href: "/",
    title: "お問い合わせ",
  },
];

export const Footer = () => {
  return (
    <div>
      <div className="md:hidden">
        <Image
          src="/img/plainline.png"
          alt="plainImg"
          width={140}
          height={60}
          layout="responsive"
        />
      </div>

      <div className="mx-auto max-w-screen-md py-10 px-4 lg:py-16">
        <Image src="/img/logo.png" alt="logoImg" width={120} height={28} />

        <div className="pt-6 flex justify-around text-sm">
          <div>
            {LINKSLEFT.map((linkleft) => {
              return (
                <Link key={linkleft.href} href={linkleft.href}>
                  <a className="py-1 block">{linkleft.title}</a>
                </Link>
              );
            })}
          </div>

          <div>
            {LINKSRIGHT.map((linkright) => {
              return (
                <Link key={linkright.title} href={linkright.href}>
                  <a className="py-1 block">{linkright.title}</a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="py-1.5 bg-gray-200 text-center text-xs font-semibold tracking-wider">
        ©︎2021 with tabi
      </footer>
    </div>
  );
};
