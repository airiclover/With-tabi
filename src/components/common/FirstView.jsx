import Image from "next/image";

export const FirstView = () => {
  return (
    <div className="px-4">
      <div className="pt-12 pb-14 text-2xl font-semibold tracking-wider">
        旅をもっと楽しく快適に
      </div>
      <div className="h-56 flex justify-around">
        <div className="w-5/12 pr-2 text-sm font-semibold leading-7">
          <p>思いたったこの瞬間からもう旅は始まっている。</p>
          <p>旅のしおりとしてあなたの旅にお供します。</p>
        </div>
        <Image
          src="/img/undraw-travel.svg"
          alt="firstViewImg"
          width={180}
          height={130}
          loading="eager"
          priority
        />
      </div>
      <div className="py-8 text-lg font-extrabold tracking-widest">
        Let’s make a trip!
      </div>
    </div>
  );
};
