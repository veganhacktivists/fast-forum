import * as _ from "underscore";

export const isServer = typeof process !== "undefined";
export const isClient = !isServer;

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = !isProduction;

export const isAnyTest = process.env.NODE_ENV === "test";
export const isPackageTest = isAnyTest;

export const isMigrations = isServer ? process.env.IS_MIGRATION === "1" : false;
export const defaultSiteAbsoluteUrl = process.env.ROOT_URL ?? "";

export interface CommandLineArguments {
  postgresUrl: string;
  postgresReadUrl: string;
  settingsFileName: string;
  shellMode: boolean;
  command?: string;
}

let alreadyRunStartupFuntions = false;

type StartupFunction = {
  fn: () => void | Promise<void>;
  order: number;
};
const onStartupFunctions: StartupFunction[] = [];
// Register a function to be executed on startup (after top-level import is
// done). Startup functions have a numeric order attached, and are executed in
// order from lowest to highest. If no order is given, the order is 0. Between
// functions with the same order number, order of execution is undefined.
export const onStartup = (fn: () => void | Promise<void>, order?: number) => {
  if (alreadyRunStartupFuntions) {
    throw new Error("Startup functions have already been run, can no longer register more");
  }
  onStartupFunctions.push({ fn, order: order || 0 });
};

export const runStartupFunctions = async () => {
  alreadyRunStartupFuntions = true;
  for (let startupFunction of _.sortBy(onStartupFunctions, (f) => f.order)) {
    await startupFunction.fn();
  }
};

let instanceSettings: any = null;
export const getInstanceSettings = (args?: CommandLineArguments): any => {
  if (!instanceSettings) {
    if (isServer) {
      // eslint-disable-next-line import/no-restricted-paths
      const { loadInstanceSettings } = require("../server/commandLine.ts");
      instanceSettings = loadInstanceSettings(args);
    } else {
      instanceSettings = {
        public: window.publicInstanceSettings,
      };
    }
  }
  return instanceSettings;
};
export const setInstanceSettings = (settings: any) => {
  instanceSettings = settings;
};

export const getAbsoluteUrl = (): string => {
  if (defaultSiteAbsoluteUrl?.length > 0) {
    return defaultSiteAbsoluteUrl;
  } else {
    return `http://localhost:${getServerPort()}/`;
  }
};

export const addGlobalForShell = (name: string, value: any) => {
  // TODO
};

export const getServerPort = () => parseInt(process.env.PORT || "3000");
export const getWebsocketPort = () => getServerPort() + 1;

// Polyfill
import "setimmediate";
