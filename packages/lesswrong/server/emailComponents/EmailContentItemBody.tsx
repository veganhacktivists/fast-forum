<<<<<<< HEAD
import React from "react";
import { registerComponent } from "../../lib/vulcan-lib";
=======
import React from 'react';
>>>>>>> base/master

// The body of a content-item (post, comment etc), starting from HTML and
// rendered with whatever enhancements we can apply to emails. (In a browser,
// this would include things like link hover-preview. In a email, we can't do
// that, so this doesn't currently have any enhancements, but it might in the
// future.)
<<<<<<< HEAD
const EmailContentItemBody = ({
  className,
  dangerouslySetInnerHTML,
}: {
  className?: string;
  dangerouslySetInnerHTML: any;
}) => {
  return <div className={className} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
};

const EmailContentItemBodyComponent = registerComponent("EmailContentItemBody", EmailContentItemBody);

declare global {
  interface ComponentTypes {
    EmailContentItemBody: typeof EmailContentItemBodyComponent;
  }
=======
export const EmailContentItemBody = ({className, dangerouslySetInnerHTML}: {
  className?: string,
  dangerouslySetInnerHTML: any
}) => {
  return <div className={className} dangerouslySetInnerHTML={dangerouslySetInnerHTML}/>
>>>>>>> base/master
}
