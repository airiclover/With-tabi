import { useRecoilValue } from "recoil";
import { userState } from "src/utils/recoil/userState";

export function useCurrentUser() {
  const userInfo = useRecoilValue(userState); // グローバルからuserInfoを取り出す
  const authChecking = userInfo === undefined; // ログイン情報を取得中かチェック

  return {
    userInfo,
    authChecking,
  };
}
