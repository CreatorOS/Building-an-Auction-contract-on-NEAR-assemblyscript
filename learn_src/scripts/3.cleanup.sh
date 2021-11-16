#!/usr/bin/env bash

set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

near delete $CONTRACT.hdsaleh.testnet hdsaleh.testnet

unset CONTRACT

yarn clean

exit 0