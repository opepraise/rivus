#!/bin/bash
# Rivus deployment script
# Usage: ./scripts/deploy.sh [simnet|testnet|mainnet]
set -e

NETWORK=${1:-testnet}
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "========================================"
echo " Rivus deployment — $NETWORK"
echo " $TIMESTAMP"
echo "========================================"

echo ""
echo "Running contract checks..."
clarinet check

echo ""
echo "Running tests..."
npm test

case $NETWORK in
  simnet)
    clarinet console
    ;;
  testnet)
    echo ""
    echo "Deploying to testnet..."
    clarinet deployments apply --testnet
    ;;
  mainnet)
    echo ""
    echo "WARNING: mainnet deployment. Press Ctrl+C within 10s to abort..."
    sleep 10
    echo "Deploying to mainnet..."
    clarinet deployments apply --mainnet
    ;;
  *)
    echo "Unknown network: $NETWORK"
    echo "Usage: ./scripts/deploy.sh [simnet|testnet|mainnet]"
    exit 1
    ;;
esac

echo ""
echo "========================================"
echo " Post-deployment checklist"
echo "========================================"
echo "1. Call stream-vault set-registry <stream-registry-principal>"
echo "2. Call rvus-token set-minter <authorized-minter-principal>"
echo "3. Verify stream-vault get-registry returns the correct registry address"
echo "4. Update deployments/default.${NETWORK}-plan.yaml with confirmed tx IDs"
echo ""
echo "Deployment complete."
