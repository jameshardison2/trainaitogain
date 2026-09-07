let isEnabled = true;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLifeline);
} else {
    initLifeline();
}

function initLifeline() {
    // Only inject if on mercor
    if (!window.location.href.toLowerCase().includes('mercor.com')) return;
    injectLifelineWidget();
}

function injectLifelineWidget() {
    if (document.getElementById('tg-lifeline-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'tg-lifeline-widget';
    widget.className = 'tg-lifeline-container';
    
    widget.innerHTML = `
        <!-- Floating Button -->
        <button id="tg-lifeline-btn" class="tg-lifeline-btn">
            <span class="tg-lifeline-icon">🚨</span> 
            <strong>TrainAIToGain Lifeline</strong>
        </button>

        <!-- Expanded Modal -->
        <div id="tg-lifeline-modal" class="tg-lifeline-modal tg-hidden">
            <div class="tg-lifeline-header">
                <h3>Application Lifeline</h3>
                <button id="tg-lifeline-close">&times;</button>
            </div>
            
            <div class="tg-lifeline-body" id="tg-lifeline-step-1">
                <p>Are you stuck or experiencing a bug on the Mercor platform?</p>
                
                <div class="tg-lifeline-options">
                    <button class="tg-lifeline-option" data-tip="Check your browser permissions (the lock icon in the URL bar) to ensure Camera and Mic are allowed, then refresh.">Camera/Mic won't connect</button>
                    <button class="tg-lifeline-option" data-tip="Don't worry about the search filter. Mercor's AI will automatically route you to the best fit.">Confusing search filter</button>
                    <button class="tg-lifeline-option" data-tip="Focus on one specific technical project and explain your impact using numbers.">I don't know what to say</button>
                </div>
                
                <div id="tg-lifeline-tip" class="tg-lifeline-tip tg-hidden"></div>
                
                <div class="tg-lifeline-sos-section">
                    <p>Still stuck? We can help you live.</p>
                    <button id="tg-lifeline-sos-btn" class="tg-btn-danger">🚨 Send SOS & Request Zoom</button>
                </div>
            </div>

            <div class="tg-lifeline-body tg-hidden" id="tg-lifeline-step-2">
                <div class="tg-sos-success">
                    <div class="tg-check">✅</div>
                    <h4>SOS Signal Sent!</h4>
                    <p>We've captured your screen and alerted our affiliates.</p>
                    <a href="https://zoom.us/test" target="_blank" class="tg-btn-primary">Join Live Zoom Support</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(widget);
    
    // Event Listeners
    const btn = document.getElementById('tg-lifeline-btn');
    const modal = document.getElementById('tg-lifeline-modal');
    const closeBtn = document.getElementById('tg-lifeline-close');
    const tipBox = document.getElementById('tg-lifeline-tip');
    
    btn.addEventListener('click', () => {
        modal.classList.remove('tg-hidden');
        btn.classList.add('tg-hidden');
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.add('tg-hidden');
        btn.classList.remove('tg-hidden');
    });
    
    // Affiliate Tracking
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        chrome.storage.local.set({ 'affiliate_ref': ref });
    }
    
    // Tips & Interactions
    document.querySelectorAll('.tg-lifeline-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            const tipText = e.target.getAttribute('data-tip');
            tipBox.innerText = tipText;
            tipBox.classList.remove('tg-hidden');
            
            // Dom Interactions on Mercor Page
            if (tipText.includes("search filter")) {
                const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
                const buttons = document.querySelectorAll('button, div[role="button"]');
                
                searchInputs.forEach(input => {
                    if (input.placeholder && input.placeholder.toLowerCase().includes('search')) {
                        input.style.transition = 'box-shadow 0.3s ease-in-out';
                        input.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.5)';
                        input.focus();
                        setTimeout(() => input.style.boxShadow = '', 3000);
                    }
                });
                
                buttons.forEach(btn => {
                    if (btn.innerText && (btn.innerText.toLowerCase().includes('filter') || btn.innerText.toLowerCase().includes('priority'))) {
                        btn.style.transition = 'box-shadow 0.3s ease-in-out';
                        btn.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.5)';
                        setTimeout(() => btn.style.boxShadow = '', 3000);
                    }
                });
            }
        });
    });
    
    // SOS Trigger
    const sosBtn = document.getElementById('tg-lifeline-sos-btn');
    sosBtn.addEventListener('click', () => {
        sosBtn.innerText = "Capturing Context...";
        sosBtn.disabled = true;
        
        chrome.storage.local.get(['affiliate_ref'], (result) => {
            const affiliate = result.affiliate_ref || 'unknown';
            
            chrome.runtime.sendMessage({
                action: 'triggerSOS',
                payload: { 
                    issueType: 'Live Help Requested',
                    referred_by: affiliate
                }
            }, (response) => {
                if (response && response.success) {
                    document.getElementById('tg-lifeline-step-1').classList.add('tg-hidden');
                    
                    // Update success UI to remove zoom link and alert partner
                    const step2 = document.getElementById('tg-lifeline-step-2');
                    step2.innerHTML = `
                        <div class="tg-sos-success">
                            <div class="tg-check">✅</div>
                            <h4>SOS Signal Sent!</h4>
                            <p>We've captured your screen context and alerted your referral partner.</p>
                            <div style="background: rgba(5, 150, 105, 0.1); border: 1px solid rgba(5, 150, 105, 0.2); padding: 12px; border-radius: 8px; color: var(--tg-primary); font-size: 13px; font-weight: 600;">
                                They will review your issue and reach out to you shortly to help you finish your application.
                            </div>
                        </div>
                    `;
                    step2.classList.remove('tg-hidden');
                } else {
                    alert("Failed to send SOS. Please try again.");
                    sosBtn.innerText = "🚨 Send SOS & Request Zoom";
                    sosBtn.disabled = false;
                }
            });
        });
    });
}
