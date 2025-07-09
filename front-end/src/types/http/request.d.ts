export interface ServerRequestMap {
    '/greet-from-image': FormData
    '/greet-from-text': { text: string }
}