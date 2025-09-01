import { PublicInstanceSetting } from "../../../lib/instanceSettings";

export const elasticCloudIdSetting = new PublicInstanceSetting<string | null>(
  "elasticsearch.cloudId",
  null,
  "optional",
);

export const elasticUsernameSetting = new PublicInstanceSetting<string | null>(
  "elasticsearch.username",
  process.env.ELASTIC_USER ?? null,
  "optional",
);

export const elasticPasswordSetting = new PublicInstanceSetting<string | null>(
  "elasticsearch.password",
  process.env.ELASTIC_PASSWORD ?? null,
  "optional",
);

export const searchOriginDate = new PublicInstanceSetting<string>(
  "searchOriginDate",
  "2014-06-01T01:00:00Z",
  "optional",
);
<<<<<<< HEAD

const disableElastic = new PublicInstanceSetting<boolean>(
  "disableElastic",
  ["true", "1"].includes(process.env.ELASTIC_DISABLE ?? "false"),
  "optional",
);

export const isElasticEnabled = !isAnyTest && !disableElastic.get();
=======
>>>>>>> base/master
