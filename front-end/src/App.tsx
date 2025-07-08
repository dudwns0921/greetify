import React from 'react';
import useUpload from './hooks/useUpload';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';

const defaultMessages: string[] = [
  '안녕하세요?',
  '제게 인사를 건네주세요'
];

const App: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [gender, setGender] = React.useState<string | null>(null);
  const { error, isLoading, upload, response } = useUpload('/greet-from-image');

  // 메시지 애니메이션 훅 사용
  const {
    showMessage,
    currentMessage
  } = useAnimatedMessages(defaultMessages);

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
    <div className={styles.container}>
      {/* 애니메이션 메시지 */}
      <div className={styles.messageWrapper}>
        <div className={showMessage ? styles.messageShow : styles.messageHide}>
          {currentMessage}
        </div>
      </div>
      {/* 기존 폼 - 스타일 제거 */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          disabled={!file || isLoading}
        >
          {isLoading ? '분석 중...' : '업로드 및 분석'}
        </button>
      </form>
      {gender && response && (
        <div className={styles.result}>
          예측된 성별: <b>{gender}</b><br />
          예측된 나이대: <b>{response.age_group}</b>
        </div>
      )}
      {error && (
        <div className={styles.error}>{error.message}</div>
      )}
    </div>
  );
};

export default App;
