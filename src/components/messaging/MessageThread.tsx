
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, Calendar, User } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageThreadProps {
  threadId: string;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  currentUserName: string;
  initialMessages?: Message[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  recipientId,
  recipientName,
  currentUserId,
  currentUserName,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    // Create a new message object
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      recipientId: recipientId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // In a real app, send this to an API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setMessages([...messages, message]);
      setNewMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center space-x-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${recipientName}`} />
          <AvatarFallback>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{recipientName}</h3>
          <p className="text-sm text-muted-foreground">
            <Calendar className="inline-block mr-1" size={12} />
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 
                ${msg.senderId === currentUserId 
                  ? 'bg-primary text-white' 
                  : 'bg-muted'}`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs ${msg.senderId === currentUserId ? 'text-primary-foreground/80' : 'text-muted-foreground'} mt-1`}>
                  {formatDate(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type a message..."
            className="resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            size="icon" 
            type="submit"
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim()}
            className="flex-shrink-0"
          >
            <ArrowUp size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
