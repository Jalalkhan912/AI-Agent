import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChat } from '@/hooks/useChat';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    messages,
    isLoading,
    sessionInfo,
    sendMessage,
    uploadFile,
    clearSession,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-header px-6 py-3">
        <h1 className="text-primary-foreground font-medium">CSV Agent</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!hasMessages ? (
          /* Initial centered state */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              How can I help you today?
            </h2>
            <ChatInput
              onSendMessage={sendMessage}
              onUploadFile={uploadFile}
              isLoading={isLoading}
              uploadedFileName={sessionInfo?.filename}
              onClearFile={clearSession}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Upload a CSV file to analyze data, or just ask a question
            </p>
          </div>
        ) : (
          /* Chat view */
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-chat-assistant rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input at bottom */}
            <div className="border-t border-border p-4">
              <ChatInput
                onSendMessage={sendMessage}
                onUploadFile={uploadFile}
                isLoading={isLoading}
                uploadedFileName={sessionInfo?.filename}
                onClearFile={clearSession}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
