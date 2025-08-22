import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import SocketManager from '@/lib/socket'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  type: 'text' | 'image' | 'file'
  roomId: string
}

interface TypingUser {
  id: string
  name: string
}

export function useChat(roomId: string) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])

  const socketManager = SocketManager.getInstance()

  useEffect(() => {
    if (!session?.user || !roomId) return

    // Connect to socket
    const socket = socketManager.connect(session.user.id)
    
    socket.on('connect', () => {
      setIsConnected(true)
      socketManager.joinRoom(roomId)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Message handlers
    socketManager.onMessage((message: Message) => {
      setMessages(prev => [...prev, message])
    })

    socketManager.onUserJoined((user: any) => {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user])
    })

    socketManager.onUserLeft((user: any) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== user.id))
    })

    socketManager.onTyping((data: { userId: string, userName: string, isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u.id !== data.userId), { id: data.userId, name: data.userName }]
        } else {
          return prev.filter(u => u.id !== data.userId)
        }
      })
    })

    // Load chat history
    loadChatHistory()

    return () => {
      socketManager.leaveRoom(roomId)
      socketManager.disconnect()
    }
  }, [session, roomId])

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/${roomId}/messages`)
      if (response.ok) {
        const history = await response.json()
        setMessages(history)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!session?.user || !content.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: {
        id: session.user.id,
        name: session.user.name || 'Anonymous',
        avatar: session.user.image
      },
      timestamp: new Date(),
      type,
      roomId
    }

    // Optimistic update
    setMessages(prev => [...prev, message])

    // Send via socket
    socketManager.sendMessage(roomId, message)

    // Save to database
    try {
      await fetch(`/api/chat/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }, [session, roomId])

  const startTyping = useCallback(() => {
    socketManager.startTyping(roomId)
  }, [roomId])

  const stopTyping = useCallback(() => {
    socketManager.stopTyping(roomId)
  }, [roomId])

  return {
    messages,
    typingUsers,
    onlineUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping
  }
}
