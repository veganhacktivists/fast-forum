import { isDevelopment } from "../../../lib/executionEnvironment";
// Apollo Server v4 doesn't have built-in playground
type PlaygroundConfig = boolean | { settings?: any };

// GraphQL Playground setup
export const getPlaygroundConfig = (path: string): PlaygroundConfig | undefined => {
  // NOTE: this is redundant, Apollo won't show the GUI if NODE_ENV="production"
  if (!isDevelopment) return undefined;
  return {
    settings: {
      "editor.theme": "light",
      "editor.reuseHeaders": true,
      "request.credentials": "same-origin",
    },
  };
};
export default getPlaygroundConfig;
