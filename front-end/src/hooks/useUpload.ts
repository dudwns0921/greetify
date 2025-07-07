import { getServerUrl } from '@/util/server';
import { useRef, useState } from 'react';
import type { ServerResponseMap } from '@/types/http/response';

const useUpload = <T extends keyof ServerResponseMap>(url: T) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ServerResponseMap[T] | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abortRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const upload = async (formData: FormData): Promise<ServerResponseMap[T]> => {
    setError(null);
    setIsLoading(true);
    setResponse(null);
    abortControllerRef.current = new AbortController();
    try {
      const res = await fetch(`${getServerUrl()}${url}`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      const data = (await res.json()) as ServerResponseMap[T];
      if (!res.ok) {
        throw new Error((data as any).detail || `HTTP error! status: ${res.status}`);
      }
      setResponse(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, response, upload, abortRequest };
};

export default useUpload; 