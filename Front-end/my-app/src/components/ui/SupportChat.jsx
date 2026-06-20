'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { io } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupportChat() {
  const { user } = useAuth()
  const { theme } = useTheme()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(0)
  const [connected, setConnected] = useState(false)

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const joinedRef = useRef(false)

  const active = !!(user && !user.isAdmin)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  // Socket setup — only connect for eligible users
  useEffect(() => {
    if (!active) return

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      if (!joinedRef.current) {
        socket.emit('join_chat', user._id)
        joinedRef.current = true
      }
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('receive_support_message', (data) => {
      if (data.receiverId !== user._id) return
      setMessages((prev) => [...prev, { ...data, fromMe: false }])
      setUnread((prev) => (open ? 0 : prev + 1))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      joinedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, user?._id])

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
  }

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || !socketRef.current) return

    const payload = {
      receiverId: 'support',
      senderId: user._id,
      senderName: user.name,
      message: text,
    }

    socketRef.current.emit('send_support_message', payload)
    setMessages((prev) => [
      ...prev,
      { ...payload, timestamp: new Date().toISOString(), fromMe: true },
    ])
    setInput('')
  }, [input, user?._id, user?.name])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // All hooks above — safe to return null now
  if (!active) return null

  const isDark = theme === 'dark'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div
          className={`
            flex flex-col w-80 h-[420px] rounded-2xl shadow-2xl border overflow-hidden
            ${isDark
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-white border-slate-200 text-slate-900'}
          `}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0
              ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-400'}`}
              />
              <span className="text-sm font-semibold">Support Chat</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className={`p-1 rounded-lg transition-colors
                ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messages.length === 0 && (
              <p className={`text-xs text-center mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Send us a message — we&apos;re here to help!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug break-words
                    ${msg.fromMe
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : isDark
                        ? 'bg-slate-700 text-slate-100 rounded-bl-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'}
                  `}
                >
                  {!msg.fromMe && (
                    <p className="text-[10px] font-semibold mb-0.5 opacity-70">
                      {msg.senderName || 'Support'}
                    </p>
                  )}
                  <p>{msg.message}</p>
                  {msg.timestamp && (
                    <p className={`text-[10px] mt-1 opacity-60 ${msg.fromMe ? 'text-right' : ''}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`flex items-center gap-2 px-3 py-3 border-t flex-shrink-0
              ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className={`flex-1 text-sm px-3 py-2 rounded-xl outline-none transition-colors
                ${isDark
                  ? 'bg-slate-700 placeholder-slate-500 text-white border border-slate-600 focus:border-slate-400'
                  : 'bg-slate-100 placeholder-slate-400 text-slate-900 border border-transparent focus:border-slate-300'}
              `}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        className="relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}

        {/* Online dot indicator */}
        {!open && unread === 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-400 border-2 border-white" />
        )}
      </button>
    </div>
  )
}
