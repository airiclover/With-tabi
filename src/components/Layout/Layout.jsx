import { Header } from "src/components/common/Header";

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="text-gray-800">{children}</div>
    </>
  );
};
