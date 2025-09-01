<<<<<<< HEAD
import { onStartup } from "../lib/executionEnvironment";
=======
import { commentPermalinkStyleSetting } from "@/lib/publicSettings";
>>>>>>> base/master

/**
 * When refreshing the page, tell the browser to remember the scroll position.
 * Otherwise, users get scrolled to the top of the page.
 * (See https://github.com/Lesswrong2/Lesswrong2/issues/295#issuecomment-385866050)
 */
<<<<<<< HEAD
// (See https://github.com/Lesswrong2/Lesswrong2/issues/295#issuecomment-385866050)
function rememberScrollPositionOnPageReload() {
  window.addEventListener("beforeunload", () => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "auto";
=======
export function rememberScrollPositionOnPageReload() {
  window.addEventListener("beforeunload", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const commentId = urlParams.get("commentId");

    if ("scrollRestoration" in window.history) {
      const hasInContextComments = commentPermalinkStyleSetting.get() === 'in-context'
      try {
        window.history.scrollRestoration = commentId && hasInContextComments ? "manual" : "auto";
>>>>>>> base/master
      } catch (e) {
        //eslint-disable-next-line no-console
        console.error(e);
      }
    }
  });
}
