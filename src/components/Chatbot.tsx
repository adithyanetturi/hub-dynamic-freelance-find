
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMobile } from "@/hooks/use-mobile";

interface Message {
  role: "user" | "assistant";
  content: string;
  hasLocationContext?: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! How can I help you today? Ask me anything about FreelanceHub or any other topic you're curious about." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: "user" as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const historyForApi = messages
        .filter(msg => messages.indexOf(msg) > 0) // Skip the initial greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { query, history: [...historyForApi, userMessage] }
      });

      if (error) throw new Error(error.message);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.answer,
        hasLocationContext: data.locationDetected 
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const ChatContent = () => (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-brand-100 text-gray-800"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {msg.hasLocationContext && (
                <div className="flex items-center text-sm text-brand-600 mb-1">
                  <MapPin size={14} className="mr-1" />
                  <span>Location-enhanced response</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !query.trim()}
        >
          <Send size={18} />
        </Button>
      </form>
    </>
  );

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg bg-brand-600 hover:bg-brand-700 z-50"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat panel - Dialog for desktop / Drawer for mobile */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[80vh]">
            <DrawerHeader className="border-b bg-brand-600 text-white">
              <DrawerTitle>FreelanceHub Assistant</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col h-full">
              <ChatContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col p-0">
            <DialogHeader className="p-4 border-b bg-brand-600 text-white rounded-t-lg">
              <DialogTitle>FreelanceHub Assistant</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-full">
              <ChatContent />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Chatbot;
