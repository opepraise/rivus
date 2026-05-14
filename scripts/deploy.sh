#!/bin/bash
# Rivus deployment script
# Usage: ./scripts/deploy.sh [testnet|mainnet]
set -e
NETWORK=${1:-testnet}
echo "Deploying Rivus to $NETWORK..."
clarinet check
case $NETWORK in
  testnet)
    clarinet deployments generate --testnet
    clarinet deployments apply --testnet
    ;;
  mainnet)
    echo "WARNING: mainnet deployment. Press Ctrl+C to abort, or wait 5s..."
    sleep 5
    clarinet deployments generate --mainnet
    clarinet deployments apply --mainnet
    ;;
  *) echo "Unknown network: $NETWORK"; exit 1 ;;
esac
echo ""
echo "Post-deployment:"
echo "1. stream-vault set-registry <stream-registry-address>"
echo "Done."
