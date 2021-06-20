import Link from "next/link";
import Image from "next/image";

const LINKSLEFT = [
  {
    href: "/1",
    title: "使いかた",
  },
  {
    href: "/2",
    title: "よくある質問",
  },
  {
    href: "/3",
    title: "with tabiとは",
  },
  {
    href: "/4",
    title: "お問い合わせ",
  },
];

const LINKSRIGHT = [
  {
    href: "/1",
    title: "利用規約",
  },
  {
    href: "/2",
    title: "プライバシーポリシー",
  },
  {
    href: "/3",
    title: "あああああ",
  },
  {
    href: "/4",
    title: "あああああ",
  },
];

export const Footer = () => {
  return (
    <div>
      <Image
        src="/img/plainline.png"
        alt="plainImg"
        width={140}
        height={60}
        layout="responsive"
        loading="eager"
        priority
      />

      <div className="py-10 px-4">
        <Image
          src="/img/logo.png"
          alt="logoImg"
          width={120}
          height={28}
          loading="eager"
          priority
        />

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
                <Link key={linkright.href} href={linkright.href}>
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
