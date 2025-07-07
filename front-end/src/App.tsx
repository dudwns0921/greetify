import React, { useState } from 'react';
import useUpload from './hooks/useUpload';
import type { ServerResponseMap } from './types/http/response';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const { error, isLoading, upload } = useUpload<"/greet-from-image">('/greet-from-image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setGender(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setGender(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await upload(formData);
      setGender(data.gender);
    } catch {
      setGender(null);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>성별 예측 이미지 업로드</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || isLoading} style={{ marginLeft: 10 }}>
          {isLoading ? '분석 중...' : '업로드 및 분석'}
        </button>
      </form>
      {gender && (
        <div style={{ marginTop: 20, fontSize: 18 }}>
          예측된 성별: <b>{gender}</b>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>{error.message}</div>
      )}
    </div>
  );
};

export default App;
