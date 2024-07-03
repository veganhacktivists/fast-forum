import { isServer } from "./executionEnvironment";

export const getCkEditor = () => {
  if (isServer) {
    return {};
  }
  const ckEditor = require("../../../public/lesswrong-editor/build/ckeditor");

  const { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration } = ckEditor;
  return { EditorWatchdog, CommentEditor, PostEditor, PostEditorCollaboration };
};

export const ckEditorBundleVersion = "31.0.15";
