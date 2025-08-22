'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Users, Wifi, WifiOff, Image, Paperclip } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface RealTimeChatProps {
  roomId: string
  roomName: string
  className?: string
}

export function RealTimeChat({ roomId, roomName, className }: RealTimeChatProps) {
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const {
    messages,
    typingUsers,
    onlineUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping
  } = useChat(roomId)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    await sendMessage(newMessage)
    setNewMessage('')
    stopTyping()
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      startTyping()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      stopTyping()
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className={`glass-morphism border-white/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-retro flex items-center gap-2">
            💬 {roomName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
            >
              {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400">
              <Users className="w-3 h-3 mr-1" />
              {onlineUsers.length}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto space-y-3 p-3 bg-black/20 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === session?.user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.sender.id === session?.user?.id
                      ? 'bg-gradient-to-r from-retro-cyan to-retro-purple text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  {message.sender.id !== session?.user?.id && (
                    <div className="text-xs text-white/60 mb-1 font-semibold">
                      {message.sender.name}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white/60 px-3 py-2 rounded-lg text-sm">
                {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="glass-morphism border-white/20 text-white placeholder:text-white/40 pr-20"
              disabled={!isConnected}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-retro-cyan to-retro-purple hover:from-retro-cyan/80 hover:to-retro-purple/80"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="text-xs text-white/60">
            <span className="font-semibold">Online:</span> {onlineUsers.map(user => user.name).join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
