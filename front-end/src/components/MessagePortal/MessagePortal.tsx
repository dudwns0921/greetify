import React from 'react';
import ReactDOM from 'react-dom';
import style from './MessagePortal.module.css'

interface MessagePortalProps {
  children: React.ReactNode;
}

const MessagePortal: React.FC<MessagePortalProps> = ({ children }) => {
  return ReactDOM.createPortal(
    <div className={style['message-portal']}>
      {children}
    </div>,
    document.body
  );
};

export default MessagePortal; 