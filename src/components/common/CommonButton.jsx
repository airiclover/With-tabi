export const CommonButton = (props) => {
  return (
    <>
      <button
        className={`w-full py-3.5 text-white font-semibold tracking-wider rounded-full ${props.bgColor}`}
      >
        {props.text}
      </button>
    </>
  );
};
