import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function GET() {
  console.log("🧪 Test endpoint called")

  try {
    const apiKey = process.env.GROQ_API_KEY
    console.log("🔑 API Key test:")
    console.log("- Exists:", !!apiKey)
    console.log("- Length:", apiKey?.length || 0)
    console.log("- Starts with gsk_:", apiKey?.startsWith("gsk_") || false)

    if (!apiKey) {
      return Response.json({
        success: false,
        error: "No API key found",
        env_keys: Object.keys(process.env).filter((key) => key.includes("GROQ")),
      })
    }

    if (!apiKey.startsWith("gsk_")) {
      return Response.json({
        success: false,
        error: "Invalid API key format",
        key_preview: apiKey.substring(0, 10),
      })
    }

    console.log("🧪 Testing AI SDK with Groq...")

    // Create Groq client
    const groq = createGroq({
      apiKey: apiKey,
    })

    // Test with AI SDK
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: 'Say "Hello, this is a test!" and nothing else.',
      maxTokens: 50,
    })

    console.log("✅ Test successful!")

    return Response.json({
      success: true,
      message: "API key and Groq connection working!",
      model_used: "llama-3.1-8b-instant",
      test_response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Test error:", error)
    return Response.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
