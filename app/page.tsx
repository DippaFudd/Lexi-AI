"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Terminal, MessageSquare } from "lucide-react"

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?"
    const charArray = chars.split("")

    const fontSize = 14
    const columns = Math.ceil(canvas.width / fontSize) + 1

    // Array to store y position of each column
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize)
    }

    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Purple text
      ctx.fillStyle = "#A0F"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < columns; i++) {
        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)]

        // Draw character - ensure x position doesn't exceed canvas width
        const xPos = i * fontSize
        if (xPos < canvas.width) {
          ctx.fillStyle = i % 3 === 0 ? "#A0F" : i % 2 === 0 ? "#80A" : "#507"
          ctx.fillText(text, xPos, drops[i] * fontSize)
        }

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    const handleResize = () => {
      resizeCanvas()
      // Reinitialize drops array for new column count
      const newColumns = Math.ceil(canvas.width / fontSize) + 1
      drops.length = 0
      for (let i = 0; i < newColumns; i++) {
        drops[i] = Math.floor((Math.random() * canvas.height) / fontSize)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "linear-gradient(to bottom, #000, #100110)" }}
    />
  )
}

const ChatInterface = () => {
  // Simplified useChat implementation
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
      setErrorMessage(error.message || "An error occurred while communicating with the AI")
    } else {
      setErrorMessage(null)
    }
  }, [error])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Log messages for debugging
  useEffect(() => {
    console.log("Current messages:", messages)
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    console.log("Submitting message:", input)
    handleSubmit(e)
  }

  const handleExampleClick = (question: string) => {
    if (isLoading) return
    console.log("Example clicked:", question)

    // Set input value
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)

    // Submit after a short delay
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }, 100)
  }

  const exampleQuestions = [
    "What is quantum computing?",
    "Explain the history of the Roman Empire",
    "How does photosynthesis work?",
    "What are the principles of machine learning?",
  ]

  return (
    <Card className="shadow-2xl border border-purple-500/20 bg-black/80 backdrop-blur-md">
      <CardHeader className="border-b border-purple-500/20 bg-gradient-to-r from-purple-900/50 to-violet-900/50">
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Bot className="w-5 h-5 text-purple-400" />
          Chat with Lexi AI
          <span className="text-xs text-purple-300 ml-2">(llama-3.1-8b-instant)</span>
          <div className="ml-auto">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/test")
                  const result = await response.json()
                  console.log("Test result:", result)
                  alert(result.success ? "✅ API Test Passed!" : "❌ API Test Failed: " + result.error)
                } catch (error) {
                  console.error("Test error:", error)
                  alert("❌ Test failed: " + (error instanceof Error ? error.message : "Unknown error"))
                }
              }}
              size="sm"
              variant="outline"
              className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
            >
              Test API
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {errorMessage && (
        <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
          <div className="text-red-200 text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-100 mb-2">Welcome to Lexi AI!</h3>
              <p className="text-purple-200 mb-2">
                Ask me anything - from science and history to technology and philosophy.
              </p>
              <p className="text-purple-300 text-sm mb-6">Powered by Llama 3.1 8B Instant via Groq</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    disabled={isLoading}
                    className="text-left h-auto p-3 text-sm bg-purple-900/30 border-purple-500/30 text-purple-100 hover:bg-purple-800/40 hover:border-purple-400/50 disabled:opacity-50"
                    onClick={() => handleExampleClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25">
                      <AvatarFallback className="text-white text-sm">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25"
                        : "bg-gray-900/80 text-purple-100 border border-purple-500/20"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content || "..."}</div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 bg-gray-700 shadow-lg">
                      <AvatarFallback className="text-white text-sm">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25">
                    <AvatarFallback className="text-white text-sm">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-900/80 border border-purple-500/20 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Form */}
        <div className="border-t border-purple-500/20 bg-gray-900/50 p-4">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={isLoading ? "Lexi AI is thinking..." : "Ask Lexi AI anything..."}
              className="flex-1 bg-gray-900/80 border-purple-500/30 text-purple-100 placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

const TerminalInterface = () => {
  // Simplified useChat implementation
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Terminal chat error:", error)
      setErrorMessage(error.message || "An error occurred while communicating with the AI")
    } else {
      setErrorMessage(null)
    }
  }, [error])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Log messages for debugging
  useEffect(() => {
    console.log("Terminal messages:", messages)
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    console.log("Terminal submitting:", input)
    setCommandHistory((prev) => [...prev, input])
    setHistoryIndex(-1)
    handleSubmit(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        handleInputChange({
          target: { value: commandHistory[newIndex] },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          handleInputChange({
            target: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>)
        } else {
          setHistoryIndex(newIndex)
          handleInputChange({
            target: { value: commandHistory[newIndex] },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      }
    }
  }

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString("en-US", { hour12: false })
  }

  return (
    <div className="h-[600px] bg-black/95 border border-purple-500/30 rounded-lg font-mono text-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-900/80 border-b border-purple-500/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        </div>
        <span className="text-purple-400 ml-4">LEXI-AI Terminal v2.1.0</span>
        <span className="text-purple-300 text-xs ml-2">(llama-3.1-8b-instant)</span>
      </div>

      {errorMessage && (
        <div className="mx-4 mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
          <div className="text-red-200 text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Terminal Content */}
      <div ref={terminalRef} className="h-full overflow-y-auto p-4 pb-20">
        {/* Welcome Message */}
        <div className="text-purple-400 mb-4">
          <div>Last login: {formatTimestamp()} on ttys001</div>
          <div className="mt-2">╔══════════════════════════════════════════════════════════════╗</div>
          <div>║ LEXI AI TERMINAL ║</div>
          <div>║ Advanced AI Assistant v2.1 ║</div>
          <div>║ Powered by Llama 3.1 8B Instant ║</div>
          <div>║ Type your questions after the prompt ║</div>
          <div>╚══════════════════════════════════════════════════════════════╝</div>
          <div className="mt-2 text-purple-300">System initialized. Neural networks online. Ready for queries.</div>
        </div>

        {/* Messages */}
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            {message.role === "user" ? (
              <div className="text-purple-400">
                <span className="text-purple-500">user@lexi-ai</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~/lexi-ai</span>
                <span className="text-white">$ </span>
                <span className="text-purple-300">{message.content}</span>
              </div>
            ) : (
              <div className="mt-2">
                <div className="text-purple-300 mb-1">[LEXI-AI@{formatTimestamp()}] Processing query...</div>
                <div className="text-purple-200 whitespace-pre-wrap pl-4 border-l-2 border-purple-500/30">
                  {message.content || "..."}
                </div>
                <div className="text-purple-500 mt-1">└─ Query processed successfully</div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-purple-300 mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin">⟳</div>
              <span>[LEXI-AI] Processing neural pathways...</span>
            </div>
          </div>
        )}

        {/* Current prompt */}
        <form onSubmit={onSubmit} className="flex items-center">
          <div className="text-purple-500">user@lexi-ai</div>
          <div className="text-white">:</div>
          <div className="text-blue-400">~/lexi-ai</div>
          <div className="text-white">$ </div>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-purple-300 outline-none font-mono"
            placeholder={isLoading ? "Processing..." : "Enter your question..."}
            disabled={isLoading}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  )
}

export default function LexAI() {
  const [isTerminalMode, setIsTerminalMode] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/20 z-10 pointer-events-none" />

      <div className="relative z-20 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full shadow-lg shadow-purple-500/25">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent drop-shadow-lg">
              Lexi AI
            </h1>
          </div>
          <p className="text-purple-100 text-lg font-medium drop-shadow-md">
            Your intelligent assistant for any question known to humanity
          </p>
          <p className="text-purple-300 text-sm mt-2">Powered by Llama 3.1 8B Instant via Groq</p>

          {/* Interface Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={() => setIsTerminalMode(false)}
              variant={!isTerminalMode ? "default" : "outline"}
              className={`${
                !isTerminalMode
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                  : "border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat Mode
            </Button>
            <Button
              onClick={() => setIsTerminalMode(true)}
              variant={isTerminalMode ? "default" : "outline"}
              className={`${
                isTerminalMode
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                  : "border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
              }`}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Terminal Mode
            </Button>
          </div>
        </div>

        {/* Interface */}
        {isTerminalMode ? <TerminalInterface /> : <ChatInterface />}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-purple-200/80">
          <p>Lexi AI is powered by advanced language models and strives to provide accurate, helpful information.</p>
        </div>
      </div>
    </div>
  )
}
