export const checkPostError = (error: unknown): error is PostError => {
    return error instanceof TypeError || error instanceof Error || error instanceof DOMException;
};