export const acceptsSchemaHash = "afb5555a6e3a18714877036b68c63786";

<<<<<<< HEAD
import { Collections } from "../vulcan-lib";
import { updateDefaultValue, dropDefaultValue } from "./meta/utils";
=======
import { getAllCollections } from "@/server/collections/allCollections";
import { updateDefaultValue, dropDefaultValue } from "./meta/utils"
>>>>>>> base/master

/*
 * NOTE 31-08-2023
 * I've commented out the code for this migration as it should've already be
 * run on all the servers that matter, and it causes errors when trying to
 * bootstrap new instances
 */

<<<<<<< HEAD
export const up = async ({ db }: MigrationContext) => {
  for (const collection of Collections) {
=======
export const up = async ({db}: MigrationContext) => {
  for (const collection of getAllCollections()) {
>>>>>>> base/master
    // await updateDefaultValue(db, collection, "createdAt");
  }
};

<<<<<<< HEAD
export const down = async ({ db }: MigrationContext) => {
  for (const collection of Collections) {
=======
export const down = async ({db}: MigrationContext) => {
  for (const collection of getAllCollections()) {
>>>>>>> base/master
    // await dropDefaultValue(db, collection, "createdAt");
  }
};
