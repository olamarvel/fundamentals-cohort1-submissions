#!/bin/bash

# ================= CONFIGURATION =================
BASE_URL="http://localhost:5000/api" # Changed to 3000 to match previous context
TOTAL_REQUESTS=1000
BATCH_SIZE=50 # How many requests to send in parallel at once
POLL_INTERVAL=5

# Sampling: Only track 1 out of every N jobs to avoid crashing the status checker
SAMPLE_RATE=10
# =================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Temp file to store responses
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "${YELLOW}==============================================${NC}"
echo -e "${YELLOW}   🚀 HIGH-LOAD SYSTEM TEST (${TOTAL_REQUESTS} reqs)   ${NC}"
echo -e "${YELLOW}==============================================${NC}"

# Helper to extract JSON value
extract_json_value() {
    local json=$1
    local key=$2
    echo "$json" | grep -o "\"$key\":[^,}]*" | sed 's/.*://' | tr -d '"' | tr -d ' '
}

# Arrays
WATCH_LIST=()
TOTAL_SENT=0

echo -e "\n${BLUE}[PHASE 1] Blasting Requests in Batches of $BATCH_SIZE...${NC}"
START_TIME=$SECONDS

# --- OUTER LOOP (BATCHES) ---
for (( i=0; i<$TOTAL_REQUESTS; i+=$BATCH_SIZE )); do
    
    # 1. Start parallel requests
    for (( j=0; j<$BATCH_SIZE; j++ )); do
        CURRENT_REQ=$((i + j + 1))
        if [ $CURRENT_REQ -gt $TOTAL_REQUESTS ]; then break; fi

        # Create payload
        PAYLOAD="{\"type\":\"email\",\"to\":\"user_$CURRENT_REQ@test.com\",\"content\":\"Load Test #$CURRENT_REQ\"}"
        
        # Send request in BACKGROUND (&) and save output to a temp file
        # We use silent mode (-s) and write to a unique file for this request
        curl -s -X POST "$BASE_URL/notify" \
             -H "Content-Type: application/json" \
             -d "$PAYLOAD" > "$TEMP_DIR/resp_$j.txt" &
    done

    # 2. WAIT for this batch to finish (Barrier)
    wait

    # 3. Process the batch results
    for (( j=0; j<$BATCH_SIZE; j++ )); do
        CURRENT_REQ=$((i + j + 1))
        if [ $CURRENT_REQ -gt $TOTAL_REQUESTS ]; then break; fi

        RESPONSE=$(cat "$TEMP_DIR/resp_$j.txt")
        JOB_ID=$(extract_json_value "$RESPONSE" "jobId")

        if [[ -n "$JOB_ID" ]]; then
            ((TOTAL_SENT++))
            
            # SAMPLING LOGIC: Only add to watch list if it matches sample rate
            if (( $CURRENT_REQ % $SAMPLE_RATE == 0 )); then
                WATCH_LIST+=("$JOB_ID")
            fi
        fi
    done

    # Progress Bar (One # per batch)
    echo -n "#"
done

DURATION=$(( SECONDS - START_TIME ))
echo -e "\n\n✅ [PHASE 1 COMPLETE] Sent $TOTAL_SENT requests in ${DURATION}s."
echo -e "📋 Tracking ${#WATCH_LIST[@]} sample jobs (Sampling 1 out of every $SAMPLE_RATE)"

# --- PHASE 2: POLLING SAMPLES ---
echo -e "\n${YELLOW}[PHASE 2] Polling Sample Set...${NC}"

COMPLETED_COUNT=0
FAILED_COUNT=0

while [ ${#WATCH_LIST[@]} -gt 0 ]; do
    echo -e "\nWaiting ${POLL_INTERVAL}s... (${#WATCH_LIST[@]} samples pending)"
    sleep $POLL_INTERVAL

    NEW_PENDING_LIST=()

    for job_id in "${WATCH_LIST[@]}"; do
        STATUS_RES=$(curl -s "$BASE_URL/status/$job_id")
        STATUS=$(extract_json_value "$STATUS_RES" "status")

        if [[ "$STATUS" == "SENT" ]]; then
            ((COMPLETED_COUNT++))
            # Multiply by SAMPLE_RATE to estimate total system throughput
            ESTIMATED_TOTAL=$(( COMPLETED_COUNT * SAMPLE_RATE ))
            echo -e "${GREEN}✔ Sample $job_id DONE${NC} (Est. Total Completed: ~$ESTIMATED_TOTAL)"
        elif [[ "$STATUS" == "FAILED" ]]; then
            ((FAILED_COUNT++))
            echo -e "${RED}✘ Sample $job_id FAILED${NC}"
        else
            NEW_PENDING_LIST+=("$job_id")
        fi
    done

    WATCH_LIST=("${NEW_PENDING_LIST[@]}")
    
    # Check if we are done
    if [ ${#WATCH_LIST[@]} -eq 0 ]; then
        break
    fi
done

echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}   🎉 LOAD TEST COMPLETE   ${NC}"
echo -e "   Samples Verified: $COMPLETED_COUNT / $FAILED_COUNT"
echo -e "   Approx System Throughput: $(( TOTAL_REQUESTS / DURATION )) req/sec"
echo -e "${GREEN}==============================================${NC}"