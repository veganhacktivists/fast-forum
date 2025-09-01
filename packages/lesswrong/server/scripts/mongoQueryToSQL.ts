import CreateIndexQuery from "@/server/sql/CreateIndexQuery";
import InsertQuery from "@/server/sql/InsertQuery";
import SelectQuery from "@/server/sql/SelectQuery";
import Table from "@/server/sql/Table";
import UpdateQuery from "@/server/sql/UpdateQuery";
import { getCollection } from "../collections/allCollections";
import TableIndex from "../sql/TableIndex";
import { getSqlClientOrThrow } from "../sql/sqlClient";

/**
 * Translates a mongo find query to SQL for debugging purposes.  Requires a server running because the query builder uses collections, etc.
 * Exported to allow running manually with "yarn repl"
 */
<<<<<<< HEAD
Globals.findToSQL = ({
  tableName,
  selector,
  options,
}: {
  tableName: CollectionNameString;
  selector: AnyBecauseTodo;
  options?: MongoFindOptions<DbObject>;
}) => {
=======
export const findToSQL = ({ tableName, selector, options }: { tableName: CollectionNameString, selector: AnyBecauseTodo, options?: MongoFindOptions<DbObject> }) => {
>>>>>>> base/master
  const table = Table.fromCollection(getCollection(tableName));
  const select = new SelectQuery<DbObject>(table, selector, options);
  const { sql, args } = select.compile();
  // eslint-disable-next-line no-console
  console.log({ sql, args });
  return { sql, args };
};

/**
 * Translates a mongo insert query to SQL for debugging purposes.  Requires a server running because the query builder uses collections, etc.
 * Exported to allow running manually with "yarn repl"
 */
<<<<<<< HEAD
Globals.insertToSQL = ({
  tableName,
  data,
  options,
}: {
  tableName: CollectionNameString;
  data: DbObject;
  options?: MongoFindOptions<DbObject>;
}) => {
=======
export const insertToSQL = <N extends CollectionNameString>({ tableName, data, options }: { tableName: N, data: ObjectsByCollectionName[N], options?: MongoFindOptions<ObjectsByCollectionName[N]> }) => {
>>>>>>> base/master
  const table = Table.fromCollection(getCollection(tableName));
  const insert = new InsertQuery<ObjectsByCollectionName[N]>(table, data, options, {returnInserted: true});
  const { sql, args } = insert.compile();
  // eslint-disable-next-line no-console
  console.log({ sql, args });

  return { sql, args };
};

<<<<<<< HEAD
Globals.rawUpdateOneToSQL = ({
  tableName,
  selector,
  modifier,
}: {
  tableName: CollectionNameString;
  selector: AnyBecauseTodo;
  modifier: MongoModifier<DbObject>;
}) => {
=======
export const rawUpdateOneToSQL = ({ tableName, selector, modifier }: { tableName: CollectionNameString, selector: AnyBecauseTodo, modifier: MongoModifier }) => {
>>>>>>> base/master
  const table = Table.fromCollection(getCollection(tableName));
  const select = new UpdateQuery<DbObject>(table, selector, modifier);
  const { sql, args } = select.compile();
  // eslint-disable-next-line no-console
  console.log({ sql, args });
  return { sql, args };
};

<<<<<<< HEAD
Globals.ensureIndexToSQL = ({
  tableName,
  indexSpec,
  options,
}: {
  tableName: CollectionNameString;
  indexSpec: any;
  options?: any;
}) => {
=======
export const ensureIndexToSQL = ({ tableName, indexSpec, options }: { tableName: CollectionNameString, indexSpec: any, options?: any }) => {
>>>>>>> base/master
  const table = Table.fromCollection(getCollection(tableName));
  const tableIndex = new TableIndex(tableName, indexSpec, options);
  const query = new CreateIndexQuery({ table, index: tableIndex, ifNotExists: true });
  const { sql, args } = query.compile();

  // eslint-disable-next-line no-console
<<<<<<< HEAD
  console.log("query", { indexName: index.getName(), sql, args });
=======
  console.log('query', { indexName: tableIndex.getName(), sql, args });
};

export const runFindToSQL = async <N extends CollectionNameString>({ tableName, selector, options }: { tableName: N, selector: AnyBecauseTodo, options?: MongoFindOptions<ObjectsByCollectionName[N]> }) => {
  const db = getSqlClientOrThrow();

  const { sql, args } = findToSQL({ tableName, selector, options });
  const result = await db.query(sql, args);
  return result;
};

export const runInsertToSQL = async <N extends CollectionNameString>({ tableName, data, options }: { tableName: N, data: ObjectsByCollectionName[N], options?: MongoFindOptions<ObjectsByCollectionName[N]> }) => {
  const db = getSqlClientOrThrow();

  const { sql, args } = insertToSQL({ tableName, data, options });
  const result = await db.query(sql, args);
  return result;
};

export const runUpdateOneToSQL = async <N extends CollectionNameString>({ tableName, selector, modifier }: { tableName: N, selector: AnyBecauseTodo, modifier: MongoModifier }) => {
  const db = getSqlClientOrThrow();

  const { sql, args } = rawUpdateOneToSQL({ tableName, selector, modifier });
  const result = await db.query(sql, args);
  return result;
>>>>>>> base/master
};
