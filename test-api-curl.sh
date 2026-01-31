#!/bin/bash

# Credit Card API Test using curl
API_URL="https://cards.finonest.com/api/leads.php"
API_KEY="lms_8188272ffd90118df860b5e768fe6681"

echo "🧪 Testing Credit Card API with curl"
echo "API: $API_URL"
echo "=================================="

# Test 1: Valid lead creation
echo -e "\n📤 Test 1: Creating valid lead..."
curl -X POST "$API_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "product_id": 1,
    "product_name": "Test Credit Card",
    "product_variant": "Premium",
    "product_highlights": "Test highlights",
    "bank_redirect_url": "https://example.com",
    "channel_code": "PARTNER_001",
    "status": "new"
  }' \
  -w "\n\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s

echo -e "\n=================================="

# Test 2: Invalid API key
echo -e "\n🔑 Test 2: Testing invalid API key..."
curl -X POST "$API_URL" \
  -H "X-API-Key: invalid_key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "mobile": "1234567890"}' \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo -e "\n=================================="

# Test 3: Missing data
echo -e "\n❌ Test 3: Testing missing required fields..."
curl -X POST "$API_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Incomplete User"}' \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo -e "\n✅ Tests completed!"