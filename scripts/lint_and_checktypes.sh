<<<<<<< HEAD
#!/usr/bin/env bash
# Run eslint and typescript typechecker in parallel. To keep the outputs from
# awkwardly intermingling, the linter runs redirected to a file, which is then
# printed after the type-checker has finished.
=======
#!/bin/bash
# Run eslint and the typescript typechecker on the main project, and eslint and
# the typescript typechecker on CkEditor plugins, in parallel. To keep the
# outputs from awkwardly intermingling, three of these four jobs run run
# redirected to a file, which is then printed after all four have finished.
>>>>>>> base/master

CKEDITOR_DIR="ckEditor"
mkdir -p tmp

<<<<<<< HEAD
# Run the linter in the background, redirected to a file, and get its pid
pnpm run --silent eslint 2>&1 >tmp/lint_result.txt &
lint_pid=$!

# Run the typechecker, not in the background
pnpm run --silent tsc
=======
# Run the linter on the main project in the background, redirected to a file,
# and get its pid
yarn run --silent eslint 2>&1 >tmp/lint_result.txt &
lint_pid=$!

# Run the linter for ckeditor plugins
(cd "$CKEDITOR_DIR" && yarn run --silent lint 2>&1 >../tmp/ckeditor_lint_result.txt) &
ckeditor_lint_pid=$!

# Run the typechecker on ckeditor plugins
(cd "$CKEDITOR_DIR" && yarn run --silent tsc 2>&1 >../tmp/ckeditor_tsc_result.txt) &
ckeditor_tsc_pid=$!

# Run the typechecker on the main project, not in the background
yarn run --silent tsc
>>>>>>> base/master
tsc_result=$?

# Wait for background tasks to finish
wait $lint_pid
lint_result=$?
wait $ckeditor_lint_pid
ckeditor_lint_result=$?
wait $ckeditor_tsc_pid
ckeditor_tsc_result=$?

# Output the lint results
cat tmp/lint_result.txt
cat tmp/ckeditor_lint_result.txt
cat tmp/ckeditor_tsc_result.txt

# Exit with failure status if either tsc or lint returned failure
<<<<<<< HEAD
exit_status=$(($tsc_result || $lint_result))
=======
exit_status=$(( $tsc_result || $lint_result || $ckeditor_lint_result || $ckeditor_tsc_result ))
>>>>>>> base/master
exit $exit_status
