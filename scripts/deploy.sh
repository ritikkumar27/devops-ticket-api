#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="devops-ticket-manager-api:latest"
APP_VERSION="1.0.0"
COMMIT_SHA="local-test"
STATE_FILE=".deploy_state.json"

while [[ $# -gt 0 ]]; do
  case $1 in
    --image) IMAGE_NAME="$2"; shift 2 ;;
    --version) APP_VERSION="$2"; shift 2 ;;
    --sha) COMMIT_SHA="$2"; shift 2 ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

echo "------------------------------------------------------------------"
echo "🚀 [DEPLOY] Starting Automated Deployment"
echo "Image:        ${IMAGE_NAME}"
echo "Version:      ${APP_VERSION}"
echo "Commit SHA:   ${COMMIT_SHA}"
echo "Timestamp:    $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "------------------------------------------------------------------"

# Step 1: Record previous version for automated rollback
if [ -f "$STATE_FILE" ]; then
  PREV_VERSION=$(grep -o '"current_version": "[^"]*' "$STATE_FILE" | cut -d'"' -f4 || echo "none")
  PREV_SHA=$(grep -o '"current_sha": "[^"]*' "$STATE_FILE" | cut -d'"' -f4 || echo "none")
  echo "ℹ️  Found existing deployment state. Previous version: ${PREV_VERSION} (${PREV_SHA})"
else
  PREV_VERSION="none"
  PREV_SHA="none"
  echo "ℹ️  No previous state found. Initial deployment."
fi

# Step 2: Save active state before updating
cat <<EOF > "$STATE_FILE"
{
  "previous_version": "${PREV_VERSION}",
  "previous_sha": "${PREV_SHA}",
  "current_version": "${APP_VERSION}",
  "current_sha": "${COMMIT_SHA}",
  "current_image": "${IMAGE_NAME}",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "status": "deploying"
}
EOF

# Step 3: Apply container update
echo "📦 [DEPLOY] Applying container update..."
if command -v docker &> /dev/null && docker info &> /dev/null; then
  export APP_VERSION="${APP_VERSION}"
  export COMMIT_SHA="${COMMIT_SHA}"
  docker compose up -d --no-deps backend
else
  echo "ℹ️  Local/Runner deployment simulation mode active."
fi

sed -i 's/"status": "deploying"/"status": "deployed"/' "$STATE_FILE"
echo "✅ [DEPLOY] Container deployment stage executed successfully."
exit 0