import React, { useState, useEffect, useCallback } from 'react';

interface DialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type: 'alert' | 'confirm' | 'prompt';
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomDialog: React.FC<DialogProps> = ({
  isOpen,
  title = '提示',
  message,
  type,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (type === 'prompt') {
      onConfirm?.(inputValue);
    } else {
      onConfirm?.();
    }
    setIsVisible(false);
  }, [type, inputValue, onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    setIsVisible(false);
  }, [onCancel]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleConfirm, handleCancel]);

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, handleKeyDown]);

  if (!isVisible) return null;

  return (
    <div className="custom-dialog-overlay">
      <div className="custom-dialog">
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
          {type === 'prompt' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="dialog-input"
              autoFocus
            />
          )}
        </div>
        <div className="dialog-footer">
          {type !== 'alert' && (
            <button className="dialog-btn cancel" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button className="dialog-btn confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// 全局弹窗管理器
let dialogResolve: ((value: any) => void) | null = null;

const DialogManager: React.FC = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: 'alert' | 'confirm' | 'prompt';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    message: '',
    type: 'alert'
  });

  const showDialog = (
    message: string,
    type: 'alert' | 'confirm' | 'prompt' = 'alert',
    title?: string,
    confirmText?: string,
    cancelText?: string
  ): Promise<any> => {
    setDialogState({
      isOpen: true,
      message,
      type,
      title,
      confirmText,
      cancelText
    });

    return new Promise((resolve) => {
      dialogResolve = resolve;
    });
  };

  const handleConfirm = (value?: string) => {
    dialogResolve?.(dialogState.type === 'confirm' ? true : value);
    setDialogState({ ...dialogState, isOpen: false });
  };

  const handleCancel = () => {
    dialogResolve?.(dialogState.type === 'confirm' ? false : null);
    setDialogState({ ...dialogState, isOpen: false });
  };

  // 挂载到全局对象
  useEffect(() => {
    (window as any).customDialog = {
      alert: (message: string, title?: string) => showDialog(message, 'alert', title),
      confirm: (message: string, title?: string) => showDialog(message, 'confirm', title),
      prompt: (message: string, title?: string) => showDialog(message, 'prompt', title)
    };
  }, [showDialog]);

  return (
    <CustomDialog
      isOpen={dialogState.isOpen}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
    />
  );
};

export default DialogManager;