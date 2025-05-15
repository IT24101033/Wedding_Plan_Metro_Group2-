import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MessageThreadSummary {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageListProps {
  threads: MessageThreadSummary[];
  onSelectThread: (threadId: string, participantId: string, participantName: string) => void;
  selectedThreadId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  threads,
  onSelectThread,
  selectedThreadId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredThreads = threads.filter(thread => 
    thread.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show complete date
    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        {filteredThreads.length > 0 ? (
          <ul className="divide-y">
            {filteredThreads.map(thread => (
              <li 
                key={thread.id}
                onClick={() => onSelectThread(thread.id, thread.participantId, thread.participantName)}
                className={cn(
                  "p-3 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedThreadId === thread.id && "bg-muted"
                )}
              >
                <div className="rounded-full bg-muted-foreground/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{thread.participantName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(thread.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {thread.lastMessage}
                  </p>
                </div>
                {thread.unreadCount > 0 && (
                  <Badge variant="default" className="rounded-full px-2">
                    {thread.unreadCount}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "No conversations match your search" : "No conversations yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
