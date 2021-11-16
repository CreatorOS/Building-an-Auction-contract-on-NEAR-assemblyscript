#!/usr/bin/env bash

set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"


near create-account $CONTRACT.hdsaleh.testnet --masterAccount hdsaleh.testnet --initialBalance 10

exit 0