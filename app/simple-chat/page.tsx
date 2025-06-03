"use client"

import { useChat } from "ai/react"
import { useState, useEffect } from "react"

export default function SimpleChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
      setErrorMessage(error.message || "An error occurred while communicating with the AI")
    } else {
      setErrorMessage(null)
    }
  }, [error])

  // Debug logging
  useEffect(() => {
    console.log("Messages updated:", messages)
  }, [messages])

  const testMessage = () => {
    handleInputChange({ target: { value: "Hello, can you respond to me?" } } as any)
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">Lexi AI - Simple Chat Test</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-900 border border-red-500 rounded-lg">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <button onClick={testMessage} className="px-4 py-2 bg-green-600 rounded mr-2" disabled={isLoading}>
          Test Message
        </button>
        <span className="text-sm text-gray-400">
          Messages: {messages.length} | Loading: {isLoading ? "Yes" : "No"}
        </span>
      </div>

      <div className="mb-4 p-4 bg-gray-900 rounded-lg max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-400">No messages yet. Click "Test Message" or type something below.</div>
        ) : (
          messages.map((message, i) => (
            <div key={i} className={`mb-3 p-3 rounded-lg ${message.role === "user" ? "bg-purple-900" : "bg-gray-800"}`}>
              <div className="font-bold text-sm mb-1">{message.role === "user" ? "👤 You:" : "🤖 Lexi AI:"}</div>
              <div className="whitespace-pre-wrap">{message.content || "(Empty message)"}</div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="mb-3 p-3 rounded-lg bg-gray-800">
            <div className="font-bold text-sm mb-1">🤖 Lexi AI:</div>
            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask Lexi AI anything..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-purple-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-600 rounded disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-400 space-y-1">
        <p>
          <strong>Debug Info:</strong>
        </p>
        <p>• Total Messages: {messages.length}</p>
        <p>• User Messages: {messages.filter((m) => m.role === "user").length}</p>
        <p>• AI Messages: {messages.filter((m) => m.role === "assistant").length}</p>
        <p>• Currently Loading: {isLoading ? "Yes" : "No"}</p>
        <p>• Has Error: {error ? "Yes" : "No"}</p>
      </div>
    </div>
  )
}
