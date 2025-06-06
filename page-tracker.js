
// Universal Page Tracker for Telegram Notifications
// Include this script on any page to automatically track visits

class PageTracker {
    constructor() {
        this.deviceId = null;
        this.pageName = this.getPageName();
        this.init();
    }

    getPageName() {
        // Extract page name from current URL
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (!filename || filename === 'index.html' || filename === '') {
            return 'Authentication';
        }
        
        // Convert filename to readable page name
        const pageName = filename.replace('.html', '').replace(/-/g, ' ');
        return pageName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    async init() {
        try {
            // Wait for device auth service to be available
            if (typeof deviceAuthService !== 'undefined') {
                this.deviceId = deviceAuthService.getDeviceId();
            } else {
                this.deviceId = localStorage.getItem('deviceIdOriginal') || 'Unknown';
            }

            // Track page visit
            await this.trackPageVisit();
            
            // Track page engagement time
            this.trackEngagement();
            
        } catch (error) {
            console.log('Page tracking failed:', error);
        }
    }

    async trackPageVisit() {
        try {
            if (typeof telegramService !== 'undefined') {
                await telegramService.notifyPageVisit(this.deviceId, this.pageName);
            }
        } catch (error) {
            console.log('Page visit notification failed:', error);
        }
    }

    trackEngagement() {
        const startTime = Date.now();
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', async () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            try {
                if (typeof telegramService !== 'undefined' && timeSpent > 5) {
                    await telegramService.notifyPageEngagement(this.deviceId, this.pageName, timeSpent);
                }
            } catch (error) {
                console.log('Engagement tracking failed:', error);
            }
        });

        // Track significant interactions
        let interactions = 0;
        ['click', 'input', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactions++;
                if (interactions === 1 || interactions % 10 === 0) {
                    this.sendInteractionUpdate(interactions);
                }
            });
        });
    }

    async sendInteractionUpdate(count) {
        try {
            if (typeof telegramService !== 'undefined' && count % 20 === 0) {
                await telegramService.notifyUserInteraction(this.deviceId, this.pageName, count);
            }
        } catch (error) {
            console.log('Interaction tracking failed:', error);
        }
    }
}

// Initialize page tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageTracker();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTracker;
}
