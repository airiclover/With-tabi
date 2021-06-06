import Image from "next/image";

const FirstView = () => {
  return (
    <div>
      <div className="px-4">
        <h1 className="pt-12 pb-14 text-2xl font-semibold tracking-wider">
          旅を自由にプランしよう
        </h1>
        <div className="h-56 flex justify-around">
          <div className="w-5/12 pr-2 text-sm font-semibold leading-7">
            <p>思いたったこの瞬間からもう旅は始まっている。</p>
            <p>旅のしおりとしてあなたの旅にお供します。</p>
          </div>
          <Image
            src="/img/undraw-travel.svg"
            alt="firstViewImg"
            width={190}
            height={140}
            loading="eager"
            priority
          />
        </div>
        <div className="py-8 text-lg font-extrabold tracking-wider">
          Let’s make a trip!
        </div>
      </div>
    </div>
  );
};

export default FirstView;
