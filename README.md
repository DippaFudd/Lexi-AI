# 🤖 Lexi AI - Advanced AI Chatbot

An intelligent AI assistant with Matrix-style visual effects, featuring both modern chat and terminal interfaces. Lexi AI can answer questions on virtually any topic known to humanity.

## Screenshots
![Image Alt](https://github.com/DippaFudd/Lexi-AI/blob/f37e9dd525e8b7ad7e3767b26c16ac1de7fea03c/lexi%20ai%20pic.png)

## Reminder
The live website is just for preview but in order to get AI repsonse the program to be ran locally.

## ✨ Features

### 🧠 **AI Capabilities**
- Powered by **Groq's Llama 3.1 70B** model (FREE!)
- Lightning-fast inference speeds
- Comprehensive knowledge across all domains
- Real-time streaming responses
- Intelligent conversation handling

### 🎨 **Dual Interface Modes**
- **Chat Mode**: Modern, user-friendly interface with chat bubbles
- **Terminal Mode**: Authentic command-line interface experience

### 🌧️ **Matrix Visual Effects**
- Animated purple digital rain background
- Matrix-style aesthetics
- Smooth canvas-based animations
- Fully responsive design

### ⌨️ **Terminal Features**
- Command history with arrow key navigation
- Authentic terminal styling and prompts
- Real-time timestamps
- Processing indicators

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Free Groq API key**

### 1. **Clone the Project**
\`\`\`bash
git clone <repo>
cd Lexi-AI
\`\`\`

### 2. **Install Dependencies**
\`\`\`bash
pnpm install
\`\`\`

### 3. **Set Up Environment Variables**
Create a `.env` file in the **root directory** (same level as `package.json`):

\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

### 4. **Get Your FREE Groq API Key**
1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up (no credit card required!)
3. Go to "API Keys" → "Create API Key"
4. Copy the key (starts with `gsk_`)
5. Paste it in your `.env` file

### 5. **Start the Development Server**
\`\`\`bash
pnpm run dev
\`\`\`

### 6. **Open Your Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **AI Provider**: Groq (Free!)
- **AI SDK**: Vercel AI SDK
- **Model**: Llama 3.1 70B Versatile
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Canvas-based Matrix rain
- **Language**: TypeScript

---

## 📁 Project Structure

\`\`\`
Lexi-AI/
├── .env                    # Environment variables (create this!)
├── package.json            # Dependencies
├── app/
│   ├── api/chat/route.ts   # AI chat API endpoint
│   ├── page.tsx            # Main application
│   └── layout.tsx          # Root layout
├── components/ui/          # shadcn/ui components
└── README.md              # This file
\`\`\`

---

## 🔧 Configuration

### Available Groq Models
You can change the model in `app/api/chat/route.ts`:

\`\`\`typescript
// Fast and capable (recommended)
model: groq("llama-3.1-70b-versatile")

// Faster responses, smaller model
model: groq("llama-3.1-8b-instant")

// Alternative high-quality model
model: groq("mixtral-8x7b-32768")
\`\`\`

### Customization Options
- **Colors**: Modify purple theme in `app/page.tsx`
- **Matrix Rain**: Adjust animation speed/density
- **System Prompt**: Customize AI personality in API route
- **Interface**: Toggle between chat and terminal modes

---

## 🚨 Troubleshooting

### ❌ "GROQ_API_KEY is not set"
1. **Check file name**: Must be exactly `.env` (with dot)
2. **Check location**: Must be in root directory (same level as `package.json`)
3. **Check format**: `GROQ_API_KEY=your_key_here` (no spaces around =)
4. **Restart server**: Always restart after changing `.env`
5. **Check key**: Should start with `gsk_`

### ❌ AI Not Responding
1. **Check console**: Look for "Key found ✓" message
2. **Verify API key**: Log into Groq console to confirm key is valid
3. **Check network**: Ensure internet connection is stable
4. **Clear cache**: Delete `.next` folder and restart

### ❌ Build Errors
\`\`\`bash
# Clear build cache
rm -rf .next
# or on Windows:
rd /s /q .next

# Reinstall dependencies
pnpm install --force

# Restart development server
pnpm run dev
\`\`\`

### ❌ Version Conflicts
If you encounter dependency issues, ensure you're using compatible versions:
\`\`\`bash
pnpm install react@18 react-dom@18 next@13
\`\`\`

---

## 🎯 Usage Examples

### Chat Mode
- Click "Chat Mode" for modern interface
- Type questions in the input field
- Enjoy real-time streaming responses
- Use example questions to get started

### Terminal Mode
- Click "Terminal Mode" for command-line experience
- Type after the `$` prompt
- Use ↑/↓ arrows for command history
- Experience authentic terminal interactions

### Example Questions
- "What is quantum computing?"
- "Explain the history of the Roman Empire"
- "How does machine learning work?"
- "What are the latest developments in AI?"

---

## 💰 Why Groq for Portfolios?

| Feature | Groq | OpenAI | Others |
|---------|------|--------|--------|
| **Cost** | 🆓 FREE | 💳 Paid | 💳 Varies |
| **Speed** | ⚡ Ultra Fast | 🐌 Moderate | 🐌 Varies |
| **Setup** | ✅ Easy | ✅ Easy | ❓ Complex |
| **Quality** | 🏆 Excellent | 🏆 Excellent | ❓ Varies |


---

## 🌟 Features Roadmap

- [ ] Voice input/output capabilities
- [ ] Conversation memory and history
- [ ] Multiple model selection UI
- [ ] File upload and analysis
- [ ] Multi-language support
- [ ] Custom themes and color schemes
- [ ] Mobile app version

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add `GROQ_API_KEY` to Vercel environment variables
4. Deploy!

### Environment Variables in Production
Make sure to add your `GROQ_API_KEY` to your deployment platform's environment variables.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📞 Support

If you encounter issues:
1. Check this README's troubleshooting section
2. Look at browser/terminal console for errors
3. Verify your `.env` file setup
4. Ensure your Groq API key is valid

