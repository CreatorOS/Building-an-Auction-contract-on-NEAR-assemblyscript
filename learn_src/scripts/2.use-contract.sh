 #!/usr/bin/env bash

set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

#near view $CONTRACT.hdsaleh.testnet getBids
#near view $CONTRACT getBids
#near call $CONTRACT.hdsaleh.testnet createAuction '{"biddingTime": "1000"}' --account_id $CONTRACT.hdsaleh.testnet
near call $CONTRACT.hdsaleh.testnet createAuction '{"biddingTime" : 1000}' --accountId $CONTRACT.hdsaleh.testnet

near view $CONTRACT.hdsaleh.testnet getBids
exit 0
