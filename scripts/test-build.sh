#!/bin/bash
set -e

BASENAME="notion2content"

# ビルドされたコードにテスト用のコードを結合する.
# ビルドされたコードはエクスポートされていないための対応.
test -d "test/build" || mkdir "test/build"
cat "test_build/index.js" "build/${BASENAME}".js >"test/build/${BASENAME}.test.js"
