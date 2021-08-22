import Image from "next/image";

export const NoPlan = (props) => {
  return (
    <div>
      <div className={`${props.class} pl-4 font-semibold`}>
        <p>右下の登録ボタンから</p>
        <p>旅の詳細プランを作成してみよう！</p>
      </div>
      <Image
        src="/img/undraw_travelplans.svg"
        alt="travelplansImg"
        width={100}
        height={50}
        loading="eager"
        priority
        layout="responsive"
      />
    </div>
  );
};
