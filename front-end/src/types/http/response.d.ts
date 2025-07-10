export interface ServerResponseMap {
    '/greet-from-image': {
        gender: string;
        age_group: string;
    };
    '/greet-from-text': {
        is_greeting: boolean;
        reason: string;
    };
    '/save-current-location': {
        status: string;
        data: null;
    };
}