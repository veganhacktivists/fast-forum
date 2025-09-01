<<<<<<< HEAD
import { SearchIndexCollectionName, searchIndexedCollectionNames } from "../../../lib/search/searchUtil";
import { getCollectionHooks } from "../../mutationCallbacks";
=======
import { isAnyTest } from "@/lib/executionEnvironment";
import { SearchIndexCollectionName } from "../../../lib/search/searchUtil";
>>>>>>> base/master
import ElasticClient from "./ElasticClient";
import ElasticExporter from "./ElasticExporter";
import { isElasticEnabled } from "@/lib/instanceSettings";

<<<<<<< HEAD
export const elasticSyncDocument = (collectionName: SearchIndexCollectionName, documentId: string) => {
=======
export async function elasticSyncDocument(
  collectionName: SearchIndexCollectionName,
  documentId: string,
) {
  if (!isElasticEnabled) {
    return;
  }
>>>>>>> base/master
  try {
    const client = new ElasticClient();
    const exporter = new ElasticExporter(client);
    await exporter.updateDocument(collectionName, documentId);
  } catch (e) {
<<<<<<< HEAD
    // eslint-disable-next-line no-console
    console.error(`[${collectionName}] Failed to index Elasticsearch document:`, e);
  }
};

if (isElasticEnabled) {
  for (const collectionName of searchIndexedCollectionNames) {
    const callback = ({ _id }: DbObject) => elasticSyncDocument(collectionName, _id);
    getCollectionHooks(collectionName).createAfter.add(callback);
    getCollectionHooks(collectionName).updateAfter.add(callback);
=======
    // This is extremely noisy and unhelpful in integration test logs
    if (!isAnyTest) {
      // eslint-disable-next-line no-console
      console.error(`[${collectionName}] Failed to index Elasticsearch document:`, e);
    }
>>>>>>> base/master
  }
}
