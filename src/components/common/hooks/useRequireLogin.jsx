import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCurrentUser } from "src/components/common/hooks/useCurrentUser";

export const useRequireLogin = () => {
  const { authChecking, userInfo } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    console.log("ログインチェック");

    if (authChecking) return; // 確認中
    if (!userInfo) router.push("/"); // 未ログインのためリダイレクト
  }, [authChecking, router, userInfo]);
};
