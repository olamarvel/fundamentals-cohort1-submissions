#!/bin/bash

# Configuration
BASE_URL="http://localhost:5000/api"
TOTAL_REQUESTS=100
POLL_INTERVAL=4

# Arrays to store Job IDs
PENDING_JOBS=()
COMPLETED_COUNT=0
FAILED_COUNT=0

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==============================================${NC}"
echo -e "${YELLOW}   🌊 STARTING NOTIFICATION STRESS TEST 🌊   ${NC}"
echo -e "${YELLOW}==============================================${NC}"

# --- HELPER FUNCTION: Extract JSON Value using Grep/Sed (No jq needed) ---
extract_json_value() {
    local json=$1
    local key=$2
    # This regex looks for "key":"value" or "key":value
    echo "$json" | grep -o "\"$key\":[^,}]*" | sed 's/.*://' | tr -d '"' | tr -d ' '
}

# --- PHASE 1: SENDING 100 REQUESTS ---
echo -e "\n${GREEN}[PHASE 1] Blasting $TOTAL_REQUESTS requests to $BASE_URL/notify...${NC}"

for i in $(seq 1 $TOTAL_REQUESTS); do
    # 1. Create JSON Payload
    PAYLOAD="{\"type\":\"email\",\"to\":\"user_$i@test.com\",\"content\":\"Stress Test Message #$i\"}"
    
    # 2. Send Request (Silent mode, output response)
    RESPONSE=$(curl -s -X POST "$BASE_URL/notify" -H "Content-Type: application/json" -d "$PAYLOAD")
    
    # 3. Extract Job ID
    JOB_ID=$(extract_json_value "$RESPONSE" "jobId")
    
    if [[ -n "$JOB_ID" ]]; then
        PENDING_JOBS+=("$JOB_ID")
        # Print a dot for every request sent (Visual progress bar)
        echo -n "."
    else
        echo -e "\n${RED}[!] Failed to get Job ID for request #$i. Is the server running?${NC}"
    fi
done

echo -e "\n\n✅ [PHASE 1 COMPLETE] Successfully Queued: ${#PENDING_JOBS[@]} Jobs."

# --- PHASE 2: POLLING STATUS ---
echo -e "\n${YELLOW}[PHASE 2] Polling Status every $POLL_INTERVAL seconds...${NC}"

# Loop until no jobs are pending
while [ ${#PENDING_JOBS[@]} -gt 0 ]; do
    echo -e "\n---------------------------------------------------"
    echo -e "Waiting $POLL_INTERVAL seconds... (Remaining: ${#PENDING_JOBS[@]})"
    sleep $POLL_INTERVAL

    # Create a temporary array for jobs that are STILL pending
    NEW_PENDING_LIST=()

    for job_id in "${PENDING_JOBS[@]}"; do
        # 1. Check Status
        STATUS_RES=$(curl -s -X GET "$BASE_URL/status/$job_id")
        
        # 2. Extract Status text
        STATUS=$(extract_json_value "$STATUS_RES" "status")

        # 3. Handle Logic based on status
        if [[ "$STATUS" == "SENT" ]]; then
            ((COMPLETED_COUNT++))
            # Optional: Print only every 10th success to avoid flooding console
            # echo -e "${GREEN}✔ Job $job_id -> SENT${NC}" 
        elif [[ "$STATUS" == "FAILED" ]]; then
            ((FAILED_COUNT++))
            echo -e "${RED}✘ Job $job_id -> FAILED${NC}"
        else
            # If still PENDING (or anything else), keep it in the list
            NEW_PENDING_LIST+=("$job_id")
        fi
    done

    # 4. Update the main list to only contain jobs that are still pending
    PENDING_JOBS=("${NEW_PENDING_LIST[@]}")

    # 5. Print Summary of this cycle
    echo -e "📊 Stats: ${GREEN}Sent: $COMPLETED_COUNT${NC} | ${RED}Failed: $FAILED_COUNT${NC} | ${YELLOW}Pending: ${#PENDING_JOBS[@]}${NC}"
done

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}   🎉 ALL JOBS PROCESSED! TEST COMPLETE.   ${NC}"
echo -e "${GREEN}==============================================${NC}"