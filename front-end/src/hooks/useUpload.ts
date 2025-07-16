import { getServerUrl } from '@/util/server';
import { useState } from 'react';
import type { ServerResponseMap } from '@/types/http/response';

const useUpload = <T extends keyof ServerResponseMap>(url: T) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ServerResponseMap[T] | null>(null);

  const upload = async (formData: FormData): Promise<ServerResponseMap[T]> => {
    setError(null);
    setIsLoading(true);
    setResponse(null);
    try {
      const sessionId = localStorage.getItem('session_id');
      const headers: Record<string, string> = {};
      if (sessionId) {
        headers['X-Session-Id'] = sessionId;
      }
      const res = await fetch(`${getServerUrl()}${url}`, {
        method: 'POST',
        headers,
        body: formData
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

  return { error, isLoading, response, upload };
};

export default useUpload; 