#!/usr/bin/env bash

set -e

echo ---------------------------------------------------------
echo "Step 1: Build the contract"
echo ---------------------------------------------------------

yarn build:release

echo ---------------------------------------------------------
echo "Step 2: Deploy the contract"
echo ---------------------------------------------------------

#near dev-deploy ../build/release/proj.wasm
near deploy $CONTRACT.hdsaleh.testnet ../build/release/proj.wasm


exit 0
