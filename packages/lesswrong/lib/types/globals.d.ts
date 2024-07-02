declare global {
  var bundleIsServer: boolean;
  var bundleIsTest: boolean;
  var bundleIsProduction: boolean;
  var bundleIsMigrations: boolean;
  var defaultSiteAbsoluteUrl: string;
  var serverPort: number;
  var estrellaPid: number;
}

export {};
