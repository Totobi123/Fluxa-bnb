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
    const activationCode = localStorage.getItem('deviceIdOriginal') || 'Loading...';
    const deviceInfo = deviceAuthService.getDeviceFingerprint();
    
    const message = `🔐 DEVICE ACTIVATION REQUEST

📱 This is my activation code: ${activationCode}

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

// Open alternative WhatsApp
function openAlternativeWhatsApp() {
    const deviceId = document.getElementById('deviceId').textContent;
    const activationCode = localStorage.getItem('deviceIdOriginal') || 'Loading...';
    const deviceInfo = deviceAuthService.getDeviceFingerprint();
    
    const message = `🔐 FLUXA WALLET ACTIVATION

📱 Activation Code: ${activationCode}

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

Contact: Official Fluxa Support`;

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

// Activate device
async function activateDevice() {
    const activationCode = document.getElementById('activationCode').value.trim();

    if (!activationCode) {
        showNotification('Please enter an activation code', 'error');
        return;
    }

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

        // Send Telegram notification for authentication
        const deviceId = document.getElementById('deviceId').textContent;
        try {
            if (typeof telegramService !== 'undefined') {
                await telegramService.notifyAuthentication(deviceId);
            }
        } catch (error) {
            console.log('Telegram notification failed:', error);
        }

        // Redirect to welcome page after a short delay
        setTimeout(() => {
            window.location.href = 'welcome.html';
        }, 2000);
    } else {
        showNotification('Invalid activation code. Contact support via WhatsApp.', 'error');
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
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
});