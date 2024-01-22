interface Loader {
  file: unknown;
  uploadTotal: number;
  uploaded: number;
}

class GraphqlUploadAdapter {
  private loader: Loader;

  constructor(loader: Loader) {
    this.loader = loader;
  }

  upload() {}

  abort() {}
}

const GraphqlUploadAdapterPlugin = (editor) => {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: Loader) => new GraphqlUploadAdapter(loader);
};

export const getCkEditor = () => {
  if (bundleIsServer) {
    return {};
  }
  const ckEditor = require("../../../public/lesswrong-editor/build/ckeditor");

  const { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration } = ckEditor;
  // PostEditor.plugins = [...PostEditor.plugins, GraphqlUploadAdapterPlugin];
  // CommentEditor.plugins = [...CommentEditor.plugins, GraphqlUploadAdapterPlugin];
  // PostEditorCollaboration.plugins = [...PostEditorCollaboration.plugins, GraphqlUploadAdapterPlugin];
  //
  // console.log({ PostEditor });

  return { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration };
};

export const ckEditorBundleVersion = "31.0.15";
