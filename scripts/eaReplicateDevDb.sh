#!/usr/bin/env bash
set -euxo pipefail

if [ -z "${PG_URL}" ]; then
	PG_URL=$(cat ../ForumCredentials/dev-staging-admin-pg-conn.txt)
fi

MAIN_DB=eaforum_dev
REPLICA_DB=eaforum_dev_replica

run_sql() {
	psql $PG_URL -c "$1"
}

terminate_connections() {
	run_sql "SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$1' AND pid <> pg_backend_pid()"
}

db_exists() {
	psql $PG_URL -lqt | cut -d \| -f 1 | grep -qw $1
	return $?
}

# Drop the existing replica db
if db_exists $REPLICA_DB; then
	terminate_connections $REPLICA_DB
	run_sql "DROP DATABASE $REPLICA_DB"
fi

# Create new replica using the main dev db as a template
terminate_connections $MAIN_DB
run_sql "CREATE DATABASE $REPLICA_DB TEMPLATE $MAIN_DB"
run_sql "COMMENT ON DATABASE $REPLICA_DB IS 'Dev clone template (generated by pnpm ea-replicate-dev-db)'"
