export interface SubmitScoreRequest {
    name: string;
    score: number;
}

export interface HighScoreResponse {
    name: string;
    score: number;
    created_at?: string;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    created_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
    error?: string;
}

export async function submitScore(payload: SubmitScoreRequest): Promise<ApiResponse<any>> {
    try {
        const response = await fetch('/api/score', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload),
        });

        const data: ApiResponse<any> = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Score submission failed:', error);
        throw error;
    }
}

export async function getHighScore(): Promise<HighScoreResponse> {
    try {
        const response = await fetch('/api/score/high', { 
            headers: { 
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            } 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data: ApiResponse<HighScoreResponse> = await response.json();
        
        if (!data.success || !data.data) {
            throw new Error(data.message || 'Failed to fetch high score');
        }
        
        return data.data;
    } catch (error) {
        console.error('Failed to fetch high score:', error);
        throw error;
    }
}

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
        const response = await fetch(`/api/score/leaderboard?limit=${limit}`, { 
            headers: { 
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            } 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data: ApiResponse<LeaderboardEntry[]> = await response.json();
        
        if (!data.success || !data.data) {
            throw new Error(data.message || 'Failed to fetch leaderboard');
        }
        
        return data.data;
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        throw error;
    }
}


