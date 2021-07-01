import { Layout } from "src/components/Layout/Layout";
import { FirstView } from "src/components/common/FirstView";
import { About } from "src/components/common/About";
import { Features } from "src/components/common/Features";
import { CommonBlog } from "src/components/common/CommonBlog";
import { Footer } from "src/components/common/Footer";

const IndexPage = () => {
  return (
    <Layout>
      <FirstView />
      <About />
      <Features />
      <CommonBlog />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
