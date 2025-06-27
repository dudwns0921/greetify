import { getServerUrl } from '@/util/server';
import { checkPostError } from '@/util/types/error';
import { useRef, useState } from 'react';

const usePost = <T extends keyof ServerResponseMap>(url: T) => {
    const [error, setError] = useState<PostError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    const abortRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const post = async (body: ServerRequestMap[T]) => {
        if (error) setError(null);
        setIsLoading(true);
        abortControllerRef.current = new AbortController();
        try {
            const res = await fetch(`${getServerUrl()}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: abortControllerRef.current.signal,
            });
            const data = (await res.json()) as ServerResponseMap[T];
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return data;
        } catch (error) {
            console.error(error);
            if (checkPostError(error)) {
                setError(error);
            } else {
                setError(new Error('An unknown error occurred'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, post, abortRequest };
};

export default usePost;