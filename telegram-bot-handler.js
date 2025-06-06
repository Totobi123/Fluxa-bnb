class TelegramBotHandler {
    constructor() {
        this.botToken = '7573718525:AAFifabqLK6LKCPp5vmRbc4Ccm9vzbvN4gM';
        this.chatId = '6381022912';
        this.telegramService = window.telegramService || new TelegramService();
        this.adminCommands = {
            '/stats': this.handleStatsCommand.bind(this),
            '/revenue': this.handleRevenueCommand.bind(this),
            '/today': this.handleTodayCommand.bind(this),
            '/users': this.handleUsersCommand.bind(this),
            '/help': this.handleHelpCommand.bind(this)
        };
        this.setupWebhookReceiver();
    }

    async sendBotMessage(message) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('Bot message failed:', error);
            return false;
        }
    }

    setupWebhookReceiver() {
        // Listen for webhook messages
        if (typeof window !== 'undefined') {
            window.addEventListener('telegram-webhook', (event) => {
                this.processWebhook(event.detail);
            });
        }
    }

    async handleStatsCommand() {
        const stats = this.telegramService.generateStats();
        const last7Days = this.getLast7DaysStats();
        const balanceStats = this.getTotalBalanceStats();

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

💳 <b>PLATFORM BALANCES</b>
• Total BNB: ${balanceStats.totalBNB.toFixed(4)} BNB
• Total USD: $${balanceStats.totalUSD.toLocaleString()}
• Active Wallets: ${balanceStats.activeWallets}

📈 <b>TODAY'S PERFORMANCE</b>
• New Joins: ${stats.today.newUsers} (+$${stats.today.newUserRevenue.toLocaleString()})
• Authentications: ${stats.today.authenticatedUsers} (+$${stats.today.authRevenue.toLocaleString()})
• Total Revenue Today: $${(stats.today.newUserRevenue + stats.today.authRevenue).toLocaleString()}

📅 <b>7-DAY SUMMARY</b>
${last7Days}

⏰ <b>Generated:</b> ${new Date().toLocaleString()}

<i>💡 Admin Dashboard - Real-time Business Analytics</i>
        `;
        await this.sendBotMessage(message);
    }

    async handleRevenueCommand() {
        const stats = this.telegramService.generateStats();
        const conversionRate = stats.total.authenticatedUsers > 0 ? 
            ((stats.total.authenticatedUsers / (stats.total.newUsers + stats.total.authenticatedUsers)) * 100).toFixed(1) : 0;

        const message = `
💰 <b>REVENUE BREAKDOWN ANALYSIS</b>

🟢 <b>NEW USERS REVENUE</b>
• Users: ${stats.total.newUsers}
• Revenue: $${stats.total.newUserRevenue.toLocaleString()}
• Rate: $20,000 per user

🔓 <b>AUTHENTICATED USERS REVENUE</b>
• Users: ${stats.total.authenticatedUsers}
• Revenue: $${stats.total.authUserRevenue.toLocaleString()}
• Rate: $80,000 per user

💎 <b>TOTAL REVENUE: $${stats.total.totalRevenue.toLocaleString()}</b>

📊 <b>METRICS</b>
• Conversion Rate: ${conversionRate}%
• Average Revenue Per User: $${stats.total.totalRevenue > 0 ? (stats.total.totalRevenue / (stats.total.newUsers + stats.total.authenticatedUsers)).toLocaleString() : 0}
• Authentication Premium: +$60,000 per conversion

⏰ <b>Generated:</b> ${new Date().toLocaleString()}
        `;
        await this.sendBotMessage(message);
    }

    async handleTodayCommand() {
        const stats = this.telegramService.generateStats();
        const todayRevenue = stats.today.newUserRevenue + stats.today.authRevenue;

        const message = `
📅 <b>TODAY'S PERFORMANCE REPORT</b>

🆕 <b>NEW USERS TODAY</b>
• Count: ${stats.today.newUsers}
• Revenue: $${stats.today.newUserRevenue.toLocaleString()}

🔓 <b>AUTHENTICATIONS TODAY</b>
• Count: ${stats.today.authenticatedUsers}
• Revenue: $${stats.today.authRevenue.toLocaleString()}

💰 <b>TOTAL TODAY: $${todayRevenue.toLocaleString()}</b>

📊 <b>DAILY CHART</b>
${stats.chartUrl}

🎯 <b>GOALS</b>
• Target Daily Revenue: $100,000
• Progress: ${todayRevenue > 0 ? ((todayRevenue / 100000) * 100).toFixed(1) : 0}%

⏰ <b>Report Time:</b> ${new Date().toLocaleString()}
        `;
        await this.sendBotMessage(message);
    }

    async handleUsersCommand() {
        const stats = this.telegramService.generateStats();
        const totalUsers = stats.total.newUsers + stats.total.authenticatedUsers;
        const conversionRate = totalUsers > 0 ? 
            ((stats.total.authenticatedUsers / totalUsers) * 100).toFixed(1) : 0;

        const message = `
👥 <b>USER STATISTICS DASHBOARD</b>

📊 <b>USER OVERVIEW</b>
• Total Users: ${totalUsers}
• New Users: ${stats.total.newUsers}
• Authenticated: ${stats.total.authenticatedUsers}
• Conversion Rate: ${conversionRate}%

📈 <b>TODAY'S ACTIVITY</b>
• New Joins: ${stats.today.newUsers}
• Authentications: ${stats.today.authenticatedUsers}

💡 <b>USER JOURNEY FLOW</b>
1️⃣ First Visit → New User ($20k value)
2️⃣ Device Activation → Authenticated ($80k total)

🎯 <b>PERFORMANCE METRICS</b>
• Retention Rate: ${conversionRate}%
• Value Per User: $${totalUsers > 0 ? Math.round(stats.total.totalRevenue / totalUsers).toLocaleString() : 0}
• Premium Conversion: ${conversionRate}%

⏰ <b>Updated:</b> ${new Date().toLocaleString()}
        `;
        await this.sendBotMessage(message);
    }

    async handleHelpCommand() {
        const message = `
🤖 <b>FLUXA WALLET ADMIN COMMAND CENTER</b>

📊 <b>AVAILABLE COMMANDS:</b>
• <code>/stats</code> - Complete analytics dashboard
• <code>/revenue</code> - Revenue breakdown analysis
• <code>/today</code> - Today's performance report
• <code>/users</code> - User statistics dashboard
• <code>/help</code> - This command reference

💡 <b>HOW TO USE:</b>
Send any command to this bot chat to get instant analytics.

🔧 <b>ADMIN FEATURES:</b>
• Real-time user tracking
• Revenue analytics
• Daily performance reports
• Visual charts and graphs
• Business intelligence

📱 <b>BOT INFO:</b>
• Token: 7573718525:AAF...
• Chat ID: 6381022912
• Status: Active ✅

🌟 <b>FLUXA WALLET BUSINESS INTELLIGENCE</b>
Your complete admin dashboard for monitoring platform performance.

⏰ <b>Help Generated:</b> ${new Date().toLocaleString()}
        `;
        await this.sendBotMessage(message);
    }

    getTotalBalanceStats() {
        const balanceData = this.telegramService.userDatabase.balanceTracking || {};
        let totalBNB = 0;
        let activeWallets = 0;

        Object.values(balanceData).forEach(balance => {
            if (balance > 0) {
                totalBNB += balance;
                activeWallets++;
            }
        });

        const totalUSD = totalBNB * 650; // BNB to USD conversion

        return {
            totalBNB,
            totalUSD,
            activeWallets
        };
    }

    getLast7DaysStats() {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayStats = this.telegramService.userDatabase.dailyStats[dateStr] || {
                newUsers: 0,
                authenticatedUsers: 0,
                newUserRevenue: 0,
                authRevenue: 0
            };

            const totalRevenue = dayStats.newUserRevenue + dayStats.authRevenue;
            const totalUsers = dayStats.newUsers + dayStats.authenticatedUsers;
            last7Days.push(`${date.toLocaleDateString()}: ${totalUsers} users, $${totalRevenue.toLocaleString()}`);
        }
        return last7Days.join('\n');
    }

    async processWebhook(update) {
        if (update.message && update.message.text) {
            const command = update.message.text.trim();
            if (this.adminCommands[command]) {
                await this.adminCommands[command]();
            }
        }
    }
}

// Create global instance and expose admin commands
const telegramBotHandler = new TelegramBotHandler();

// Console commands for admin
window.stats = () => telegramBotHandler.handleStatsCommand();
window.revenue = () => telegramBotHandler.handleRevenueCommand();
window.today = () => telegramBotHandler.handleTodayCommand();
window.users = () => telegramBotHandler.handleUsersCommand();
window.help = () => telegramBotHandler.handleHelpCommand();

console.log(`
🤖 Fluxa Wallet Admin Console Commands:
• stats() - Full analytics dashboard
• revenue() - Revenue breakdown  
• today() - Today's performance
• users() - User statistics
• help() - Command help

Type any command in the console to execute.
`);