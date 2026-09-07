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
                <div class="tg-lifeline-chat-history" id="tg-chat-history">
                    <div class="tg-chat-msg tg-msg-ai">
                        <strong>I am your Screen Assistant!</strong><br><br>
                        We work alongside Maven to enhance your experience. Use Maven for general account questions, but talk to me if you need help navigating the screen or get stuck!
                    </div>
                </div>
                
                <div class="tg-quick-actions" id="tg-quick-actions" style="display:flex; gap:8px; margin-bottom:12px; overflow-x:auto; padding-bottom:4px;">
                    <button class="tg-qa-btn" data-qa="Where is the search filter?" style="background:var(--tg-surface); border:1px solid var(--tg-border); color:var(--tg-text); font-size:11px; padding:6px 10px; border-radius:100px; cursor:pointer; white-space:nowrap;">Where is the search?</button>
                    <button class="tg-qa-btn" data-qa="My camera won't connect." style="background:var(--tg-surface); border:1px solid var(--tg-border); color:var(--tg-text); font-size:11px; padding:6px 10px; border-radius:100px; cursor:pointer; white-space:nowrap;">Fix Camera</button>
                    <button class="tg-qa-btn" data-qa="I need SOS Live Help." style="background:var(--tg-surface); border:1px solid var(--tg-border); color:var(--tg-text); font-size:11px; padding:6px 10px; border-radius:100px; cursor:pointer; white-space:nowrap;">SOS Live Help</button>
                </div>

                <form id="tg-chat-form" class="tg-chat-input-area">
                    <input type="text" id="tg-chat-input" class="tg-chat-input" placeholder="Tell me what to click..." autocomplete="off">
                    <button type="submit" id="tg-chat-send" class="tg-chat-send">➔</button>
                </form>
                
                <div class="tg-lifeline-sos-section">
                    <p>Total emergency?</p>
                    <button id="tg-lifeline-sos-btn" class="tg-btn-danger">🚨 Send SOS to Referral Partner</button>
                </div>
            </div>

            <div class="tg-lifeline-body tg-hidden" id="tg-lifeline-step-2">
                <div class="tg-sos-success">
                    <div class="tg-check">✅</div>
                    <h4>SOS Signal Sent!</h4>
                    <p>We've captured your screen and alerted our affiliates.</p>
                    <div style="background: rgba(5, 150, 105, 0.1); border: 1px solid rgba(5, 150, 105, 0.2); padding: 12px; border-radius: 8px; color: var(--tg-primary); font-size: 13px; font-weight: 600;">
                        They will review your issue and reach out to you shortly to help you finish your application.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(widget);
    
    // Event Listeners
    const btn = document.getElementById('tg-lifeline-btn');
    const modal = document.getElementById('tg-lifeline-modal');
    const closeBtn = document.getElementById('tg-lifeline-close');
    
    btn.addEventListener('click', () => {
        modal.classList.remove('tg-hidden');
        btn.classList.add('tg-hidden');
        document.getElementById('tg-chat-input').focus();
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
    
    // Chat Logic
    const chatForm = document.getElementById('tg-chat-form');
    const chatInput = document.getElementById('tg-chat-input');
    const chatHistory = document.getElementById('tg-chat-history');
    const chatSendBtn = document.getElementById('tg-chat-send');

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `tg-chat-msg ${sender === 'user' ? 'tg-msg-user' : 'tg-msg-ai'}`;
        msg.innerText = text;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function executeDOMAction(action) {
        if (!action) return;
        
        if (action.type === 'highlightSearch') {
            const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
            searchInputs.forEach(input => {
                if (input.placeholder && input.placeholder.toLowerCase().includes('search')) {
                    input.style.transition = 'box-shadow 0.3s ease-in-out';
                    input.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.5)';
                    input.focus();
                    setTimeout(() => input.style.boxShadow = '', 3000);
                }
            });
        } else if (action.type === 'highlightFilter') {
            const buttons = document.querySelectorAll('button, div[role="button"]');
            buttons.forEach(btn => {
                if (btn.innerText && (btn.innerText.toLowerCase().includes('filter') || btn.innerText.toLowerCase().includes('priority'))) {
                    btn.style.transition = 'box-shadow 0.3s ease-in-out';
                    btn.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.5)';
                    setTimeout(() => btn.style.boxShadow = '', 3000);
                }
            });
        }
    }

    document.querySelectorAll('.tg-qa-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const qaText = e.target.getAttribute('data-qa');
            if (qaText) {
                chatInput.value = qaText;
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        chrome.runtime.sendMessage({
            action: 'chatMessage',
            payload: { message: text }
        }, (response) => {
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();

            if (response && response.success) {
                if (response.reply) {
                    addMessage(response.reply, 'ai');
                }
                if (response.domAction) {
                    executeDOMAction(response.domAction);
                }
            } else {
                addMessage("Sorry, I encountered an error. Please try again or use the SOS button.", 'ai');
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
