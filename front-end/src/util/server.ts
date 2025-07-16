export const getServerUrl = () => {
    if (import.meta.env.DEV) {
        return 'http://localhost:8000/api/v1';
    }
    return '/api';
}