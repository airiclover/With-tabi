import Image from "next/image";
import Link from "next/link";

export const Features = () => {
  const FEATURES = [
    {
      src: "undraw_sharing.svg",
      title: "プランをみんなで共有",
      Introduction:
        "ボタンひとつでかんたんに旅プランの共有ができます。仲間と一緒にプランを練ったり予定の認識合わせに最適です。",
    },
    {
      src: "undraw_attached.svg",
      title: "作成したプランを印刷",
      Introduction:
        "万が一のためにプランを印刷しておくと安心です。パソコンから印刷をすることができます。お年寄りや小さなお子様へプランを共有する場合にも便利です。",
    },
    {
      src: "undraw_wallpost.svg",
      title: "ブログで旅の体験を投稿しよう",
      Introduction:
        "ブログを通して旅の記録を残すことができます。みんなのブログを覗いて旅のプランを練ってみよう。また、作成したプランをブログに投稿することもできます。",
    },
  ];

  return (
    <div className="py-20 px-3">
      <div className="pt-8 pb-12 relative">
        <p className="text-yellow-400 text-opacity-30 text-6xl font-black tracking-wider absolute bottom-24 left-1">
          Features
        </p>
        <h1 className="text-2xl font-semibold">
          旅を楽しくする
          <br />
          さまざまな機能たち
        </h1>
      </div>

      {FEATURES.map((feature) => {
        return (
          <div
            key={feature.src}
            className="bg-orange-50 mb-12 mx-4 pt-7 px-7 pb-10 text-center border-4 border-orange-100 rounded-3xl"
          >
            <Image
              src={`/img/${feature.src}`}
              alt="abputImg"
              width={160}
              height={160}
            />
            <h2 className="py-4 text-xl font-semibold">{feature.title}</h2>
            <div className="text-sm text-left leading-6">
              {feature.Introduction}
            </div>
          </div>
        );
      })}

      <div className="pb-6 text-center">
        <Image
          src="/img/maketrip.png"
          alt="catchcopyImg"
          width={230}
          height={38}
          loading="eager"
          priority
        />
      </div>

      <Link href="/signup">
        <a>
          <div className="w-full py-3.5 text-white font-semibold tracking-wider rounded-full text-center bg-yellow-500 hover:bg-hover-yellow">
            今すぐはじめる
          </div>
        </a>
      </Link>
    </div>
  );
};
