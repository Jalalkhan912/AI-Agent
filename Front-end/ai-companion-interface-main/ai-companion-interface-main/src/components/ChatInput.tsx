import { useState, useRef } from 'react';
import { Send, Paperclip, X, FileSpreadsheet } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile: (file: File) => void;
  isLoading: boolean;
  uploadedFileName?: string;
  onClearFile: () => void;
}

export function ChatInput({
  onSendMessage,
  onUploadFile,
  isLoading,
  uploadedFileName,
  onClearFile,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      onUploadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {uploadedFileName && (
        <div className="mb-2 flex items-center gap-2 bg-muted px-3 py-2 rounded-lg text-sm">
          <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground truncate flex-1">{uploadedFileName}</span>
          <button
            onClick={onClearFile}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-background border border-border rounded-full shadow-sm hover:shadow-md transition-shadow">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent py-3 px-2 outline-none text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
