import { useState } from "react";
import { useRouter } from "next/router";
import firebase, { db, storage } from "src/utils/firebase/firebase";
import { Layout } from "src/components/layouts/Layout";
import loadImage from "blueimp-load-image";
import { useCurrentUser } from "src/hooks/auth/useCurrentUser";
// import dynamic from "next/dynamic";
// import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
// import { EditorState, convertToRaw } from "draft-js";
// import { convertToHTML } from "draft-convert";
// import DOMPurify from "dompurify";
// import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast from "react-hot-toast";

const Post = () => {
  const { userInfo } = useCurrentUser();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDetail, setBlogDetail] = useState("");
  const [headingImage, setHeadingImage] = useState("");
  const router = useRouter();
  // const [convertedContent, setConvertedContent] = useState("");
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );
  // useRequireLogin();

  const onChangeBlogTitle = (e) => setBlogTitle(e.target.value);

  const onChangeBlogDetail = (e) => setBlogDetail(e.target.value);

  // const onEditorStateChange = (state) => {
  //   setEditorState(state);
  //   convertContentToHTML();
  // };

  // const convertContentToHTML = () => {
  //   let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
  //   setConvertedContent(currentContentAsHTML);
  // };

  // const createMarkup = (html) => {
  //   return {
  //     __html: DOMPurify.sanitize(html),
  //   };
  // };

  // π δ»εΊ¦γͺγ΅γ€γΊγγη»εγγ’γγγ­γΌγγ§γγγγγ«ε€γγ
  // const firebaseUpload = (file) => {
  //   return new Promise((resolve, reject) => {
  //     if (!file) {
  //       reject("Invalid file");
  //     }
  //     const uploadTask = storage
  //       .ref(`/${userInfo?.uid}/${file.name}`)
  //       .put(file);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapShot) => {
  //         console.log(snapShot);
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //       (complete) => {
  //         console.log("complete", complete);
  //         storage.getDownloadURL().then((url) => {
  //           resolve(url);
  //         });
  //       }
  //     );
  //   });
  // };

  // const uploadCallback = (file) => {
  //   return new Promise((resolve, reject) => {
  //     firebaseUpload(file)
  //       .then((link) => {
  //         resolve({ data: { link } });
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // };

  // const sitagaki = () => {
  //   console.log("δΈζΈγγ―γͺγγ―οΌ");
  // };

  const onSubmit = (e) => {
    onSetHeadingImagSubmit(e);
  };

  // =============================
  // θ¦εΊγη»ε
  const handleChangeHeadingImage = (e) => {
    const image = e.target.files[0];
    setHeadingImage(image);
  };

  const onSetHeadingImagSubmit = async (e) => {
    e.preventDefault();
    if (headingImage === "") {
      toast.error("η»εγιΈζγγγ¦γγΎγγγ");
      return;
    }

    const canvas = await loadImage(headingImage, {
      maxWidth: 400,
      canvas: true,
    });

    await canvas.image.toBlob(async (blob) => {
      // γ’γγγ­γΌγε¦η
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
          console.log("γ¨γ©γΌγ γοΌ", error);
          toast.error("γ¨γ©γΌγηΊηγγΎγγγζιγγγγ¦γγθ©¦γγ¦γγ γγγ");
        },
        () => {
          storage
            .ref(`/blog/${userInfo?.uid}/${headingImage.name}`)
            .getDownloadURL()
            .then(async (url) => {
              // const convert = convertToRaw(editorState.getCurrentContent());

              const blogContents = {
                uid: userInfo.uid,
                blogTitle: blogTitle,
                headingImage: url,
                // html: convert,
                html: blogDetail,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              };

              const docRef = db.collection("blogs").doc();
              await docRef.set(blogContents);
            });
        }
      );
    }, headingImage.type);

    router.push(`/${userInfo.uid}/blog`);
    toast.success("γγ­γ°γζη¨ΏγγΎγγγεζ γΎγ§γ«ε°γζιγζγγγΎγγ");
  };

  // =============================
  // SSRγ?ει‘γειΏγγγγγ«γγ³γ³γγΌγγ³γγ?εηγ­γΌγγεΏθ¦
  // SSR window is not defined #893
  // γεη§γhttps://github.com/jpuri/react-draft-wysiwyg/issues/893
  // const Editor = dynamic(
  //   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  //   { ssr: false }
  // );
  // =============================

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 bg-blue-50">
        <div className="mx-auto max-w-screen-sm">
          {/* δ»₯δΈinputγ―react-formη­γ«ε€γγ */}
          <input
            type="text"
            value={blogTitle}
            onChange={onChangeBlogTitle}
            placeholder="γΏγ€γγ«"
            className="w-full h-8 mt-6 mb-8 py-5 px-2 border shadow-md"
          />

          {/* ======================== */}
          {/* θ¦εΊγη»ε */}
          <div className="mb-8">
            <label className="text-sm text-gray-500 border-b border-gray-500 cursor-pointer">
              θ¦εΊγη»εγιΈζγγ
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
          {/* <Editor
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
                // "embedded", // εγθΎΌγΏγͺγ³γ―(ζιγγγγ°ε?θ£γγ)
              ],
              inline: {
                options: ["bold", "italic", "underline"],
              },
              image: {
                uploadCallback: uploadCallback,
                previewImage: true,
              },
            }}
          /> */}
          {/* <div
          className="bg-pink-100"
          dangerouslySetInnerHTML={createMarkup(convertedContent)}
        ></div> */}
          <textarea
            type="text"
            value={blogDetail}
            onChange={onChangeBlogDetail}
            placeholder="ζ¬ζε₯ε"
            className="w-full h-80 mt-4 mb-8 py-5 px-2 border shadow-md"
          />
          {/* ======================== */}

          <div className="my-6 mr-2 text-right flex justify-end">
            {/* <button
              type="submit"
              onClick={sitagaki}
              className="mr-2 px-7 py-2.5 bg-blue-500 text-white text-sm tracking-widest rounded-full hover:opacity-90 focus:outline-none"
            >
              δΈζΈγ
            </button> */}

            <form onSubmit={onSubmit}>
              <button
                type="submit"
                onClick={onSubmit}
                className="px-7 py-2.5 bg-blue-500 text-white text-sm tracking-widest rounded-full hover:opacity-90 focus:outline-none"
              >
                ιδΏ‘
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
