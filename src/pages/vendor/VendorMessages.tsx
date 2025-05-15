
import React, { useState, useEffect } from 'react';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageThread } from '@/components/messaging/MessageThread';
import VendorLayout from '@/components/layouts/VendorLayout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MessageThreadSummary {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const VendorMessages = () => {
  const [threads, setThreads] = useState<MessageThreadSummary[]>([]);
  const [selectedThread, setSelectedThread] = useState<{
    threadId: string;
    participantId: string;
    participantName: string;
    messages: Message[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch message threads
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with some sample data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const sampleThreads: MessageThreadSummary[] = [
          {
            id: "thread1",
            participantId: "user1",
            participantName: "Demo Client",
            lastMessage: "Looking forward to discussing your wedding photography!",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            unreadCount: 0
          },
          {
            id: "thread4",
            participantId: "user2",
            participantName: "Jane Smith",
            lastMessage: "Do you have availability for an engagement photoshoot next month?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            unreadCount: 1
          },
          {
            id: "thread5",
            participantId: "user3",
            participantName: "Michael Johnson",
            lastMessage: "Thanks for the quote. We'll get back to you soon.",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            unreadCount: 0
          }
        ];
        
        setThreads(sampleThreads);
      } catch (error) {
        toast({
          title: "Failed to load messages",
          description: "There was a problem fetching your messages. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

  const handleSelectThread = async (threadId: string, participantId: string, participantName: string) => {
    try {
      // Fetch messages for this thread
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let sampleMessages: Message[] = [];
      
      if (threadId === "thread1") {
        sampleMessages = [
          {
            id: "msg1",
            senderId: "user1",
            senderName: "Demo Client",
            recipientId: currentUser?.id || "vendor1",
            content: "Hello, I'm interested in your wedding photography services.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            isRead: true
          },
          {
            id: "msg2",
            senderId: currentUser?.id || "vendor1",
            senderName: currentUser?.name || "Elegant Moments Photography",
            recipientId: "user1",
            content: "Thank you for your interest! We'd love to capture your special day. When is your wedding date?",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            isRead: true
          },
          {
            id: "msg3",
            senderId: currentUser?.id || "vendor1",
            senderName: currentUser?.name || "Elegant Moments Photography",
            recipientId: "user1",
            content: "Looking forward to discussing your wedding photography!",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isRead: true
          }
        ];
      } else if (threadId === "thread4") {
        sampleMessages = [
          {
            id: "msg8",
            senderId: "user2",
            senderName: "Jane Smith",
            recipientId: currentUser?.id || "vendor1",
            content: "Do you have availability for an engagement photoshoot next month?",
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            isRead: false
          }
        ];
      } else if (threadId === "thread5") {
        sampleMessages = [
          {
            id: "msg9",
            senderId: "user3",
            senderName: "Michael Johnson",
            recipientId: currentUser?.id || "vendor1",
            content: "Could you provide a quote for a 6-hour wedding photography package?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
            isRead: true
          },
          {
            id: "msg10",
            senderId: currentUser?.id || "vendor1",
            senderName: currentUser?.name || "Elegant Moments Photography",
            recipientId: "user3",
            content: "I've sent over the detailed pricing for our 6-hour package. Let me know if you have any questions!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
            isRead: true
          },
          {
            id: "msg11",
            senderId: "user3",
            senderName: "Michael Johnson",
            recipientId: currentUser?.id || "vendor1",
            content: "Thanks for the quote. We'll get back to you soon.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            isRead: true
          }
        ];
      }
      
      setSelectedThread({
        threadId,
        participantId,
        participantName,
        messages: sampleMessages
      });

      // Mark messages as read
      if (threadId) {
        setThreads(prevThreads => 
          prevThreads.map(thread => 
            thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
          )
        );
      }
    } catch (error) {
      toast({
        title: "Failed to load conversation",
        description: "There was a problem loading this conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <VendorLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Client Messages</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p>Loading messages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
            <div className="md:col-span-1">
              <MessageList 
                threads={threads}
                onSelectThread={handleSelectThread}
                selectedThreadId={selectedThread?.threadId}
              />
            </div>
            <div className="md:col-span-2 h-full">
              {selectedThread ? (
                <MessageThread
                  threadId={selectedThread.threadId}
                  recipientId={selectedThread.participantId}
                  recipientName={selectedThread.participantName}
                  currentUserId={currentUser?.id || "vendor1"}
                  currentUserName={currentUser?.name || "Elegant Moments Photography"}
                  initialMessages={selectedThread.messages}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-1">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation from the list to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorMessages;
