import Image from "next/image";

export const About = () => {
  return (
    <div className="bg-orange-100">
      <Image
        src="/img/line-round.png"
        alt="lineImg"
        width={300}
        height={60}
        loading="eager"
        priority
        layout="responsive"
      />

      <div className="pt-28 pb-24 px-4">
        <div className="mb-16 relative">
          <p className="text-gray-400 text-opacity-30 text-6xl font-black tracking-wider absolute bottom-4 left-1">
            About
          </p>
          <div className="text-2xl font-bold tracking-wider">
            With tabiとは？
          </div>
        </div>
        <div className="pb-20 flex justify-around items-center">
          <Image
            src="/img/phone.webp"
            alt="abputImg"
            width={100}
            height={170}
          />
          <div className="w-7/12">
            <div className="pb-8 text-xl font-semibold tracking-wide">
              旅の予定がひと目
              <br />
              でわかる
            </div>
            <div>
              <p>
                With
                tabi(ウィズタビ)は旅のプランをかんたんに作成・管理することができるWebツールです。
              </p>
              <br />
              <p>
                旅をこれまでよりスムーズに快適なものへ。さらなる素晴らしい体験を共に。
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center">
          <div className="w-7/12">
            <div className="pb-8 text-xl font-semibold tracking-wide">
              シンプルで
              <br />
              わかりやすい操作
            </div>
            <div>
              <p>プランの追加や編集もかんたん。</p>
              <br />
              <p>時間やタイトルの他にメモ機能や推定金額の入力ができます。</p>
              <p>
                例えばメモ機能に詳細な情報を、推定金額に大まかな金額を書いて旅を管理できます。
              </p>
            </div>
          </div>
          <Image
            src="/img/phone.webp"
            alt="abputImg"
            width={100}
            height={170}
          />
        </div>
      </div>
    </div>
  );
};
