#!/usr/bin/env bash
# Run unit tests twice: the first time in a clean working directory (so things
# that would be cached are included), then again in the directory left behind
# by the first (so caches are populated).

scripts/clean.sh
mkdir -p tmp
/usr/bin/time -o "tmp/pnpmInstallTime" "$NPM" install
/usr/bin/time -o tmp/firstTestTime "$NPM" run test | tee tmp/firstTestOutput
/usr/bin/time -o tmp/secondTestTime "$NPM" run test | tee tmp/secondTestOutput

echo "pnpm install"
cat "tmp/pnpmInstallTime"
echo
echo "First test run"
cat tmp/firstTestTime
echo
echo "Second test run"
cat tmp/secondTestTime
