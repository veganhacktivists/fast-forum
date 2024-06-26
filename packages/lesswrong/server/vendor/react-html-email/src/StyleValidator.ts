import supportMatrix from "./supportMatrix.json";

const capsRe = /[A-Z]/g;

export default class StyleValidator {
  config: any;

  constructor(config?: any) {
    this.setConfig(config);
  }

  setConfig(config?: any) {
    this.config = {
      strict: true,
      warn: true,
      platforms: [
        "gmail",
        "gmail-android",
        "apple-mail",
        "apple-ios",
        "yahoo-mail",
        "outlook",
        "outlook-legacy",
        "outlook-web",
      ],
      ...config,
    };
  }

  validate(style: any, componentName: any) {
    // eslint-disable-next-line no-restricted-syntax
    for (const propNameCamelCase of Object.keys(style)) {
      const propName = propNameCamelCase.replace(capsRe, (match) => `-${match[0].toLowerCase()}`);

      const supportInfo = (supportMatrix as any)[propName];

      if (!supportInfo) {
        if (this.config.strict) {
          return new Error(`Unknown style property \`${propName}\` supplied to \`${componentName}\`.`);
        }
      } else {
        const unsupported: Array<string> = [];
        const messages = new Map();
        this.config.platforms.forEach((platform: string) => {
          if (typeof supportInfo[platform] === "string") {
            const msg = supportInfo[platform];
            if (!messages.has(msg)) {
              messages.set(msg, []);
            }
            messages.get(msg).push(platform);
          } else if (supportInfo[platform] === false) {
            unsupported.push(platform);
          }
        });

        if (this.config.warn) {
          // eslint-disable-next-line no-restricted-syntax
          for (const [msg, platforms] of messages) {
            console.warn(
              `Warning: Style property \`${propName}\` supplied to \`${componentName}\`, in ${platforms.join(", ")}: ${msg.toLowerCase()}`,
            ); // eslint-disable-line no-console
          }
        }

        if (unsupported.length && this.config.strict) {
          return new Error(
            `Style property \`${propName}\` supplied to \`${componentName}\` unsupported in: ${unsupported.join(", ")}.`,
          );
        }
      }
    }
    return undefined;
  }
}
