import { toEmbeddableJson } from "@/lib/utils/jsonUtils";
import { DatabaseServerSetting } from "../databaseSettings";

export const healthCheckUserAgentSetting = new DatabaseServerSetting<string>(
  "healthCheckUserAgent",
  "ELB-HealthChecker/2.0",
);

<<<<<<< HEAD:packages/lesswrong/server/vulcan-lib/apollo-ssr/renderUtil.ts
export const embedAsGlobalVar = (name: keyof Window, value: unknown): string => {
  if (!value) return "";
  return `<script>window.${name} = ${toEmbeddableJson(value)}</script>`;
};
=======
export const embedAsGlobalVar = (name: keyof Window, value: unknown): string =>
  `<script>window.${String(name)} = ${toEmbeddableJson(value)}</script>`;
>>>>>>> base/master:packages/lesswrong/server/rendering/renderUtil.ts
