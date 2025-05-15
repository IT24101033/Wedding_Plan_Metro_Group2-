
import React, { useState, useEffect } from 'react';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageThread } from '@/components/messaging/MessageThread';
import UserLayout from '@/components/layouts/UserLayout';
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

const UserMessages = () => {
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
            participantId: "vendor1",
            participantName: "Elegant Moments Photography",
            lastMessage: "Looking forward to discussing your wedding photography!",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            unreadCount: 2
          },
          {
            id: "thread2",
            participantId: "vendor2",
            participantName: "Royal Garden Venue",
            lastMessage: "We have your date available. Would you like to schedule a visit?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
            unreadCount: 0
          },
          {
            id: "thread3",
            participantId: "vendor3",
            participantName: "Divine Cuisine Catering",
            lastMessage: "Here's the sample menu as requested. Let me know what you think!",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            unreadCount: 1
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
            senderId: currentUser?.id || "user1",
            senderName: currentUser?.name || "Demo Client",
            recipientId: "vendor1",
            content: "Hello, I'm interested in your wedding photography services.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            isRead: true
          },
          {
            id: "msg2",
            senderId: "vendor1",
            senderName: "Elegant Moments Photography",
            recipientId: currentUser?.id || "user1",
            content: "Thank you for your interest! We'd love to capture your special day. When is your wedding date?",
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            isRead: true
          },
          {
            id: "msg3",
            senderId: "vendor1",
            senderName: "Elegant Moments Photography",
            recipientId: currentUser?.id || "user1",
            content: "Looking forward to discussing your wedding photography!",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isRead: false
          }
        ];
      } else if (threadId === "thread2") {
        sampleMessages = [
          {
            id: "msg4",
            senderId: currentUser?.id || "user1",
            senderName: currentUser?.name || "Demo Client",
            recipientId: "vendor2",
            content: "Hi, we're looking for a venue for our wedding on October 15th. Do you have availability?",
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            isRead: true
          },
          {
            id: "msg5",
            senderId: "vendor2",
            senderName: "Royal Garden Venue",
            recipientId: currentUser?.id || "user1",
            content: "We have your date available. Would you like to schedule a visit?",
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            isRead: true
          }
        ];
      } else if (threadId === "thread3") {
        sampleMessages = [
          {
            id: "msg6",
            senderId: currentUser?.id || "user1",
            senderName: currentUser?.name || "Demo Client",
            recipientId: "vendor3",
            content: "Could you share some sample menus for a 100-person wedding?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
            isRead: true
          },
          {
            id: "msg7",
            senderId: "vendor3",
            senderName: "Divine Cuisine Catering",
            recipientId: currentUser?.id || "user1",
            content: "Here's the sample menu as requested. Let me know what you think!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            isRead: false
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
    <UserLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
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
                  currentUserId={currentUser?.id || "user1"}
                  currentUserName={currentUser?.name || "Demo Client"}
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
    </UserLayout>
  );
};

export default UserMessages;
