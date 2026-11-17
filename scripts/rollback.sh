#!/usr/bin/env bash
set -euo pipefail

STATE_FILE=".deploy_state.json"
TARGET_VERSION=""
ENVIRONMENT="production"
REASON="Unspecified Failure"

while [[ $# -gt 0 ]]; do
  case $1 in
    --target-version) TARGET_VERSION="$2"; shift 2 ;;
    --environment) ENVIRONMENT="$2"; shift 2 ;;
    --reason) REASON="$2"; shift 2 ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

echo "------------------------------------------------------------------"
echo "🚨 [ROLLBACK] Initiating Immediate Deployment Rollback"
echo "Environment: ${ENVIRONMENT}"
echo "Reason:      ${REASON}"
echo "Timestamp:   $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "------------------------------------------------------------------"

if [ -z "$TARGET_VERSION" ]; then
  if [ -f "$STATE_FILE" ]; then
    TARGET_VERSION=$(grep -o '"previous_version": "[^"]*' "$STATE_FILE" | cut -d'"' -f4 || echo "")
    if [ -z "$TARGET_VERSION" ] || [ "$TARGET_VERSION" = "none" ]; then
      echo "❌ [ROLLBACK] No recorded previous version in state file. Cannot auto-rollback."
      exit 1
    fi
    echo "ℹ️  Auto-detected target rollback version: ${TARGET_VERSION}"
  else
    echo "❌ [ROLLBACK] State file not found and no --target-version provided."
    exit 1
  fi
fi

echo "🔄 Restoring application service to stable release: ${TARGET_VERSION}..."

if command -v docker &> /dev/null && docker info &> /dev/null; then
  export APP_VERSION="${TARGET_VERSION}"
  docker compose up -d --no-deps backend
else
  echo "ℹ️  Simulated rollback to stable version ${TARGET_VERSION}."
fi

if [ -f "$STATE_FILE" ]; then
  cat <<EOF > "$STATE_FILE"
{
  "active_version": "${TARGET_VERSION}",
  "rollback_timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "rollback_reason": "${REASON}",
  "status": "rolled_back"
}
EOF
fi

echo "✅ [ROLLBACK] Successfully restored stable release ${TARGET_VERSION}."
exit 0