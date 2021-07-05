import { Header } from "src/components/common/Header";

export const PlanLayout = (props) => {
  const { children } = props;

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="min-h-screen pb-10 px-3 bg-gray-100 text-gray-800">
        {children}
      </div>
    </>
  );
};
