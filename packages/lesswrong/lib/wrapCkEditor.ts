export const getCkEditor = () => {
  if (bundleIsServer) {
    return {};
  }
  const ckEditor = require("../../../public/lesswrong-editor/build/ckeditor");

  const { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration } = ckEditor;
  return { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration };
};

export const ckEditorBundleVersion = "31.0.15";
