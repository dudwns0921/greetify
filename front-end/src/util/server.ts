export const getServerUrl = () => {
    if (import.meta.env.MODE === 'production') {
        return 'http://158.179.167.189:8000/api/v1';
    }
    return 'http://localhost:8000/api/v1';
}