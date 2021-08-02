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
        <div className="pb-20 flex justify-around items-center">
          <Image
            src="/img/phone.webp"
            alt="abputImg"
            width={100}
            height={170}
          />
          <div className="w-7/12">
            <h1 className="pb-8 text-2xl font-semibold">
              旅の予定がひと目でわかる
            </h1>
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
            <h1 className="pb-8 text-2xl font-semibold">
              <p>シンプルで</p>
              <p>わかりやすい操作</p>
            </h1>
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
