import ElasticExporter from "../packages/lesswrong/server/search/elastic/ElasticExporter";

const exporter = new ElasticExporter();

void exporter.configureIndexes().then(() => exporter.exportAll());
