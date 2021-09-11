import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import firebase, { db, storage } from "src/utils/firebase/firebase";
import { EditorState, convertToRaw } from "draft-js";
import loadImage from "blueimp-load-image";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
import { Layout } from "src/components/layouts/Layout";
import { convertToHTML } from "draft-convert";
// import DOMPurify from "dompurify";
// import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast from "react-hot-toast";

const Post = () => {
  const { userInfo } = useCurrentUser();
  const [blogTitle, setBlogTitle] = useState("");
  const [headingImage, setHeadingImage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [convertedContent, setConvertedContent] = useState("");
  const router = useRouter();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  useRequireLogin();

  const onChangeBlogTitle = (e) => setBlogTitle(e.target.value);

  const onEditorStateChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };

  // const createMarkup = (html) => {
  //   return {
  //     __html: DOMPurify.sanitize(html),
  //   };
  // };

  // 👇 今度リサイズした画像をアップロードできるように変える

  const firebaseUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("Invalid file");
      }
      const uploadTask = storage
        .ref(`/${userInfo?.uid}/${file.name}`)
        .put(file);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (error) => {
          console.log(error);
        },
        (complete) => {
          console.log("complete", complete);
          storage.getDownloadURL().then((url) => {
            resolve(url);
          });
        }
      );
    });
  };

  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      firebaseUpload(file)
        .then((link) => {
          resolve({ data: { link } });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const sitagaki = () => {
    // setConverted(con);
    console.log("下書きクリック！");
  };

  const onSubmit = async (e) => {
    await onSetHeadingImagSubmit(e);

    await router.push(`/${userInfo.uid}/blog`);
    toast.success("ブログを投稿しました。");
  };

  // =============================
  // 見出し画像
  const handleChangeHeadingImage = (e) => {
    const image = e.target.files[0];
    setHeadingImage(image);
  };

  const onSetHeadingImagSubmit = async (e) => {
    e.preventDefault();
    if (headingImage === "") {
      // toast.error("画像が選択させていません。");
      return;
    }

    const canvas = await loadImage(headingImage, {
      maxWidth: 400,
      canvas: true,
    });

    await canvas.image.toBlob(async (blob) => {
      // アップロード処理
      const uploadTask = storage
        .ref(`/blog/${userInfo?.uid}/${headingImage.name}`)
        .put(blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("snapshot", snapshot);
        },
        (error) => {
          setHeadingImage("");
          console.log("エラーだよ！", error);
          toast.error("エラーが発生しました。時間をおいてから試してください。");
        },
        () => {
          storage
            .ref(`/blog/${userInfo?.uid}/${headingImage.name}`)
            .getDownloadURL()
            .then(async (url) => {
              const convert = convertToRaw(editorState.getCurrentContent());

              const blogContents = {
                uid: userInfo.uid,
                blogTitle: blogTitle,
                headingImage: url,
                html: convert,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              };

              const docRef = db.collection("blogs").doc();
              await docRef.set(blogContents);
            });
        }
      );
    }, headingImage.type);
  };

  // =============================
  // SSRの問題を回避するために、コンポーネントの動的ロードが必要
  // SSR window is not defined #893
  // 【参照】https://github.com/jpuri/react-draft-wysiwyg/issues/893
  const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
  );
  // =============================

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 bg-blue-50">
        {/* 以下inputはreact-form等に変える */}
        <input
          type="text"
          value={blogTitle}
          onChange={onChangeBlogTitle}
          placeholder="タイトル"
          className="w-full h-8 mt-6 mb-8 py-5 px-2 border shadow-md"
        />

        {/* ======================== */}
        {/* 見出し画像 */}
        <div className="mb-8">
          <label className="text-sm text-gray-500 border-b border-gray-500 cursor-pointer">
            見出し画像を選択する
            <input
              type="file"
              onChange={handleChangeHeadingImage}
              accept="image/*"
              className="hidden"
            />
          </label>

          {headingImage === "" ? (
            <div className="h-44 w-64 mt-1 mx-auto bg-gray-200" />
          ) : (
            <img
              src={URL.createObjectURL(headingImage)}
              alt="uploaded"
              className="h-44 w-64 mx-auto object-cover"
            />
          )}
        </div>
        {/* ======================== */}
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbarClassName="shadow-sm"
          editorClassName="mt-2 mb-12 p-2 bg-white border shadow-md"
          toolbar={{
            options: [
              "blockType",
              "fontSize",
              "inline",
              "colorPicker",
              "image",
              "link",
              // "embedded", // 埋め込みリンク(時間があれば実装する)
            ],
            inline: {
              options: ["bold", "italic", "underline"],
            },
            image: {
              uploadCallback: uploadCallback,
              previewImage: true,
            },
          }}
        />
        {/* <div
          className="bg-pink-100"
          dangerouslySetInnerHTML={createMarkup(convertedContent)}
        ></div> */}
        <div className="my-6 mr-2 text-right flex justify-end">
          <button
            type="submit"
            onClick={sitagaki}
            className="mr-2 px-7 py-2.5 bg-blue-500 text-white text-sm tracking-widest rounded-full hover:opacity-90 focus:outline-none"
          >
            下書き
          </button>

          <form onSubmit={onSubmit}>
            <button
              type="submit"
              onClick={onSubmit}
              className="px-7 py-2.5 bg-blue-500 text-white text-sm tracking-widest rounded-full hover:opacity-90 focus:outline-none"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
