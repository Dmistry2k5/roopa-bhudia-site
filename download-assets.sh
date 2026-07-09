#!/usr/bin/env bash
# ---------------------------------------------------------------
# Optional: pull Roopa's images into this repo so the site does not
# depend on the agency's servers. Run once from the repo root:
#
#     chmod +x download-assets.sh
#     ./download-assets.sh
#
# Then switch the site over to the local copies:
#
#   macOS:
#     sed -i '' 's#https://media.sandrareynolds.co.uk/models/#assets/img/#g' index.html
#   Linux:
#     sed -i 's#https://media.sandrareynolds.co.uk/models/#assets/img/#g' index.html
#
# Commit and push as normal.
# ---------------------------------------------------------------
set -e
BASE="https://media.sandrareynolds.co.uk/models"
OUT="assets/img"
mkdir -p "$OUT"

FILES=(
  "ovMhuvmQJBpCh1wlck8xqdkuhRs61dYZusTwOm7Va9qaipRhVltfI58kKKxkc6nQEQkWbh.jpg"
  "dDgnsnymiKyJ8fUxhVZgqUn4rvsaVtzrCyftDfgWlB0BhXOCXQye2vjfEtcZzXYXy4NDNm.jpg"
  "ZQheqhV4A3FHp8jn7WCKSHipMzUYB9GtLmQxGx023S6netcBFSVuc5NIDMCmiz2yqti1hd.jpg"
  "nRjPtBocGrN5YXKOg1ODWoAwNV9aWnC32G7kNfCn8pR3zg56koOfmNXpNADQ6lfiCDV68a.jpg"
  "g3zmyWvVsDnyKz09OMTk5t4ZxWMvOJtfDlyjlb73ef7sCVytz9ANw1r7JslB6blfUz8EXx.jpg"
  "RlzsKwzXtzaW7v1SUVpKYuy0NiQUpNgmpi4VTECs0T39UsROChtMTTlvi0SnxQwsgFXt8J.jpg"
  "igTxQDx04T03e3GAs2qbePwGyKY70JB1jTlvyhmjW63Ednk6gZgleie3OBTwM1omZkvCHR.jpg"
  "8713HH8BVpLyEQvNtDHVeDNn82JjGtFd9lyMNhs6xfmUpWZz3VHKXocN0kXNTxgSvwSepE.jpg"
  "wnQoiOxmZStOQ4yocDus1gcSbAFkZb7IQ4gk7PTbbUh3VHbWOaFxWZHCwd17p8Tqs46Yd0.jpg"
  "RViJhmyx5ee4xoj2JXDPHNk3C5vvGsQ0Q46Clz8pHvsL6mIUBLXT8hW4YhN4bcRl74RxI0.jpg"
  "iImmBT5ANlBGIHBfHEK7NaCCaDEtPTOZrCdODaRWfMDe7iViy4A3sP0qwyMVAM1CGTH0B7.jpg"
)

for f in "${FILES[@]}"; do
  echo "Downloading $f"
  curl -fsSL "$BASE/$f" -o "$OUT/$f"
done

echo "Done. ${#FILES[@]} images saved to $OUT/"
