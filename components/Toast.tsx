
import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
        // @ts-ignore
        window.lucide.createIcons();
    }
  }, [toast.type]);


  useEffect(() => {
    const showTimeout = setTimeout(() => setIsShowing(true), 10);
    const dismissTimeout = setTimeout(() => {
      setIsShowing(false);
      setTimeout(() => onDismiss(toast.id), 400);
    }, 3000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(dismissTimeout);
    };
  }, [toast.id, onDismiss]);

  const bgColor = toast.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`px-4 py-3 rounded-xl text-white font-medium flex items-center space-x-2 toast ${bgColor} ${isShowing ? 'show' : ''}`}
    >
        {toast.type === 'success' ? <i data-lucide="check-circle" className="w-5 h-5"></i> : <i data-lucide="alert-triangle" className="w-5 h-5"></i>}
        <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
