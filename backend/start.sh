#!/bin/sh

# Run migrations
echo "Running migrations..."
npm run db:migrate

# Run seeders (optional: only if you want demo data in production)
echo "Seeding database..."
npm run db:seed

# Start the application
echo "Starting server..."
npm start
