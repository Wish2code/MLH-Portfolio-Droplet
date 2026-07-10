#!/bin/bash

BASE_URL="http://localhost:5000/api/timeline_post"

# Generate random values
RANDOM_ID=$RANDOM
NAME="TestUser$RANDOM_ID"
EMAIL="test$RANDOM_ID@example.com"
CONTENT="Timeline Test $RANDOM_ID"

echo "Creating timeline post..."

# Send POST request
POST_RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -d "name=$NAME&email=$EMAIL&content=$CONTENT")

echo "$POST_RESPONSE"

# Extract the id from the JSON response
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.id')

echo "Created post with ID: $POST_ID"

echo
echo "Checking GET endpoint..."

GET_RESPONSE=$(curl -s "$BASE_URL")

# Check that the new post exists
FOUND=$(echo "$GET_RESPONSE" | jq --arg id "$POST_ID" \
'.timeline_posts[] | select(.id == ($id|tonumber))')

if [ -n "$FOUND" ]; then
    echo "✅ POST successfully added!"
else
    echo "❌ Failed to find the post."
    exit 1
fi

echo
echo "Deleting test post..."

DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/$POST_ID")

echo "$DELETE_RESPONSE"

echo
echo "Verifying deletion..."

GET_RESPONSE=$(curl -s "$BASE_URL")

FOUND=$(echo "$GET_RESPONSE" | jq --arg id "$POST_ID" \
'.timeline_posts[] | select(.id == ($id|tonumber))')

if [ -z "$FOUND" ]; then
    echo "✅ Delete successful!"
else
    echo "❌ Delete failed!"
    exit 1
fi

echo
echo "All tests passed!"#!/bin/bash

BASE_URL="http://localhost:5000/api/timeline_post"

# Generate random values
RANDOM_ID=$RANDOM
NAME="TestUser$RANDOM_ID"
EMAIL="test$RANDOM_ID@example.com"
CONTENT="Timeline Test $RANDOM_ID"

echo "Creating timeline post..."

# Send POST request
POST_RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -d "name=$NAME&email=$EMAIL&content=$CONTENT")

echo "$POST_RESPONSE"

# Extract the id from the JSON response
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.id')

echo "Created post with ID: $POST_ID"

echo
echo "Checking GET endpoint..."

GET_RESPONSE=$(curl -s "$BASE_URL")

# Check that the new post exists
FOUND=$(echo "$GET_RESPONSE" | jq --arg id "$POST_ID" \
'.timeline_posts[] | select(.id == ($id|tonumber))')

if [ -n "$FOUND" ]; then
    echo "✅ POST successfully added!"
else
    echo "❌ Failed to find the post."
    exit 1
fi

echo
echo "Deleting test post..."

DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/$POST_ID")

echo "$DELETE_RESPONSE"

echo
echo "Verifying deletion..."

GET_RESPONSE=$(curl -s "$BASE_URL")

FOUND=$(echo "$GET_RESPONSE" | jq --arg id "$POST_ID" \
'.timeline_posts[] | select(.id == ($id|tonumber))')

if [ -z "$FOUND" ]; then
    echo "✅ Delete successful!"
else
    echo "❌ Delete failed!"
    exit 1
fi

echo
echo "All tests passed!"
