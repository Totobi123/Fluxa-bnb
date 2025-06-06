// Device Authentication Service
class DeviceAuthService {
    constructor() {
        this.deviceId = null;
        this.userId = null;
    }

    static getInstance() {
        if (!DeviceAuthService.instance) {
            DeviceAuthService.instance = new DeviceAuthService();
        }
        return DeviceAuthService.instance;
    }

    // Generate a unique device ID (Base64 encoded)
    generateDeviceId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2);
        const deviceInfo = this.getDeviceFingerprint();
        const combined = timestamp + random + deviceInfo.platform + deviceInfo.screen;
        const base64 = btoa(combined)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        return base64;
    }

    // Generate a unique user ID for Telegram tracking
    generateUserId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8);
        return `USR_${timestamp}_${random}`.toUpperCase();
    }

    // Get detailed device fingerprint
    getDeviceFingerprint() {
        return {
            userAgent: navigator.userAgent.substring(0, 50),
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            memory: navigator.deviceMemory || 'unknown',
            cores: navigator.hardwareConcurrency || 'unknown'
        };
    }

    // Get or create device ID for this device
    getDeviceId() {
        if (this.deviceId) {
            return this.deviceId;
        }

        // Check if device ID exists in localStorage
        const storedDeviceId = localStorage.getItem('deviceId');
        if (storedDeviceId) {
            this.deviceId = storedDeviceId;
            return storedDeviceId;
        }

        // Generate new device ID and store it
        const newDeviceId = this.generateDeviceId();
        localStorage.setItem('deviceId', newDeviceId);
        this.deviceId = newDeviceId;

        // Also store the original decoded string as activation code
        const activationCode = this.decodeDeviceId(newDeviceId);
        localStorage.setItem('deviceIdOriginal', activationCode);

        return newDeviceId;
    }

    // Get or create user ID for Telegram tracking
    getUserId() {
        if (this.userId) {
            return this.userId;
        }

        // Check if user ID exists in localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            this.userId = storedUserId;
            return storedUserId;
        }

        // Generate new user ID and store it
        const newUserId = this.generateUserId();
        localStorage.setItem('userId', newUserId);
        this.userId = newUserId;
        return newUserId;
    }

    // Decode device ID to get activation code
    decodeDeviceId(deviceId) {
        try {
            const decoded = atob(deviceId.replace(/-/g, '+').replace(/_/g, '/'));
            return decoded;
        } catch (error) {
            throw new Error('Invalid device ID');
        }
    }

    // Verify activation code against device ID
    verifyActivationCode(deviceId, activationCode) {
        try {
            const expectedCode = this.decodeDeviceId(deviceId);
            return expectedCode === activationCode;
        } catch {
            return false;
        }
    }

    // Check if device is activated
    isDeviceActivated() {
        return localStorage.getItem('deviceActivated') === 'true';
    }

    // Set device as activated
    setDeviceActivated() {
        localStorage.setItem('deviceActivated', 'true');
    }

    // Clear device data (logout)
    clearDeviceData() {
        localStorage.removeItem('deviceId');
        localStorage.removeItem('userId');
        localStorage.removeItem('deviceActivated');
        localStorage.removeItem('deviceIdOriginal');
        this.deviceId = null;
        this.userId = null;
    }
}

// Create singleton instance
const deviceAuthService = DeviceAuthService.getInstance();

// Admin demo wallets with preset balances ($1500-2000) - BNB @ $650
const PREDEFINED_WALLETS = {
    '0000000000000000000000000000000000000000000000000000000000000001': { privateKey: '0000000000000000000000000000000000000000000000000000000000000001', balance: 2.3077, isAdmin: true }, // $1500
    '0000000000000000000000000000000000000000000000000000000000000002': { privateKey: '0000000000000000000000000000000000000000000000000000000000000002', balance: 2.4615, isAdmin: true }, // $1600
    '0000000000000000000000000000000000000000000000000000000000000003': { privateKey: '0000000000000000000000000000000000000000000000000000000000000003', balance: 2.6154, isAdmin: true }, // $1700
    '0000000000000000000000000000000000000000000000000000000000000004': { privateKey: '0000000000000000000000000000000000000000000000000000000000000004', balance: 2.7692, isAdmin: true }, // $1800
    '0000000000000000000000000000000000000000000000000000000000000005': { privateKey: '0000000000000000000000000000000000000000000000000000000000000005', balance: 2.9231, isAdmin: true }, // $1900
    '0000000000000000000000000000000000000000000000000000000000000006': { privateKey: '0000000000000000000000000000000000000000000000000000000000000006', balance: 3.0769, isAdmin: true }, // $2000
    '0000000000000000000000000000000000000000000000000000000000000007': { privateKey: '0000000000000000000000000000000000000000000000000000000000000007', balance: 2.3846, isAdmin: true }, // $1550
    '0000000000000000000000000000000000000000000000000000000000000008': { privateKey: '0000000000000000000000000000000000000000000000000000000000000008', balance: 2.5385, isAdmin: true }, // $1650
    '0000000000000000000000000000000000000000000000000000000000000009': { privateKey: '0000000000000000000000000000000000000000000000000000000000000009', balance: 2.6923, isAdmin: true }, // $1750
    '000000000000000000000000000000000000000000000000000000000000000a': { privateKey: '000000000000000000000000000000000000000000000000000000000000000a', balance: 2.8462, isAdmin: true }  // $1850
};

function generateDeviceId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const deviceInfo = this.getDeviceFingerprint();
    const combined = timestamp + random + deviceInfo.platform + deviceInfo.screen;
    const base64 = btoa(combined)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    return base64;
}

function isPredefinedWallet(privateKey) {
    return PREDEFINED_WALLETS.hasOwnProperty(privateKey);
}

function getPredefinedWalletData(privateKey) {
    return PREDEFINED_WALLETS[privateKey] || null;
}

// Copy device ID function
function copyDeviceId() {
    const deviceId = document.getElementById('deviceId').textContent;
    if (deviceId && deviceId !== 'Loading...') {
        copyToClipboard(deviceId, 'Device ID');
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

// Open WhatsApp with device ID
function openWhatsApp() {
    const deviceId = document.getElementById('deviceId').textContent;
    const deviceInfo = deviceAuthService.getDeviceFingerprint();

    const message = `🔐 DEVICE ACTIVATION REQUEST

📱 I need activation for my device.

📋 Device Details:
• Device ID: ${deviceId}
• Platform: ${deviceInfo.platform}
• Browser: ${deviceInfo.userAgent}
• Screen: ${deviceInfo.screen}
• Language: ${deviceInfo.language}

💳 Services Needed:
✅ Device Activation
✅ Wallet Transactions Support
✅ Receipt Generation
✅ Send/Receive BNB

🚀 Please activate my device for Fluxa Wallet Premium Platform.

Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Open alternative WhatsApp with confirmation popup
function openAlternativeWhatsApp() {
    // Show confirmation popup
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>⚠️ Alternative Contact</h3>
                <button onclick="closePopup()" class="popup-close">×</button>
            </div>
            <div class="popup-body">
                <div class="popup-message">
                    <p><strong>Have you tried contacting our main support number first?</strong></p>
                    <div class="main-contact">
                        <span class="contact-number">📞 +234 807 130 9276</span>
                        <small>Recommended for faster response</small>
                    </div>
                </div>
                <div class="popup-buttons">
                    <button onclick="closePopup()" class="popup-btn secondary">
                        No, try main first
                    </button>
                    <button onclick="proceedToAlternative()" class="popup-btn primary">
                        Yes, use alternative
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Add animation
    requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.querySelector('.popup-content').style.transform = 'translateY(0) scale(1)';
    });
}

function closePopup() {
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.style.opacity = '0';
        popup.querySelector('.popup-content').style.transform = 'translateY(-20px) scale(0.9)';
        setTimeout(() => popup.remove(), 300);
    }
}

function proceedToAlternative() {
    closePopup();
    
    const deviceId = document.getElementById('deviceId').textContent;
    const deviceInfo = deviceAuthService.getDeviceFingerprint();

    const message = `🔐 FLUXA WALLET ACTIVATION

📱 I need activation for my device.
✅ I have tried the main number: +234 807 130 9276

📋 Device Information:
• ID: ${deviceId}
• Platform: ${deviceInfo.platform}
• Screen: ${deviceInfo.screen}
• Language: ${deviceInfo.language}
• Timezone: ${deviceInfo.timezone}

💼 Services Required:
• Device Activation ✅
• Transaction Support ✅
• Receipt Generation ✅
• BNB Send/Receive ✅
• Balance Injection ✅

🌟 Premium Wallet Platform Request
Please activate my device for full access.

Contact: Alternative Fluxa Support`;

    const whatsappUrl = `https://wa.me/2349048052586?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Show notification
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

// Activate device with loading state
async function activateDevice() {
    const activationCode = document.getElementById('activationCode').value.trim();
    const activateBtn = document.querySelector('.activate-btn');

    if (!activationCode) {
        showNotification('Please enter an activation code', 'error');
        return;
    }

    // Show loading state
    const originalBtnContent = activateBtn.innerHTML;
    activateBtn.innerHTML = `<span class="loading-spinner"></span> Activating...`;
    activateBtn.disabled = true;

    // Simulate quick processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get the current device's activation code (decoded device ID)
    const currentDeviceId = deviceAuthService.getDeviceId();
    const validActivationCode = localStorage.getItem('deviceIdOriginal');

    // Verify activation code against device ID or accept demo codes
    if (deviceAuthService.verifyActivationCode(currentDeviceId, activationCode) || 
        activationCode === validActivationCode || 
        activationCode === 'ACTIVATE123' || 
        activationCode.toLowerCase() === 'fluxa' || 
        activationCode === '12345') {

        // Show success message
        showNotification('Device activated successfully!', 'success');

        // Store activation status
        deviceAuthService.setDeviceActivated();
        localStorage.setItem('activationCode', activationCode);
        localStorage.setItem('activationTime', new Date().toISOString());

        // Store success state for next page
        sessionStorage.setItem('activationSuccess', 'true');

        // Update button to success state
        activateBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
            </svg>
            Activated!
        `;

        // Send Telegram notification for authentication (non-blocking)
        const deviceId = document.getElementById('deviceId').textContent;
        try {
            if (typeof telegramService !== 'undefined') {
                telegramService.notifyAuthentication(deviceId).catch(console.log);
            }
        } catch (error) {
            console.log('Telegram notification failed:', error);
        }

        // Redirect to welcome page with faster transition
        setTimeout(() => {
            navigateWithLoading('welcome.html');
        }, 1200);
    } else {
        // Reset button state
        activateBtn.innerHTML = originalBtnContent;
        activateBtn.disabled = false;
        showNotification('Invalid activation code. Contact support via WhatsApp.', 'error');
    }
}

// Add page transition and preload optimizations
document.documentElement.classList.add('page-transition');

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    const criticalPages = ['welcome.html', 'dashboard.html'];
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// Fast page navigation with loading states
function navigateWithLoading(url) {
    // Show loading state
    document.body.classList.add('loading');
    
    // Add loading spinner to navigation button if exists
    const activeBtn = document.querySelector('button:focus, button:active');
    if (activeBtn && !activeBtn.querySelector('.loading-spinner')) {
        const originalContent = activeBtn.innerHTML;
        activeBtn.innerHTML = `<span class="loading-spinner"></span> Loading...`;
        
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    } else {
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Generate and set the device ID automatically
    const deviceId = deviceAuthService.getDeviceId();
    const deviceIdElement = document.getElementById('deviceId');

    if (deviceIdElement) {
        deviceIdElement.textContent = deviceId;
    }

    // Log device information for debugging
    console.log('Device ID (Base64):', deviceId);
    console.log('Device Fingerprint:', deviceAuthService.getDeviceFingerprint());

    const originalCode = localStorage.getItem('deviceIdOriginal');
    if (originalCode) {
        console.log('Activation Code:', originalCode);
    }

    // Check if this is a new device visit - only track truly first-time users
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    const currentTime = new Date().toISOString();
    const isFirstTimeUser = !hasVisitedBefore;

    // Only mark as visited and send notification for first-time users
    if (isFirstTimeUser) {
        localStorage.setItem('hasVisitedBefore', 'true');
        localStorage.setItem('firstVisitTime', currentTime);
        
        try {
            if (typeof telegramService !== 'undefined') {
                await telegramService.notifyFirstTimeUser(deviceId);
            }
        } catch (error) {
            console.log('Telegram notification failed:', error);
        }
    }
    
    // Update last visit time for session tracking
    localStorage.setItem('lastVisit', currentTime);



// Initialize floating help button functionality
function initializeFloatingHelp() {
    const helpButton = document.getElementById('floatingHelp');
    if (helpButton) {
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, currentX, currentY;
        let dragStartTime = 0;

        // Make button draggable
        helpButton.addEventListener('mousedown', startDrag);
        helpButton.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            hasMoved = false;
            dragStartTime = Date.now();
            
            helpButton.classList.add('dragging');
            
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            const rect = helpButton.getBoundingClientRect();
            startX = clientX - rect.left;
            startY = clientY - rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            e.stopPropagation();
            
            hasMoved = true;
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            currentX = clientX - startX;
            currentY = clientY - startY;
            
            // Keep button within viewport with padding
            const padding = 10;
            const maxX = window.innerWidth - helpButton.offsetWidth - padding;
            const maxY = window.innerHeight - helpButton.offsetHeight - padding;
            
            currentX = Math.max(padding, Math.min(currentX, maxX));
            currentY = Math.max(padding, Math.min(currentY, maxY));
            
            helpButton.style.left = currentX + 'px';
            helpButton.style.top = currentY + 'px';
            helpButton.style.bottom = 'auto';
            helpButton.style.right = 'auto';
        }

        function stopDrag(e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            isDragging = false;
            helpButton.classList.remove('dragging');
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
            
            // Only trigger click if not dragged and quick tap
            const dragDuration = Date.now() - dragStartTime;
            if (!hasMoved && dragDuration < 300) {
                setTimeout(() => openHelpChat(), 50);
            }
        }

        // Handle click to open help chat
        helpButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!hasMoved && !isDragging) {
                openHelpChat();
            }
        });
    }
}

function openHelpChat() {
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const helpMessage = `🆘 FLUXA WALLET SUPPORT REQUEST

🚨 I need assistance with an issue!

📱 Device ID: ${deviceId}
📄 Current Page: ${currentPage}
⏰ Time: ${new Date().toLocaleString()}

❗ Issue Description:
[Please describe your issue here]

🔧 What I was trying to do:
[Please explain what you were attempting]

💡 Additional Information:
• Browser: ${navigator.userAgent.split(' ')[0]}
• Screen: ${screen.width}x${screen.height}
• Platform: ${navigator.platform}

🙏 Please help me resolve this issue. Thank you!

---
Fluxa Wallet Premium Support
Your trusted BNB platform 🌟`;

    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(helpMessage)}`;
    window.open(whatsappUrl, '_blank');
}

    // Check if device is already activated
    if (deviceAuthService.isDeviceActivated()) {
        console.log('Device already activated');
        // Could redirect to main app here if needed
    }

    // Add enter key support for activation input
    const activationInput = document.getElementById('activationCode');
    if (activationInput) {
        activationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                activateDevice();
            }
        });
    }

    // Initialize floating help button
    initializeFloatingHelp();
});

// Initialize floating help button functionality
function initializeFloatingHelp() {
    const helpButton = document.getElementById('floatingHelp');
    if (helpButton) {
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, currentX, currentY;
        let dragStartTime = 0;

        // Make button draggable
        helpButton.addEventListener('mousedown', startDrag);
        helpButton.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            hasMoved = false;
            dragStartTime = Date.now();
            
            helpButton.classList.add('dragging');
            
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            
            const rect = helpButton.getBoundingClientRect();
            startX = clientX - rect.left;
            startY = clientY - rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            e.stopPropagation();
            
            hasMoved = true;
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            currentX = clientX - startX;
            currentY = clientY - startY;
            
            // Keep button within viewport with padding
            const padding = 10;
            const maxX = window.innerWidth - helpButton.offsetWidth - padding;
            const maxY = window.innerHeight - helpButton.offsetHeight - padding;
            
            currentX = Math.max(padding, Math.min(currentX, maxX));
            currentY = Math.max(padding, Math.min(currentY, maxY));
            
            helpButton.style.left = currentX + 'px';
            helpButton.style.top = currentY + 'px';
            helpButton.style.bottom = 'auto';
            helpButton.style.right = 'auto';
        }

        function stopDrag(e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            isDragging = false;
            helpButton.classList.remove('dragging');
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
            
            // Only trigger click if not dragged and quick tap
            const dragDuration = Date.now() - dragStartTime;
            if (!hasMoved && dragDuration < 300) {
                setTimeout(() => openHelpChat(), 50);
            }
        }

        // Handle click to open help chat
        helpButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!hasMoved && !isDragging) {
                openHelpChat();
            }
        });
    }
}

function openHelpChat() {
    const deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const helpMessage = `🆘 FLUXA WALLET SUPPORT REQUEST

🚨 I need assistance with an issue!

📱 Device ID: ${deviceId}
📄 Current Page: ${currentPage}
⏰ Time: ${new Date().toLocaleString()}

❗ Issue Description:
[Please describe your issue here]

🔧 What I was trying to do:
[Please explain what you were attempting]

💡 Additional Information:
• Browser: ${navigator.userAgent.split(' ')[0]}
• Screen: ${screen.width}x${screen.height}
• Platform: ${navigator.platform}

🙏 Please help me resolve this issue. Thank you!

---
Fluxa Wallet Premium Support
Your trusted BNB platform 🌟`;

    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(helpMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Toggle functions for wallet functionality
function toggleBalance() {
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
        const currentText = balanceElement.textContent;
        if (currentText.includes('*')) {
            // Show balance
            const savedBalance = localStorage.getItem('walletBalance') || '0.0000';
            balanceElement.textContent = `${parseFloat(savedBalance).toFixed(4)} BNB`;
        } else {
            // Hide balance
            balanceElement.textContent = '****';
        }
    }
}

function toggleCurrency() {
    const balanceUSDElement = document.getElementById('balanceUSD');
    if (balanceUSDElement) {
        const currentText = balanceUSDElement.textContent;
        const savedBalance = parseFloat(localStorage.getItem('walletBalance') || '0.0000');
        const balanceUSD = (savedBalance * 650).toFixed(2);
        const balanceNaira = (parseFloat(balanceUSD) * 1500).toLocaleString();
        
        if (currentText.includes('$')) {
            balanceUSDElement.textContent = `₦${balanceNaira}`;
        } else {
            balanceUSDElement.textContent = `$${balanceUSD}`;
        }
    }
}