#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="$(dirname "$0")/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env not found at $ENV_FILE"
  exit 1
fi

tmp_priv=$(mktemp)
tmp_pub=$(mktemp)
trap 'rm -f "$tmp_priv" "$tmp_pub"' EXIT

openssl genpkey -algorithm RSA -out "$tmp_priv" -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in "$tmp_priv" -out "$tmp_pub"

priv_b64=$(base64 -w0 < "$tmp_priv")
pub_b64=$(base64 -w0 < "$tmp_pub")

# Replace or append JWT_PRIVATE_KEY_BASE64
if grep -q '^JWT_PRIVATE_KEY_BASE64=' "$ENV_FILE"; then
  sed -i "s|^JWT_PRIVATE_KEY_BASE64=.*|JWT_PRIVATE_KEY_BASE64=$priv_b64|" "$ENV_FILE"
else
  echo "JWT_PRIVATE_KEY_BASE64=$priv_b64" >> "$ENV_FILE"
fi

# Replace or append JWT_PUBLIC_KEY_BASE64
if grep -q '^JWT_PUBLIC_KEY_BASE64=' "$ENV_FILE"; then
  sed -i "s|^JWT_PUBLIC_KEY_BASE64=.*|JWT_PUBLIC_KEY_BASE64=$pub_b64|" "$ENV_FILE"
else
  echo "JWT_PUBLIC_KEY_BASE64=$pub_b64" >> "$ENV_FILE"
fi

echo "JWT keys written to $ENV_FILE"
