
// Navigation functions
function navigateToImport() {
    // Create import wallet page
    window.location.href = 'import.html';
}

function navigateToCreate() {
    // Create create wallet page
    window.location.href = 'create.html';
}

// Initialize the welcome screen
document.addEventListener('DOMContentLoaded', function() {
    // Add animation delays for staggered entrance
    const elements = document.querySelectorAll('.feature-card, .btn');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${(index + 1) * 0.1}s`;
        element.style.opacity = '0';
        element.style.animation = 'slideInUp 0.6s ease-out forwards';
    });
    
    // Check if user came from successful activation
    const activationSuccess = sessionStorage.getItem('activationSuccess');
    if (activationSuccess) {
        // Show success message
        showSuccessMessage('Device activated successfully! Choose your wallet option.');
        sessionStorage.removeItem('activationSuccess');
    }
});

// Add slide in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

function showSuccessMessage(message) {
    const successBanner = document.createElement('div');
    successBanner.className = 'success-banner';
    successBanner.innerHTML = `
        <div style="
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInDown 0.5s ease-out;
        ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span style="color: #86efac; font-size: 14px;">${message}</span>
        </div>
    `;
    
    const headerSection = document.querySelector('.header-section');
    headerSection.appendChild(successBanner);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successBanner.remove();
    }, 5000);
}
