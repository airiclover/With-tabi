import { Header } from "src/components/common/Header";

export const CommonLayout = (props) => {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 text-gray-800">{children}</div>
    </>
  );
};
