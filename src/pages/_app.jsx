import "tailwindcss/tailwind.css";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <Toaster />
    </RecoilRoot>
  );
};

export default App;
