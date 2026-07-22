<<<<<<< HEAD
# Kurma Gen AI

Kurma Gen AI is a fully client-side, browser-based Generative AI application hosted entirely as a static site on GitHub Pages. It does not use any server-side infrastructure, external cloud APIs (like OpenAI), or third-party wrappers. All AI inference is executed locally inside the user's browser using WebAssembly and CPU-based inference via Transformers.js.

## Features

- **100% Local AI**: Runs entirely in your browser with no server dependencies
- **Voice Input**: Built-in speech-to-text using Web Speech API
- **File Upload**: Upload documents (.txt, .pdf, .doc, .docx) for analysis
- **Multilingual Support**: Automatic language detection and response in user's language
- **Search History**: Persistent chat history stored in localStorage
- **Customizable Settings**: Theme (dark/light), font size, typing speed, sidebar toggle
- **Professional UI**: ChatGPT-inspired interface with sidebar and modern styling
- **Typewriter Effect**: Human-like text generation animation
- **Enter Key Support**: Quick message sending with Enter (Shift+Enter for new lines)

---

## 🛠️ Instructions for Devin (AI Engineer)

Devin, please follow these explicit instructions to initialize, develop, and verify this repository.

### 1. Project Initialization
- Create a clean `index.html` file in the root directory.
- Use Semantic HTML5 and modern vanilla CSS grid/flexbox for a clean, responsive "chat messenger" interface.
- Ensure the application requires **zero npm installation or build steps** by importing dependencies directly via reliable CDNs (e.g., `esm.run`).

### 2. Implementation Specs
- **Core Engine:** `@xenova/transformers` via CDN (jsdelivr)
- **Model Choice:** `Xenova/LaMini-Flan-T5-783M` (lightweight text-to-text generation model optimized for browser execution)
- **UX Features:**
  - Real-time progress indicator for model loading
  - Input disabled until model is ready
  - Auto-scrolling chat viewport
  - Voice input with recording indicator
  - File upload for document analysis
  - Persistent search history in localStorage
  - Settings modal with theme, font size, typing speed controls
  - Sidebar with search history
  - Multilingual support (Hindi, Tamil, Telugu, Chinese, Japanese, Korean, Russian, Arabic, and European languages)
  - Typewriter effect for AI responses
  - Works across all modern browsers (Chrome, Edge, Firefox, Safari) without WebGPU

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
    <title>Kurma Gen AI - Local Browser Engine</title>
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

    <h1>🐢 Kurma Gen AI</h1>
    <div id="status-container">Initializing initialization vectors...</div>
    
    <div id="chatbox"></div>
    
    <div class="input-area">
        <textarea id="userInput" placeholder="Ask Kurma Gen AI something..." disabled></textarea>
        <button id="sendBtn" onclick="askAI()" disabled>Send</button>
    </div>

    <script type="module">
        import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1";

        // Disable local model checks
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        const selectedModel = "Xenova/LaMini-Flan-T5-783M";
        let generator;

        async function initApp() {
            const statusDiv = document.getElementById("status-container");
            
            try {
                statusDiv.innerText = "System Status: Loading AI model (this may take a minute on first run)...";
                
                generator = await pipeline('text2text-generation', selectedModel, {
                    progress_callback: (progress) => {
                        if (progress.status === 'progress') {
                            const percent = progress.progress ? Math.round(progress.progress) : 0;
                            statusDiv.innerText = `System Status: Downloading model... ${percent}%`;
                        } else if (progress.status === 'done') {
                            statusDiv.innerText = "System Status: Model loaded successfully";
                        }
                    }
                });
                
                statusDiv.innerText = "System Status: Kurma Gen AI Engine Active (100% Local - CPU/WebAssembly)";
                document.getElementById("userInput").disabled = false;
                document.getElementById("sendBtn").disabled = false;
            } catch (error) {
                const errorMsg = error.message || error.toString();
                console.error("Model Error:", error);
                statusDiv.innerHTML = `❌ Error: Model initialization failed.<br><br><strong>Details:</strong> ${errorMsg}<br><br><strong>Troubleshooting:</strong><br>1. Check your internet connection<br>2. Try refreshing the page<br>3. Check browser console for more details`;
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
            aiResponsePlaceholder.innerHTML = "<strong>Kurma Gen AI:</strong> 🖋️ Thinking...";
            chatbox.appendChild(aiResponsePlaceholder);
            chatbox.scrollTop = chatbox.scrollHeight;

            try {
                const output = await generator(input, {
                    max_new_tokens: 256,
                    temperature: 0.7,
                    do_sample: true
                });
                
                aiResponsePlaceholder.innerHTML = `<strong>Kurma Gen AI:</strong> ${output[0].generated_text}`;
            } catch (err) {
                aiResponsePlaceholder.innerHTML = `<strong>Kurma Gen AI:</strong> Error generating response. ${err.message}`;
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
=======
# Kurma Gen AI

Kurma Gen AI is a fully client-side, browser-based Generative AI application hosted entirely as a static site on GitHub Pages. It does not use any server-side infrastructure, external cloud APIs (like OpenAI), or third-party wrappers. All AI inference is executed locally inside the user's browser using WebAssembly and CPU-based inference via Transformers.js.

## Features

- **100% Local AI**: Runs entirely in your browser with no server dependencies
- **Voice Input**: Built-in speech-to-text using Web Speech API
- **File Upload**: Upload documents (.txt, .pdf, .doc, .docx) for analysis
- **Multilingual Support**: Automatic language detection and response in user's language
- **Search History**: Persistent chat history stored in localStorage
- **Customizable Settings**: Theme (dark/light), font size, typing speed, sidebar toggle
- **Professional UI**: ChatGPT-inspired interface with sidebar and modern styling
- **Typewriter Effect**: Human-like text generation animation
- **Enter Key Support**: Quick message sending with Enter (Shift+Enter for new lines)

---

## 🛠️ Instructions for Devin (AI Engineer)

Devin, please follow these explicit instructions to initialize, develop, and verify this repository.

### 1. Project Initialization
- Create a clean `index.html` file in the root directory.
- Use Semantic HTML5 and modern vanilla CSS grid/flexbox for a clean, responsive "chat messenger" interface.
- Ensure the application requires **zero npm installation or build steps** by importing dependencies directly via reliable CDNs (e.g., `esm.run`).

### 2. Implementation Specs
- **Core Engine:** `@xenova/transformers` via CDN (jsdelivr)
- **Model Choice:** `Xenova/LaMini-Flan-T5-783M` (lightweight text-to-text generation model optimized for browser execution)
- **UX Features:**
  - Real-time progress indicator for model loading
  - Input disabled until model is ready
  - Auto-scrolling chat viewport
  - Voice input with recording indicator
  - File upload for document analysis
  - Persistent search history in localStorage
  - Settings modal with theme, font size, typing speed controls
  - Sidebar with search history
  - Multilingual support (Hindi, Tamil, Telugu, Chinese, Japanese, Korean, Russian, Arabic, and European languages)
  - Typewriter effect for AI responses
  - Works across all modern browsers (Chrome, Edge, Firefox, Safari) without WebGPU

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
    <title>Kurma Gen AI - Local Browser Engine</title>
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

    <h1>🐢 Kurma Gen AI</h1>
    <div id="status-container">Initializing initialization vectors...</div>
    
    <div id="chatbox"></div>
    
    <div class="input-area">
        <textarea id="userInput" placeholder="Ask Kurma Gen AI something..." disabled></textarea>
        <button id="sendBtn" onclick="askAI()" disabled>Send</button>
    </div>

    <script type="module">
        import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1";

        // Disable local model checks
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        const selectedModel = "Xenova/LaMini-Flan-T5-783M";
        let generator;

        async function initApp() {
            const statusDiv = document.getElementById("status-container");
            
            try {
                statusDiv.innerText = "System Status: Loading AI model (this may take a minute on first run)...";
                
                generator = await pipeline('text2text-generation', selectedModel, {
                    progress_callback: (progress) => {
                        if (progress.status === 'progress') {
                            const percent = progress.progress ? Math.round(progress.progress) : 0;
                            statusDiv.innerText = `System Status: Downloading model... ${percent}%`;
                        } else if (progress.status === 'done') {
                            statusDiv.innerText = "System Status: Model loaded successfully";
                        }
                    }
                });
                
                statusDiv.innerText = "System Status: Kurma Gen AI Engine Active (100% Local - CPU/WebAssembly)";
                document.getElementById("userInput").disabled = false;
                document.getElementById("sendBtn").disabled = false;
            } catch (error) {
                const errorMsg = error.message || error.toString();
                console.error("Model Error:", error);
                statusDiv.innerHTML = `❌ Error: Model initialization failed.<br><br><strong>Details:</strong> ${errorMsg}<br><br><strong>Troubleshooting:</strong><br>1. Check your internet connection<br>2. Try refreshing the page<br>3. Check browser console for more details`;
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
            aiResponsePlaceholder.innerHTML = "<strong>Kurma Gen AI:</strong> 🖋️ Thinking...";
            chatbox.appendChild(aiResponsePlaceholder);
            chatbox.scrollTop = chatbox.scrollHeight;

            try {
                const output = await generator(input, {
                    max_new_tokens: 256,
                    temperature: 0.7,
                    do_sample: true
                });
                
                aiResponsePlaceholder.innerHTML = `<strong>Kurma Gen AI:</strong> ${output[0].generated_text}`;
            } catch (err) {
                aiResponsePlaceholder.innerHTML = `<strong>Kurma Gen AI:</strong> Error generating response. ${err.message}`;
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
>>>>>>> e37c6f2d320f8b5c54ecc2e65459e5818b00ad61
