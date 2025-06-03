import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("🚀 API Route called at:", new Date().toISOString())

  try {
    // Check API key first
    const apiKey = process.env.GROQ_API_KEY
    console.log("🔑 API Key check:", apiKey ? "Found ✓" : "Missing ✗")

    if (!apiKey) {
      console.error("❌ No API key found!")
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          message: "Please check your .env file and restart the server",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    if (!apiKey.startsWith("gsk_")) {
      console.error("❌ Invalid API key format")
      return new Response(
        JSON.stringify({
          error: "Invalid API key format",
          message: "API key should start with 'gsk_'",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Parse request body
    let body
    try {
      body = await req.json()
      console.log("📝 Request body parsed successfully")
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          message: "Request body must be valid JSON",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const { messages } = body
    console.log("📝 Messages received:", messages?.length || 0)

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ Invalid messages format")
      return new Response(
        JSON.stringify({
          error: "Invalid messages format",
          message: "Messages must be a non-empty array",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Create Groq client
    const groq = createGroq({
      apiKey: apiKey,
    })

    console.log("🤖 Calling AI SDK streamText with Groq...")

    // Use AI SDK streamText with Groq
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [
        {
          role: "system",
          content: "You are Lexi AI, a helpful assistant. Respond clearly and helpfully.",
        },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    console.log("✅ AI SDK streamText call successful")

    // Return the streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("❌ =================================")
    console.error("❌ UNEXPECTED ERROR:")
    console.error("❌ =================================")
    console.error("- Error type:", error?.constructor?.name)
    console.error("- Error message:", error instanceof Error ? error.message : error)
    console.error("- Error stack:", error instanceof Error ? error.stack : "No stack")

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

