#!/bin/sh

# Force NODE_ENV to production
export NODE_ENV=production

# DEBUG: Print current environment variables (masked)
echo "🔍 Current Environment Check:"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL is set: $(if [ -z "$DATABASE_URL" ]; then echo 'NO'; else echo 'YES'; fi)"

# Prevent .env file from overriding system environment variables
if [ -f .env ]; then
  mv .env .env.bak
  echo "Temporary disabled .env file to prioritize Render environment variables"
fi

# Run migrations using production config
echo "Running migrations..."
npm run db:migrate

# Run seeders using production config
echo "Seeding database..."
npm run db:seed

# Start the application
echo "Starting server..."
npm start
