#!/bin/bash

# Wait for ffc-mpdp-backend to be healthy
until curl -s http://ffc-mpdp-backend:3000/healthy > /dev/null; do
  echo "Waiting for ffc-mpdp-backend to be healthy..."
  sleep 5
done

# Run the acceptance tests
 npm run test:acceptance
