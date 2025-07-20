class ImperialDatapad {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.startClock();
        this.initializeTerminal();
    }

    initializeElements() {
        this.importBtn = document.getElementById('importBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.fileInput = document.getElementById('fileInput');
        this.content = document.getElementById('content');
        this.timestamp = document.getElementById('timestamp');
    }

    setupEventListeners() {
        this.importBtn.addEventListener('click', () => this.triggerFileImport());
        this.clearBtn.addEventListener('click', () => this.clearContent());
        this.fileInput.addEventListener('change', (e) => this.handleFileImport(e));
    }

    startClock() {
        this.updateTimestamp();
        setInterval(() => this.updateTimestamp(), 1000);
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.timestamp.textContent = `TIME: ${timeString}`;
    }

    initializeTerminal() {
        // Add some terminal-like startup effects
        setTimeout(() => {
            this.typeText("IMPERIAL DATAPAD INITIALIZED...", 50);
        }, 500);
    }

    triggerFileImport() {
        this.fileInput.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.displayContent(content, file.name);
        };
        reader.readAsText(file);
    }

    displayContent(text, filename) {
        // Clear existing content
        this.content.innerHTML = '';

        // Create header with filename
        const header = document.createElement('div');
        header.innerHTML = `
            <h2 style="color: #ff4444; margin-bottom: 20px; text-align: center;">
                📄 CLASSIFIED DOCUMENT: ${filename.toUpperCase()}
            </h2>
            <div style="border-bottom: 1px solid #00ff41; margin-bottom: 20px; padding-bottom: 10px;">
                <small style="color: #888;">IMPORTED: ${new Date().toLocaleString()}</small>
            </div>
        `;
        this.content.appendChild(header);

        // Process and display content
        const contentDiv = document.createElement('div');
        
        if (filename.toLowerCase().endsWith('.md')) {
            contentDiv.innerHTML = this.parseMarkdown(text);
        } else {
            contentDiv.innerHTML = this.formatPlainText(text);
        }
        
        this.content.appendChild(contentDiv);

        // Add some visual effects
        this.content.style.opacity = '0';
        setTimeout(() => {
            this.content.style.transition = 'opacity 0.5s ease';
            this.content.style.opacity = '1';
        }, 100);
    }

    parseMarkdown(text) {
        let html = text;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #00ff41; text-decoration: underline;">$1</a>');
        
        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        
        // Wrap consecutive list items
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        // Wrap in paragraphs
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        
        return html;
    }

    formatPlainText(text) {
        // Convert plain text to HTML with proper formatting
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    clearContent() {
        this.content.innerHTML = `
            <div class="welcome-message">
                <h2>IMPERIAL STAR DESTROYER</h2>
                <p>Officer Terminal Ready</p>
                <p class="subtitle">Import classified documents to begin analysis</p>
            </div>
        `;
        
        // Reset file input
        this.fileInput.value = '';
    }

    typeText(text, speed = 100) {
        // Typing effect for terminal-like experience
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                process.stdout?.write?.(text.charAt(i));
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
}

// Initialize the datapad when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImperialDatapad();
});

// Add some ambient effects
document.addEventListener('mousemove', (e) => {
    const datapad = document.querySelector('.datapad');
    const rect = datapad.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    datapad.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener('mouseleave', () => {
    const datapad = document.querySelector('.datapad');
    datapad.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});