#!/usr/bin/env bash

# Because OSX doesn't have 'timeout'...
perl -e 'alarm shift; exec @ARGV' "$@"
