import { Client } from "@elastic/elasticsearch";
import type {
  AggregationsTopHitsAggregate,
  SearchHit,
  SearchResponse,
  SearchTotalHits,
} from "@elastic/elasticsearch/lib/api/types";
import ElasticQuery, { QueryData } from "./ElasticQuery";
<<<<<<< HEAD
import { elasticPasswordSetting, elasticUsernameSetting, isElasticEnabled } from "./elasticSettings";
=======
import ElasticMultiQuery, { MultiQueryData } from "./ElasticMultiQuery";
import sortBy from "lodash/sortBy";
import { elasticCloudIdSetting, elasticPasswordSetting, elasticUsernameSetting } from "./elasticSettings";
import { isElasticEnabled } from "../../../lib/instanceSettings";
import take from "lodash/take";
>>>>>>> base/master

export type ElasticDocument = Exclude<SearchDocument, "_id">;
export type ElasticSearchHit = SearchHit<ElasticDocument>;
export type ElasticSearchResponse = SearchResponse<ElasticDocument>;

export type HitsOnlySearchResponse = {
  hits: {
    total?: number|SearchTotalHits
    hits: ElasticSearchHit[]
  }
};

const DEBUG_LOG_ELASTIC_QUERIES = false;

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

  search(queryData: QueryData): Promise<HitsOnlySearchResponse> {
    const query = new ElasticQuery(queryData);

    const request = query.compile();
    if (DEBUG_LOG_ELASTIC_QUERIES) {
      // eslint-disable-next-line no-console
      console.log("Elastic query:", JSON.stringify(request, null, 2));
    }
    return this.client.search(request);
  }

  async multiSearch(queryData: MultiQueryData): Promise<HitsOnlySearchResponse> {
    // Perform the same search against each index
    const resultsBySearchIndex = await Promise.all(
      queryData.indexes.map((searchIndex) =>
        this.client.search(new ElasticQuery({
          index: searchIndex,
          filters: [],
          limit: queryData.limit,
          search: queryData.search,
        }).compile())
      )
    )
    
    // Merge the result set, sorting the merged list by similarity score (even
    // though similarity score calculation methods may differ between indexes)
    // and applying the limit.
    const mergedResultsList = resultsBySearchIndex.flatMap(r => r.hits.hits);
    const sortedResults = take(sortBy(mergedResultsList, h => -(h._score ?? 0)), queryData.limit);

    return {
      hits: {
        total: mergedResultsList.length,
        hits: sortedResults as ElasticSearchHit[],
      },
    };
  }
}

export default ElasticClient;
