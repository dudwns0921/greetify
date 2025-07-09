import { getServerUrl } from '@/util/server';
import { useState } from 'react';
import type { ServerResponseMap } from '@/types/http/response';
import type { ServerRequestMap } from '@/types/http/request';

const usePost = <T extends keyof ServerResponseMap>(url: T) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ServerResponseMap[T] | null>(null);

  const post = async (body: ServerRequestMap[T]): Promise<ServerResponseMap[T]> => {
    setError(null);
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${getServerUrl()}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = (await res.json()) as ServerResponseMap[T];
      if (!res.ok) {
        const detail = (data as { detail?: string }).detail;
        throw new Error(detail || `HTTP error! status: ${res.status}`);
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

  return { error, isLoading, response, post };
};

export default usePost; 