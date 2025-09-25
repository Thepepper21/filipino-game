<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'score',
        'ip_address',
    ];

    protected $casts = [
        'score' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the highest score
     */
    public static function getHighScore()
    {
        return self::orderBy('score', 'desc')->first();
    }

    /**
     * Get leaderboard (top 10 scores)
     */
    public static function getLeaderboard($limit = 10)
    {
        return self::orderBy('score', 'desc')
                   ->orderBy('created_at', 'asc')
                   ->limit($limit)
                   ->get();
    }
}
