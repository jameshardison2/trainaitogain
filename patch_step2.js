const fs = require('fs');
let code = fs.readFileSync('resume-ats-guide.html', 'utf8');

// 1. Add tabs to Step 2
const oldStep2Label = `<label for="role-select" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">2. Target Role:</label>`;
const newStep2Label = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
    <label for="role-select" style="display:block; font-weight:700; color:var(--black); margin:0;">2. Target Role:</label>
    <div style="background:var(--gray-100); border-radius:6px; padding:4px; display:inline-flex; border:1px solid var(--gray-200);">
        <button id="tab-mercor" type="button" style="background:var(--white); border:1px solid var(--gray-200); border-radius:4px; padding:4px 12px; font-size:12px; font-weight:700; color:var(--black); cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s;">Partner Network</button>
        <button id="tab-custom" type="button" style="background:transparent; border:none; border-radius:4px; padding:4px 12px; font-size:12px; font-weight:700; color:var(--gray-500); cursor:pointer; transition:all 0.2s;">Custom Job Description</button>
    </div>
</div>`;
code = code.replace(oldStep2Label, newStep2Label);

// 2. Add Custom JD Textarea just below the custom-role-select
const oldRoleSelect = `<!-- Hidden input to store value so existing JS continues to work -->
        <input type="hidden" id="role-select" value="" />`;
const newRoleSelect = `<!-- Hidden input to store value so existing JS continues to work -->
        <input type="hidden" id="role-select" value="" />
        
        <div id="custom-jd-container" style="display:none; margin-bottom:24px;">
            <textarea id="custom-jd-input" placeholder="Paste any job description from LinkedIn, Greenhouse, Lever, etc. here..." style="width:100%; height:120px; padding:12px; border-radius:var(--radius); border:2px solid var(--gray-200); font-family:var(--font); font-size:14px; box-sizing:border-box; outline:none; resize:vertical; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-200)';"></textarea>
            <div style="font-size:11px; color:var(--gray-500); margin-top:4px; text-align:right;">Keywords will be extracted automatically</div>
        </div>`;
code = code.replace(oldRoleSelect, newRoleSelect);

// 3. Add Custom JD Extraction Logic
// I will inject this script near the end of the file, before </body>
const customJDScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
    const tabMercor = document.getElementById('tab-mercor');
    const tabCustom = document.getElementById('tab-custom');
    const roleSelectUi = document.getElementById('custom-role-select');
    const customJdContainer = document.getElementById('custom-jd-container');
    const customJdInput = document.getElementById('custom-jd-input');
    const hiddenSelect = document.getElementById('role-select');
    
    if(tabMercor && tabCustom) {
        tabMercor.addEventListener('click', () => {
            tabMercor.style.background = 'var(--white)';
            tabMercor.style.color = 'var(--black)';
            tabMercor.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            tabMercor.style.border = '1px solid var(--gray-200)';
            
            tabCustom.style.background = 'transparent';
            tabCustom.style.color = 'var(--gray-500)';
            tabCustom.style.boxShadow = 'none';
            tabCustom.style.border = 'none';
            
            roleSelectUi.style.display = 'block';
            customJdContainer.style.display = 'none';
            
            // Re-trigger the selection of whatever was in the mercor dropdown
            // (or let the user select it)
            if(hiddenSelect.value === 'Custom Job' && window.allRoles && window.allRoles.length > 0) {
                hiddenSelect.value = window.allRoles[0].title;
                hiddenSelect.dispatchEvent(new Event('change'));
            }
        });
        
        tabCustom.addEventListener('click', () => {
            tabCustom.style.background = 'var(--white)';
            tabCustom.style.color = 'var(--black)';
            tabCustom.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            tabCustom.style.border = '1px solid var(--gray-200)';
            
            tabMercor.style.background = 'transparent';
            tabMercor.style.color = 'var(--gray-500)';
            tabMercor.style.boxShadow = 'none';
            tabMercor.style.border = 'none';
            
            roleSelectUi.style.display = 'none';
            customJdContainer.style.display = 'block';
            
            hiddenSelect.value = 'Custom Job';
            // Force the change event to reset the scanner UI
            hiddenSelect.dispatchEvent(new Event('change'));
            
            if(customJdInput.value.trim() !== '') {
                extractAndRenderCustomKeywords();
            }
        });
    }

    const stopWords = new Set(["the", "and", "to", "of", "in", "for", "with", "is", "on", "that", "by", "this", "an", "as", "be", "are", "or", "from", "at", "it", "your", "will", "have", "we", "our", "you", "can", "their", "has", "not", "but", "all", "about", "which", "more", "if", "they", "there", "what", "so", "when", "how", "who", "up", "out", "get", "go", "me", "my", "us", "i", "he", "she", "them", "experience", "work", "job", "role", "team", "years", "skills", "ability", "including", "working", "strong", "required", "using", "support", "development", "knowledge", "must", "preferred", "status", "related", "other", "such", "within", "new", "ensure", "provide", "business", "data"]);

    function extractAndRenderCustomKeywords() {
        const text = customJdInput.value.trim().toLowerCase();
        if(!text) {
            window.keywordSets['Custom Job'] = ['Experience', 'Skills', 'Communication', 'Teamwork', 'Project', 'Analysis', 'Management', 'Requirements'];
        } else {
            const words = text.match(/[a-z]+/g) || [];
            const counts = {};
            words.forEach(w => {
                if(w.length > 3 && !stopWords.has(w)) counts[w] = (counts[w]||0)+1;
            });
            const sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
            // Take top 12 keywords
            const kws = sorted.slice(0, 12).map(w => w.charAt(0).toUpperCase() + w.slice(1));
            if(kws.length === 0) kws.push('Keywords', 'Not', 'Found');
            window.keywordSets['Custom Job'] = kws;
        }
        
        // Use the global renderKeywords if it exists (might need to call it via the global scope if possible, 
        // but renderKeywords is scoped inside the fetch. We can just dispatch the change event!
        // But change event will wipe the score. That's fine if they are typing a new JD.
        hiddenSelect.value = 'Custom Job';
        
        // Wait, dispatching change event resets the scanner.
        // If we want it to be instant *without* wiping, we need access to the DOM.
        const kwListEl = document.getElementById('keyword-list');
        kwListEl.innerHTML = '';
        window.keywordSets['Custom Job'].forEach(kw => {
            const chip = document.createElement('div');
            chip.className = 'kw-chip pending';
            chip.innerText = kw;
            kwListEl.appendChild(chip);
        });
        
        // Enable scan button
        const scanBtn = document.getElementById('scan-btn');
        if(scanBtn) {
            scanBtn.disabled = false;
            scanBtn.style.opacity = '1';
            scanBtn.innerText = 'Scan My Resume';
        }
    }

    if(customJdInput) {
        // Debounce the input so we don't re-render on every keystroke too aggressively
        let timeout = null;
        customJdInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(extractAndRenderCustomKeywords, 300);
        });
    }
});
</script>
`;

// Insert the script right before </body>
code = code.replace('</body>', customJDScript + '\n</body>');

fs.writeFileSync('resume-ats-guide.html', code);
console.log("Patched Step 2 with Custom JD mode successfully.");
