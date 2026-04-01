#!/bin/bash
# Add Google Search Console TXT record to Vercel DNS

# You need your Vercel token — get it from vercel.com/account/tokens
# Then run: VERCEL_TOKEN=your_token bash add_dns.sh

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Run this with your Vercel token:"
  echo "VERCEL_TOKEN=your_token_here bash add_dns.sh"
  exit 1
fi

curl -s -X POST "https://api.vercel.com/v2/domains/watercheckup.com/records?teamId=team_7F5gjhQID9Di0leJ2IuhuQ23" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TXT",
    "name": "@",
    "value": "google-site-verification=MJSQQKGrsGyHbwUQ5R6ll3w8Czku6Y7O-6qSryReirw",
    "ttl": 60
  }'

echo ""
echo "Done — now go back to Google Search Console and hit Verify"
