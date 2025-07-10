export interface ServerRequestMap {
    '/greet-from-image': FormData
    '/greet-from-text': { text: string }
    '/save-current-location': { latitude: number; longitude: number };
}