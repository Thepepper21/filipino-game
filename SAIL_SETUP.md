# Laravel Sail Database Setup

## Current Issue
The API routes are returning 404 errors because the database isn't properly configured for Sail.

## Quick Fix for Sail

### 1. Update your `.env` file with these MySQL settings:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

### 2. Start Sail services:
```bash
./vendor/bin/sail up -d
```

### 3. Run the migration through Sail:
```bash
./vendor/bin/sail artisan migrate
```

### 4. Clear caches:
```bash
./vendor/bin/sail artisan config:clear
./vendor/bin/sail artisan route:clear
./vendor/bin/sail artisan cache:clear
```

## Alternative: Use SQLite (Simpler for Development)

If you prefer to stick with SQLite, ensure your `.env` has:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
```

Then run:
```bash
./vendor/bin/sail artisan migrate
```

## Test the API

After setup, test the endpoints:
- http://localhost/api/score/high
- POST http://localhost/api/score (with JSON body)

## Current Routes Available:
- POST /api/score - Submit a score
- GET /api/score/high - Get highest score  
- GET /api/score/leaderboard - Get top scores

The routes are now properly registered in both `routes/api.php` and `routes/web.php` as fallback.
