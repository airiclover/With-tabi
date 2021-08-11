export const fixDate = () => {
  const fixedDate = (data) => {
    const date = data.replaceAll("-", "/");
    const setDate = new Date(date);
    const arrayWeek = ["日", "月", "火", "水", "木", "金", "土"];
    const week = `(${arrayWeek[setDate.getDay()]})`;

    return date + week;
  };

  return {
    fixedDate,
  };
};
