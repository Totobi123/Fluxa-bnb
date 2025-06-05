
let transactions = [];
let filteredTransactions = [];
let currentFilter = 'all';
let showingNaira = false;

// Sample transaction data
const sampleTransactions = [
    {
        id: 'tx1',
        type: 'giveaway',
        amount: 0.15,
        amountUSD: 37.50,
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z'
    },
    {
        id: 'tx2',
        type: 'receive',
        amount: 0.05,
        amountUSD: 12.50,
        status: 'completed',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        txHash: '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a'
    },
    {
        id: 'tx3',
        type: 'send',
        amount: 0.02,
        amountUSD: 5.00,
        status: 'completed',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        txHash: '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'
    }
];

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
    // Already on history
}

function goToSettings() {
    window.location.href = 'settings.html';
}

// Filter and search functions
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    filterTransactions();
}

function filterTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredTransactions = transactions.filter(tx => {
        // Filter by type
        const typeMatch = currentFilter === 'all' || tx.type === currentFilter;
        
        // Filter by search term
        const searchMatch = !searchTerm || 
            tx.id.toLowerCase().includes(searchTerm) ||
            tx.type.toLowerCase().includes(searchTerm) ||
            (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm));
        
        return typeMatch && searchMatch;
    });
    
    renderTransactions();
}

function toggleCurrency() {
    const currencyToggle = document.querySelector('.currency-toggle');
    showingNaira = !showingNaira;
    
    currencyToggle.textContent = showingNaira ? 'NGN' : 'USD';
    renderTransactions();
}

function showFilterOptions() {
    // Could implement a more advanced filter modal here
    showNotification('Use the filter tabs below to filter transactions', 'info');
}

// Render functions
function renderTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    const emptyState = document.getElementById('emptyState');
    const emptyStateMessage = document.getElementById('emptyStateMessage');
    
    if (filteredTransactions.length === 0) {
        transactionsList.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (document.getElementById('searchInput').value || currentFilter !== 'all') {
            emptyStateMessage.textContent = 'Try adjusting your search or filter criteria';
        } else {
            emptyStateMessage.textContent = 'Your transactions will appear here once you start using your wallet';
        }
        return;
    }
    
    transactionsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    transactionsList.innerHTML = filteredTransactions.map((tx, index) => {
        const icon = getTransactionIcon(tx.type, tx.status);
        const title = getTransactionTitle(tx.type);
        const timeAgo = getTimeAgo(new Date(tx.timestamp));
        const amount = formatAmount(tx.amount, tx.amountUSD);
        const secondaryAmount = formatSecondaryAmount(tx.amount, tx.amountUSD);
        const statusClass = getStatusClass(tx.status);
        const amountClass = tx.type === 'send' ? 'amount-negative' : 'amount-positive';
        const amountPrefix = tx.type === 'send' ? '-' : '+';
        
        return `
            <div class="transaction-item" style="animation-delay: ${index * 0.1}s;">
                <div class="transaction-icon ${tx.type}">
                    ${icon}
                </div>
                <div class="transaction-details">
                    <div class="transaction-header">
                        <span class="transaction-title">${title}</span>
                        <span class="transaction-status ${statusClass}">${tx.status}</span>
                    </div>
                    <p class="transaction-time">${timeAgo}</p>
                    ${tx.txHash ? `<p class="transaction-hash">${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}</p>` : ''}
                </div>
                <div class="transaction-amount">
                    <div class="${amountClass}">
                        ${amountPrefix}${amount}
                    </div>
                    <div class="secondary-amount">
                        ${secondaryAmount}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getTransactionIcon(type, status) {
    if (status === 'pending') {
        return `<div class="pending-dot"></div>`;
    }
    
    switch (type) {
        case 'giveaway':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,12 20,22 4,22 4,12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="17" x2="12" y2="17"/>
            </svg>`;
        case 'receive':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="17,7 17,17 7,17"/>
            </svg>`;
        case 'send':
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="17" y1="7" x2="7" y2="17"/>
                <polyline points="7,7 7,17 17,7"/>
            </svg>`;
        default:
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>`;
    }
}

function getTransactionTitle(type) {
    switch (type) {
        case 'giveaway':
            return 'Giveaway Received';
        case 'receive':
            return 'Received';
        case 'send':
            return 'Sent';
        default:
            return 'Transaction';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'completed':
            return 'status-completed';
        case 'pending':
            return 'status-pending';
        case 'failed':
            return 'status-failed';
        default:
            return 'status-unknown';
    }
}

function formatAmount(amount, amountUSD) {
    if (showingNaira) {
        const nairaAmount = amountUSD * 1580; // Exchange rate
        return `₦${nairaAmount.toLocaleString()}`;
    }
    return `${amount.toFixed(4)} BNB`;
}

function formatSecondaryAmount(amount, amountUSD) {
    if (showingNaira) {
        return `$${amountUSD.toFixed(2)}`;
    }
    const nairaAmount = amountUSD * 1580;
    return `₦${nairaAmount.toLocaleString()}`;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
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

// Initialize history page
document.addEventListener('DOMContentLoaded', function() {
    // Load transactions from localStorage or use sample data
    const storedTransactions = localStorage.getItem('walletTransactions');
    transactions = storedTransactions ? JSON.parse(storedTransactions) : sampleTransactions;
    
    // Initial render
    filterTransactions();
    
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
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .search-section {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .search-bar {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .search-bar svg {
            position: absolute;
            left: 12px;
            color: #9CA3AF;
            z-index: 1;
        }
        
        .search-bar input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            background: #374151;
            border: 1px solid #4B5563;
            border-radius: 12px;
            color: white;
            font-size: 14px;
        }
        
        .search-bar input:focus {
            outline: none;
            border-color: #8B5CF6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .filter-btn {
            padding: 12px 16px;
            background: #374151;
            border: 1px solid #4B5563;
            border-radius: 12px;
            color: #D1D5DB;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .filter-btn:hover {
            background: #4B5563;
        }
        
        .filter-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 4px;
        }
        
        .filter-tab {
            padding: 8px 16px;
            background: none;
            border: 1px solid #4B5563;
            border-radius: 20px;
            color: #9CA3AF;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        .filter-tab.active {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            border-color: #FFD700;
        }
        
        .filter-tab:hover:not(.active) {
            background: #374151;
            color: white;
        }
        
        .transactions-list {
            space-y: 12px;
        }
        
        .transaction-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: rgba(31, 41, 55, 0.8);
            border: 1px solid #374151;
            border-radius: 12px;
            margin-bottom: 12px;
            animation: fadeInUp 0.3s ease-out;
            transition: all 0.2s;
        }
        
        .transaction-item:hover {
            border-color: #FFD700;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1);
        }
        
        .transaction-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .transaction-icon.giveaway {
            background: #FFD700;
            color: #000;
        }
        
        .transaction-icon.receive {
            background: #22C55E;
            color: white;
        }
        
        .transaction-icon.send {
            background: #EF4444;
            color: white;
        }
        
        .pending-dot {
            width: 8px;
            height: 8px;
            background: #FCD34D;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        .transaction-details {
            flex: 1;
        }
        
        .transaction-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .transaction-title {
            font-weight: 600;
            color: white;
        }
        
        .transaction-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-completed {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
        }
        
        .status-pending {
            background: rgba(252, 211, 77, 0.2);
            color: #FCD34D;
        }
        
        .status-failed {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
        }
        
        .transaction-time {
            color: #9CA3AF;
            font-size: 12px;
            margin: 0;
        }
        
        .transaction-hash {
            color: #6B7280;
            font-size: 10px;
            font-family: monospace;
            margin: 4px 0 0;
        }
        
        .transaction-amount {
            text-align: right;
        }
        
        .amount-positive {
            color: #22C55E;
            font-weight: 600;
            font-size: 16px;
        }
        
        .amount-negative {
            color: #EF4444;
            font-weight: 600;
            font-size: 16px;
        }
        
        .secondary-amount {
            color: #9CA3AF;
            font-size: 12px;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }
        
        .empty-icon {
            width: 80px;
            height: 80px;
            background: #374151;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        
        .empty-icon svg {
            color: #9CA3AF;
        }
        
        .empty-state h3 {
            color: white;
            margin-bottom: 12px;
        }
        
        .empty-state p {
            color: #9CA3AF;
            margin: 0;
        }
        
        .exchange-info {
            padding: 16px;
            background: rgba(31, 41, 55, 0.5);
            border-radius: 12px;
            border: 1px solid #374151;
            text-align: center;
            margin-top: 20px;
        }
        
        .exchange-info p {
            color: #9CA3AF;
            font-size: 12px;
            margin: 0;
        }
        
        .rate-note {
            color: #6B7280 !important;
            font-size: 10px !important;
            margin-top: 4px !important;
        }
    `;
    document.head.appendChild(style);
});
