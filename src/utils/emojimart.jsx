import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

export const EmojiMart = (props) => {
  console.log("絵文字マート", props);
  const { setEmoji, setIsOpenEmoji } = props;

  return (
    <Picker
      set="apple"
      onSelect={(emoji) => {
        setEmoji(emoji.id);
        setIsOpenEmoji((isOpenEmoji) => !isOpenEmoji);
      }}
      i18n={{
        search: "検索",
        categories: {
          search: "検索結果",
          recent: "よく使う絵文字",
          people: "顔 & 人",
          nature: "動物 & 自然",
          foods: "食べ物 & 飲み物",
          activity: "アクティビティ",
          places: "旅行 & 場所",
          objects: "オブジェクト",
          symbols: "記号",
          flags: "旗",
        },
      }}
      style={{
        position: "absolute",
        left: "0",
        width: "100%",
      }}
    />
  );
};
