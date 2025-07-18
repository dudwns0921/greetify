export const getServerUrl = () => {
    if (import.meta.env.DEV) {
        return 'http://localhost:8000/greetify/api/v1';
    }
    return '/api';
}