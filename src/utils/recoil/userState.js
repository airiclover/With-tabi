import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    uid: "",
    name: "",
    icon: "",
    twitter: "",
    instagram: "",
    introduce: "",
  },
});
