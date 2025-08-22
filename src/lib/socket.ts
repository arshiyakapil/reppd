// Real-time Socket.IO client setup
import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private static instance: SocketManager

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  connect(userId: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    
    this.socket = io(socketUrl, {
      auth: {
        userId
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('🔗 Connected to chat server')
    })

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from chat server')
    })

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  // Chat room methods
  joinRoom(roomId: string): void {
    this.socket?.emit('join_room', roomId)
  }

  leaveRoom(roomId: string): void {
    this.socket?.emit('leave_room', roomId)
  }

  sendMessage(roomId: string, message: any): void {
    this.socket?.emit('send_message', { roomId, message })
  }

  // Event listeners
  onMessage(callback: (message: any) => void): void {
    this.socket?.on('new_message', callback)
  }

  onUserJoined(callback: (user: any) => void): void {
    this.socket?.on('user_joined', callback)
  }

  onUserLeft(callback: (user: any) => void): void {
    this.socket?.on('user_left', callback)
  }

  onTyping(callback: (data: any) => void): void {
    this.socket?.on('user_typing', callback)
  }

  // Typing indicators
  startTyping(roomId: string): void {
    this.socket?.emit('typing_start', roomId)
  }

  stopTyping(roomId: string): void {
    this.socket?.emit('typing_stop', roomId)
  }
}

export default SocketManager
