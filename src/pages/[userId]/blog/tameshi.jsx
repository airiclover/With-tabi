import Link from "next/link";

const Tameshi = () => {
  // ===================
  // 試し！！！
  const Twitter = "pTzq0OXgxEeJgAgigvyTgUm2JK13";
  const Google = "o0A3D1vFr1VC22VaQlWT4JuON4K2";
  // ===================

  return (
    <div>
      {/* 試し！！！ */}
      <div className="p-4 bg-pink-300">
        <Link href="/[userId]/blog" as={`/${Twitter}/blog`}>
          {/* <Link href="/[userId]" as={`/${userInfo.uid}`}> */}
          <a>
            <div className="my-2 py-2 bg-pink-100">試しページ1</div>
          </a>
        </Link>

        <Link href="/[userId]/blog" as={`/${Google}/blog`}>
          {/* <Link href="/[userId]" as={`/${userInfo.uid}`}> */}
          <a>
            <div className="my-2 py-2 bg-pink-100">試しページ2</div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Tameshi;
