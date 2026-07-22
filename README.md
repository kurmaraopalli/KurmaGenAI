# KurmaAI

KurmaAI is a fully client-side, browser-based Generative AI application hosted entirely as a static site on GitHub Pages. It does not use any server-side infrastructure, external cloud APIs (like OpenAI), or third-party wrappers. All AI inference is executed locally inside the user's browser using WebGPU and WebAssembly.

---

## 🛠️ Instructions for Devin (AI Engineer)

Devin, please follow these explicit instructions to initialize, develop, and verify this repository.

### 1. Project Initialization
- Create a clean `index.html` file in the root directory.
- Use Semantic HTML5 and modern vanilla CSS grid/flexbox for a clean, responsive "chat messenger" interface.
- Ensure the application requires **zero npm installation or build steps** by importing dependencies directly via reliable CDNs (e.g., `esm.run`).

### 2. Implementation Specs
- **Core Engine:** Implement `@mlc-ai/web-llm` via ESM modules.
- **Model Choice:** Use `Phi-3-mini-4k-instruct-q4f16_1-MLC` (or any modern, equivalent lightweight model under 3GB optimized for browser execution).
- **UX Requirements:**
  - Display a real-time progress bar or text indicator tracking the model downloading/loading status using the `initProgressCallback` hook.
  - Keep the chat input and send button strictly disabled until the model is 100% ready.
  - Implement a scrolling chat viewport that automatically sticks to the bottom when new tokens/messages arrive.
  - Gracefully catch and display errors if the host browser lacks WebGPU support (e.g., provide a fallback message advising the user to use Chrome/Edge).

### 3. Verification Criteria
- Parse the JavaScript code to ensure no external API keys (`sk-...`) or backend endpoints are referenced.
- Confirm all assets and scripts use relative paths or CDN links so that the repository can be served seamlessly as a flat static site.

---

## 🏗️ Code Architecture Blueprint

Devin, you can use the following blueprint as the baseline implementation for `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KurmaAI - Local Browser Engine</title>
    <style>
        :root {
            --bg-color: #131415;
            --chat-bg: #1e1f22;
            --text-color: #e3e6e8;
            --primary: #3578e5;
            --border: #2b2d31;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }
        h1 { font-size: 1.5rem; margin-bottom: 5px; text-align: center; }
        #status-container {
            background: var(--chat-bg);
            border: 1px solid var(--border);
            padding: 10px;
            border-radius: 8px;
            font-size: 0.85rem;
            margin-bottom: 15px;
            color: #b5bac1;
        }
        #chatbox {
            flex: 1;
            background: var(--chat-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 15px;
            overflow-y: auto;
            margin-bottom: 15px;
        }
        .msg { margin-bottom: 15px; line-height: 1.5; }
        .user-msg { color: #58a6ff; }
        .ai-msg { color: #8b949e; }
        .input-area { display: flex; gap: 10px; }
        textarea {
            flex: 1;
            background: #2b2d31;
            border: 1px solid var(--border);
            color: var(--text-color);
            padding: 10px;
            border-radius: 6px;
            resize: none;
            height: 50px;
        }
        button {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        button:disabled, textarea:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>

    <h1>🐢 KurmaAI</h1>
    <div id="status-container">Initializing initialization vectors...</div>
    
    <div id="chatbox"></div>
    
    <div class="input-area">
        <textarea id="userInput" placeholder="Ask KurmaAI something..." disabled></textarea>
        <button id="sendBtn" onclick="askAI()" disabled>Send</button>
    </div>

    <script type="module">
        import * as webllm from "https://esm.run";

        const selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
        let engine;

        async function initApp() {
            const statusDiv = document.getElementById("status-container");
            try {
                engine = await webllm.CreateEngine(selectedModel, {
                    initProgressCallback: (report) => {
                        statusDiv.innerText = `System Status: ${report.text}`;
                    }
                });
                statusDiv.innerText = "System Status: KurmaAI Engine Active (100% Local)";
                document.getElementById("userInput").disabled = false;
                document.getElementById("sendBtn").disabled = false;
            } catch (error) {
                statusDiv.innerHTML = "❌ Error: WebGPU execution failed. Ensure you are using a modern browser (Chrome/Edge) with hardware acceleration enabled.";
                console.error(error);
            }
        }

        window.askAI = async function() {
            const inputEl = document.getElementById("userInput");
            const input = inputEl.value.trim();
            if (!input) return;

            const chatbox = document.getElementById("chatbox");
            chatbox.innerHTML += `<div class="msg user-msg"><strong>You:</strong> ${input}</div>`;
            inputEl.value = "";

            const aiResponsePlaceholder = document.createElement("div");
            aiResponsePlaceholder.className = "msg ai-msg";
            aiResponsePlaceholder.innerHTML = "<strong>KurmaAI:</strong> 🖋️ Thinking...";
            chatbox.appendChild(aiResponsePlaceholder);
            chatbox.scrollTop = chatbox.scrollHeight;

            try {
                const messages = [{ role: "user", content: input }];
                const reply = await engine.chat.completions.create({ messages });
                
                aiResponsePlaceholder.innerHTML = `<strong>KurmaAI:</strong> ${reply.choices.message.content}`;
            } catch (err) {
                aiResponsePlaceholder.innerHTML = `<strong>KurmaAI:</strong> Error generating token response.`;
            }
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        initApp();
    </script>
</body>
</html>
```

---

## 🚀 How to Deploy (GitHub Pages)

Once Devin finishes generating the files and pushes the code to the main branch:
1. Navigate to your repository on the GitHub Web UI.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Select the branch (`main` or `master`) and folder (`/root`).
5. Click **Save**. Your site will live at `https://<your-username>.github.io/KurmaAI/`.
