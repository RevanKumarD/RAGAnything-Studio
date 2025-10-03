import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  mode?: 'hybrid' | 'local' | 'global' | 'naive';
  vlmEnhanced?: boolean;
  multimodal?: boolean;
  sources?: Array<{
    type: string;
    content: string;
    relevance?: number;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  // State
  sessions: ChatSession[];
  currentSessionId: string | null;
  isStreaming: boolean;

  // Actions
  createSession: (title?: string) => ChatSession;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearSession: (id: string) => void;
  setStreaming: (streaming: boolean) => void;

  // Computed
  getCurrentSession: () => ChatSession | null;
  getRecentSessions: (limit?: number) => ChatSession[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      isStreaming: false,

      // Create new chat session
      createSession: (title = 'New Chat') => {
        const newSession: ChatSession = {
          id: `session_${Date.now()}`,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));

        return newSession;
      },

      // Delete session
      deleteSession: (id: string) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== id);
          const newCurrentId =
            state.currentSessionId === id
              ? newSessions[0]?.id || null
              : state.currentSessionId;

          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          };
        });
      },

      // Set current session
      setCurrentSession: (id: string) => {
        set({ currentSessionId: id });
      },

      // Add message to current session
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: [...session.messages, newMessage],
                updatedAt: new Date(),
                // Auto-generate title from first user message
                title:
                  session.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : session.title,
              };
            }
            return session;
          });

          return { sessions };
        });
      },

      // Update message
      updateMessage: (id: string, updates: Partial<Message>) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === id ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date(),
              };
            }
            return session;
          });

          return { sessions };
        });
      },

      // Clear session messages
      clearSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? {
                  ...session,
                  messages: [],
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      // Set streaming status
      setStreaming: (streaming: boolean) => {
        set({ isStreaming: streaming });
      },

      // Get current session
      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find((s) => s.id === currentSessionId) || null;
      },

      // Get recent sessions
      getRecentSessions: (limit = 10) => {
        const { sessions } = get();
        return [...sessions]
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'chat-store',
      // Persist all chat data
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
