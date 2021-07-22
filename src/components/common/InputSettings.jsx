export const InputSettings = (props) => {
  return (
    <label className="text-sm">
      {props.title}
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.userName}
        onChange={props.onChangeUserName}
        className="w-full mb-4 p-2.5 text-base bg-gray-100 rounded-lg"
      />
    </label>
  );
};
