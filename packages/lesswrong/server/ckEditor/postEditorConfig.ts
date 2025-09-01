import { getAbsoluteUrl, isMigrations } from "../../lib/executionEnvironment";

export const getPostEditorConfig = () => {
  if (isMigrations) {
    return {};
  } else {
<<<<<<< HEAD
    const { postEditorConfig } = require("../../../../public/lesswrong-editor/src/editorConfigs");
    return {
      ...postEditorConfig,
      simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: `${getAbsoluteUrl()}/api/upload`,

        // Enable the XMLHttpRequest.withCredentials property.
        withCredentials: true,

        // Headers sent along with the XMLHttpRequest to the upload server.
        // headers: {
        //   "X-CSRF-TOKEN": "CSRF-Token",
        //   Authorization: "Bearer <JSON Web Token>",
        // },
      },
    };
=======
    const {postEditorConfig} = require('../../../../ckEditor/src/editorConfigs');
    return postEditorConfig;
>>>>>>> base/master
  }
};
