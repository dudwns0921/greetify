export interface BaseResponse<T> {
    status: string;
    data: T;
}

export interface ServerResponseMap {
    '/greet-from-image': BaseResponse<string>;
    '/greet-from-text': BaseResponse<{
        is_greeting: boolean;
        reason: string;
    }>;
    '/save-current-location': BaseResponse<null>;
}