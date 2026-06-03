#!/bin/sh

# Run migrations using production config
echo "Running migrations..."
NODE_ENV=production npm run db:migrate

# Run seeders using production config
echo "Seeding database..."
NODE_ENV=production npm run db:seed

# Start the application
echo "Starting server..."
npm start
