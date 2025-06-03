"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      console.log("🧪 Starting connection test...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Hello, this is a connection test. Please respond with 'Connection successful!'",
            },
          ],
        }),
      })

      console.log("📡 Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error response:", errorText)

        try {
          const errorJson = JSON.parse(errorText)
          setTestResult({
            success: false,
            status: response.status,
            error: errorJson,
            rawResponse: errorText,
          })
        } catch {
          setTestResult({
            success: false,
            status: response.status,
            error: errorText,
            rawResponse: errorText,
          })
        }
        return
      }

      // Try to read the streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        setTestResult({
          success: false,
          error: "No response body reader available",
        })
        return
      }

      const chunks = []
      let fullResponse = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          chunks.push(chunk)
          fullResponse += chunk
          console.log("📦 Received chunk:", chunk)
        }

        setTestResult({
          success: true,
          status: response.status,
          chunks: chunks,
          fullResponse: fullResponse,
          chunkCount: chunks.length,
        })

        console.log("✅ Connection test successful!")
      } catch (streamError) {
        console.error("❌ Stream reading error:", streamError)
        setTestResult({
          success: false,
          error: "Failed to read stream",
          details: streamError instanceof Error ? streamError.message : streamError,
        })
      }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      setTestResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">🧪 Lexi AI Debug Console</h1>

        <Card className="bg-gray-900 border-purple-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-purple-300">Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? "Testing..." : "Test API Connection"}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Card className="bg-gray-900 border-purple-500/30">
            <CardHeader>
              <CardTitle className={`${testResult.success ? "text-green-400" : "text-red-400"}`}>
                {testResult.success ? "✅ Test Results" : "❌ Test Results"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-black p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gray-900 border-purple-500/30 mt-6">
          <CardHeader>
            <CardTitle className="text-purple-300">Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Current URL:</strong> {typeof window !== "undefined" ? window.location.href : "N/A"}
              </div>
              <div>
                <strong>User Agent:</strong> {typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
              </div>
              <div>
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Click "Test API Connection" above</li>
                  <li>Check the browser console (F12) for detailed logs</li>
                  <li>Check your terminal/server logs for API route logs</li>
                  <li>Look for any error messages in the test results</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
