import { Auth } from "src/components/common/Auth";

const SignUp = () => {
  return (
    <Auth
      page="signup"
      textlink="login"
      text="既にアカウントをお持ちの方はこちら→"
    />
  );
};

export default SignUp;
