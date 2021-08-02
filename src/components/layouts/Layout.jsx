import { Header } from "src/components/common/Header";

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="text-gray-800">{children}</div>
    </>
  );
};
