const fs = require('fs');
let code = fs.readFileSync('ai-interview.html', 'utf8');

const modalHTML = `
<!-- Question Scorecard Modal -->
<div id="scorecard-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; align-items:center; justify-content:center; padding:24px; box-sizing:border-box; backdrop-filter:blur(8px);">
    <div style="background:var(--black); border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:100%; max-width:900px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 48px rgba(0,0,0,0.5); display:flex; flex-direction:column; animation:slideUp 0.3s ease-out;">
        
        <div style="padding:24px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(16,185,129,0.1), transparent);">
            <h2 style="color:white; margin:0; font-size:24px; font-weight:800; display:flex; align-items:center; gap:12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Post-Question Scorecard
            </h2>
            <button onclick="document.getElementById('scorecard-modal').style.display='none';" style="background:transparent; border:none; color:#888; font-size:24px; cursor:pointer; outline:none;">×</button>
        </div>
        
        <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
            
            <!-- Metrics Bar -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--primary);"></div>
                    <div style="color:#aaa; font-size:12px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">STAR+ Rubric</div>
                    <div id="modal-star-score" style="color:white; font-size:24px; font-weight:800;">Pass</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:#3b82f6;"></div>
                    <div style="color:#aaa; font-size:12px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Confidence Level</div>
                    <div id="modal-conf-score" style="color:white; font-size:24px; font-weight:800;">85%</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:#ef4444;"></div>
                    <div style="color:#aaa; font-size:12px; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Hesitation Markers</div>
                    <div id="modal-filler-score" style="color:#ef4444; font-size:24px; font-weight:800;">0</div>
                </div>
            </div>

            <!-- Comparison Split Screen -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
                <div>
                    <h3 style="color:white; font-size:14px; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:16px;">What You Said (Live Transcript)</h3>
                    <div id="modal-transcript" style="color:#ccc; font-size:14px; line-height:1.6; background:rgba(255,255,255,0.02); padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); height:250px; overflow-y:auto; font-style:italic;"></div>
                </div>
                <div>
                    <h3 style="color:white; font-size:14px; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:16px;">Ideal Script Model</h3>
                    <div id="modal-ideal" style="color:var(--primary); font-size:14px; line-height:1.6; background:rgba(16,185,129,0.05); padding:16px; border-radius:8px; border:1px solid rgba(16,185,129,0.2); height:250px; overflow-y:auto; font-weight:600;"></div>
                </div>
            </div>
            
            <div id="modal-ai-feedback" style="background:#1e1e1e; padding:16px; border-radius:8px; font-size:14px; color:#ddd; line-height:1.5; border-left:4px solid var(--primary);"></div>
            
        </div>
        
        <div style="padding:24px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); gap:16px; flex-wrap:wrap;">
            <button id="modal-drill-btn" style="background:transparent; border:1px solid rgba(239,68,68,0.5); color:#ef4444; font-weight:800; padding:12px 24px; border-radius:8px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'">Give Me a Harder Follow-Up 🎯</button>
            <button id="modal-next-btn" style="background:var(--primary); border:none; color:white; font-weight:800; padding:12px 32px; border-radius:8px; cursor:pointer; box-shadow:0 4px 12px rgba(16,185,129,0.3); transition:all 0.2s;" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">Next Question ➔</button>
        </div>
    </div>
</div>
`;

// Insert the modal into the body
code = code.replace('</body>', modalHTML + '\n</body>');

// Inject the CTA at the end of the module summary
const oldSummary = `<a href="post-hire.html" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; width:100%; max-width:300px; font-size:16px;">Next Step: Post-Hire Guide ➔</a>`;
const newSummary = `<a href="apply.html" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; width:100%; max-width:400px; font-size:16px; margin-bottom:16px; background:#3b82f6; box-shadow:0 8px 24px rgba(59, 130, 246, 0.4);">Your interview score qualifies you for 3 active roles. View matches now ➔</a><br>` + oldSummary;

code = code.replace(oldSummary, newSummary);

fs.writeFileSync('ai-interview.html', code);
console.log("Injected Modal and CTA successfully.");
