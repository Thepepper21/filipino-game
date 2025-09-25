# Database Setup Guide

## Quick Setup Instructions

### 1. Configure Database Connection

Update your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=filipino_game
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 2. Create Database

Create a new database called `filipino_game` in your MySQL server:

```sql
CREATE DATABASE filipino_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Migration

Once your database is configured, run:

```bash
php artisan migrate
```

This will create the `scores` table with the following structure:
- `id` (primary key)
- `name` (player name)
- `score` (integer score)
- `ip_address` (nullable, for tracking)
- `created_at` and `updated_at` timestamps
- Indexes for performance optimization

### 4. Test API Endpoints

After migration, you can test the API endpoints:

- **Submit Score**: `POST /api/score`
  ```json
  {
    "name": "Player Name",
    "score": 150
  }
  ```

- **Get High Score**: `GET /api/score/high`
- **Get Leaderboard**: `GET /api/score/leaderboard?limit=10`

### 5. Alternative: SQLite Setup (Easier for Development)

If you prefer SQLite for development, update your `.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

Then create the database file:

```bash
touch database/database.sqlite
php artisan migrate
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Score submitted successfully!",
  "data": {
    "id": 1,
    "name": "Player Name",
    "score": 150,
    "created_at": "2025-09-22T16:08:10.000000Z"
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["The name field is required."],
    "score": ["The score must be an integer."]
  }
}
```
