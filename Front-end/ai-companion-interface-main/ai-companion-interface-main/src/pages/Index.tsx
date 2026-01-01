import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChat } from '@/hooks/useChat';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    messages,
    isLoading,
    sessionInfo,
    sendMessage,
    uploadFile,
    clearSession,
    clearMessages,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
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
                {/* New Chat Button */}
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearMessages}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Chat
                  </Button>
                </div>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    chartUrls={message.chartUrls}
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
