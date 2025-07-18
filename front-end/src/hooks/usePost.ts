import { getServerUrl } from '@/util/server';
import { useState } from 'react';
import type { ServerResponseMap } from '@/types/http/response';
import type { ServerRequestMap } from '@/types/http/request';
import { useLoading } from '@/hooks/useLoading';

const usePost = <T extends keyof ServerResponseMap>(url: T) => {
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ServerResponseMap[T] | null>(null);
  const { setLoading } = useLoading();

  const post = async (body: ServerRequestMap[T]): Promise<ServerResponseMap[T]> => {
    setError(null);
    setLoading(true);
    setResponse(null);
    try {
      const sessionId = localStorage.getItem('session_id');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (sessionId) {
        headers['X-Session-Id'] = sessionId;
      }
      const res = await fetch(`${getServerUrl()}${url}`, {
        method: 'POST',
        headers,
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
      setLoading(false);
    }
  };

  return { error, response, post };
};

export default usePost; 