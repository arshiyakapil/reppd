const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
const httpServer = createServer(app)

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Store active users and rooms
const activeUsers = new Map()
const roomUsers = new Map()

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`)

  // Handle user authentication
  socket.on('authenticate', (userData) => {
    activeUsers.set(socket.id, {
      id: userData.userId,
      name: userData.name,
      avatar: userData.avatar,
      socketId: socket.id
    })
    console.log(`✅ User authenticated: ${userData.name}`)
  })

  // Handle joining rooms
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    
    const user = activeUsers.get(socket.id)
    if (user) {
      // Add user to room
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set())
      }
      roomUsers.get(roomId).add(user)

      // Notify others in room
      socket.to(roomId).emit('user_joined', user)
      
      // Send current room users to the joining user
      const currentUsers = Array.from(roomUsers.get(roomId))
      socket.emit('room_users', currentUsers)
      
      console.log(`👥 ${user.name} joined room: ${roomId}`)
    }
  })

  // Handle leaving rooms
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId)
    
    const user = activeUsers.get(socket.id)
    if (user && roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(user)
      socket.to(roomId).emit('user_left', user)
      console.log(`👋 ${user.name} left room: ${roomId}`)
    }
  })

  // Handle sending messages
  socket.on('send_message', (data) => {
    const { roomId, message } = data
    const user = activeUsers.get(socket.id)
    
    if (user) {
      const messageData = {
        ...message,
        id: `${Date.now()}-${socket.id}`,
        timestamp: new Date(),
        sender: user
      }

      // Broadcast to all users in the room
      io.to(roomId).emit('new_message', messageData)
      console.log(`💬 Message sent in ${roomId} by ${user.name}`)
    }
  })

  // Handle typing indicators
  socket.on('typing_start', (roomId) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      socket.to(roomId).emit('user_typing', {
        userId: user.id,
        userName: user.name,
        isTyping: true
      })
    }
  })

  socket.on('typing_stop', (roomId) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      socket.to(roomId).emit('user_typing', {
        userId: user.id,
        userName: user.name,
        isTyping: false
      })
    }
  })

  // Handle private messages
  socket.on('private_message', (data) => {
    const { recipientId, message } = data
    const sender = activeUsers.get(socket.id)
    
    if (sender) {
      // Find recipient's socket
      const recipient = Array.from(activeUsers.values()).find(user => user.id === recipientId)
      
      if (recipient) {
        const messageData = {
          id: `${Date.now()}-${socket.id}`,
          content: message,
          sender,
          timestamp: new Date(),
          type: 'private'
        }

        // Send to recipient
        io.to(recipient.socketId).emit('private_message', messageData)
        
        // Send back to sender for confirmation
        socket.emit('private_message_sent', messageData)
        
        console.log(`📩 Private message from ${sender.name} to ${recipient.name}`)
      }
    }
  })

  // Handle file sharing
  socket.on('share_file', (data) => {
    const { roomId, fileData } = data
    const user = activeUsers.get(socket.id)
    
    if (user) {
      const messageData = {
        id: `${Date.now()}-${socket.id}`,
        type: 'file',
        fileData,
        sender: user,
        timestamp: new Date()
      }

      io.to(roomId).emit('new_message', messageData)
      console.log(`📎 File shared in ${roomId} by ${user.name}`)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id)
    
    if (user) {
      // Remove user from all rooms
      roomUsers.forEach((users, roomId) => {
        if (users.has(user)) {
          users.delete(user)
          socket.to(roomId).emit('user_left', user)
        }
      })

      activeUsers.delete(socket.id)
      console.log(`🔌 User disconnected: ${user.name}`)
    }
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error)
  })
})

// REST API endpoints for chat history
app.get('/api/chat/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params
    const { page = 1, limit = 50 } = req.query

    // In production, fetch from database
    // For now, return empty array
    res.json([])
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

app.post('/api/chat/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params
    const message = req.body

    // In production, save to database
    console.log(`💾 Saving message to database for room ${roomId}`)
    
    res.json({ success: true, messageId: message.id })
  } catch (error) {
    console.error('Error saving message:', error)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeUsers: activeUsers.size,
    activeRooms: roomUsers.size
  })
})

// Start server
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`)
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
