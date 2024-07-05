import { Client } from "@elastic/elasticsearch";
import type { SearchHit, SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import ElasticQuery, { QueryData } from "./ElasticQuery";
import { elasticPasswordSetting, elasticUsernameSetting, isElasticEnabled } from "./elasticSettings";

export type ElasticDocument = Exclude<SearchDocument, "_id">;
export type ElasticSearchHit = SearchHit<ElasticDocument>;
export type ElasticSearchResponse = SearchResponse<ElasticDocument>;

let globalClient: Client | null = null;

class ElasticClient {
  private client: Client;

  constructor() {
    if (!isElasticEnabled) {
      throw new Error("Elasticsearch is not enabled");
    }

    const host = process.env.ELASTIC_URL;
    const username = elasticUsernameSetting.get();
    const password = elasticPasswordSetting.get();

    const caFingerprint = process.env.ELASTIC_CERT_FINGERPRINT;

    if (!host || !username || !password) {
      // eslint-disable-next-line no-console
      console.warn("Elastic is enabled, but credentials are missing");
      return;
    }

    if (!globalClient) {
      globalClient = new Client({
        node: host,
        requestTimeout: 600000,
        auth: {
          username,
          password,
        },
        tls: {
          rejectUnauthorized: false,
        },
        ...(caFingerprint && { caFingerprint }),
      });
      if (!globalClient) {
        throw new Error("Failed to connect to Elasticsearch");
      }
    }

    this.client = globalClient;
  }

  getClient() {
    return this.client;
  }

  search(queryData: QueryData): Promise<ElasticSearchResponse> {
    const query = new ElasticQuery(queryData);

    const request = query.compile();
    return this.client.search(request);
  }
}

export default ElasticClient;
