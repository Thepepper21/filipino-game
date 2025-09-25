<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ScoreController extends Controller
{
    /**
     * Store a new score
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:50|min:1',
                'score' => 'required|integer|min:0|max:999999',
            ]);

            $score = Score::create([
                'name' => trim($validated['name']),
                'score' => $validated['score'],
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Score submitted successfully!',
                'data' => [
                    'id' => $score->id,
                    'name' => $score->name,
                    'score' => $score->score,
                    'created_at' => $score->created_at->toISOString(),
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save score',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get the highest score
     */
    public function getHighScore(): JsonResponse
    {
        try {
            $highScore = Score::getHighScore();
            
            if (!$highScore) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'name' => 'No scores yet',
                        'score' => 0
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $highScore->name,
                    'score' => $highScore->score,
                    'created_at' => $highScore->created_at->toISOString(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch high score',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get leaderboard
     */
    public function getLeaderboard(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 10);
            $limit = min(max($limit, 1), 50); // Between 1 and 50
            
            $leaderboard = Score::getLeaderboard($limit);

            return response()->json([
                'success' => true,
                'data' => $leaderboard->map(function ($score, $index) {
                    return [
                        'rank' => $index + 1,
                        'name' => $score->name,
                        'score' => $score->score,
                        'created_at' => $score->created_at->toISOString(),
                    ];
                })
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leaderboard',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
