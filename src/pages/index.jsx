import { Header } from "src/components/common/Header";
import { FirstView } from "src/components/common/FirstView";
import { About } from "src/components/common/About";
import { Features } from "src/components/common/Features";
import { CommonBlog } from "src/components/common/CommonBlog";

const IndexPage = () => {
  return (
    <>
      <Header />
      <FirstView />
      <About />
      <Features />
      <CommonBlog />
    </>
  );
};

export default IndexPage;
