
// Animated Loading Overlay Component
class LoadingOverlay {
    constructor() {
        this.overlay = null;
        this.isVisible = false;
    }

    show(message = 'Processing') {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">
                    ${message}
                    <span class="loading-dots">...</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
        });
    }

    hide() {
        if (!this.isVisible || !this.overlay) return;
        
        this.isVisible = false;
        this.overlay.style.opacity = '0';
        
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            this.overlay = null;
        }, 300);
    }

    updateMessage(message) {
        if (this.overlay) {
            const messageEl = this.overlay.querySelector('.loading-message');
            if (messageEl) {
                messageEl.innerHTML = `${message}<span class="loading-dots">...</span>`;
            }
        }
    }
}

// Global loading overlay instance
const loadingOverlay = new LoadingOverlay();

// CSS styles for loading overlay (add to wallet-style.css)
const loadingStyles = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.loading-content {
    text-align: center;
    color: white;
}

.loading-spinner {
    width: 64px;
    height: 64px;
    border: 4px solid #FFD700;
    border-top: 4px solid transparent;
    border-radius: 50%;
    margin: 0 auto 24px;
    animation: loadingSpin 1s linear infinite;
}

@keyframes loadingSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-message {
    font-size: 18px;
    font-weight: 600;
    color: white;
}

.loading-dots {
    animation: loadingDots 1.5s infinite;
}

@keyframes loadingDots {
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    80%, 100% { opacity: 0; }
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);
