import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_block = """        const applyBtn = document.getElementById('apply-btn');
        if (applyBtn) {
            if (score >= 80) {
                applyBtn.disabled = false;
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
                applyBtn.style.background = 'var(--primary)';
                applyBtn.style.color = 'white';
                applyBtn.innerHTML = 'Next Step: AI Interview Prep ➔';
                // Trigger celebratory animation
                applyBtn.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
                setTimeout(() => applyBtn.style.boxShadow = 'none', 1500);
            } else {
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.6';
                applyBtn.style.cursor = 'not-allowed';
                applyBtn.style.background = 'var(--gray-400)';
                applyBtn.innerHTML = 'You must score 80%+ to Apply';
            }
        }
        
        const applyBtn = document.getElementById('apply-btn');
        if (applyBtn) {
            if (score >= 80) {
                applyBtn.disabled = false;
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
                applyBtn.style.background = 'var(--primary)';
                applyBtn.style.color = 'white';
                applyBtn.innerHTML = 'Next Step: AI Interview Prep ➔';
                // Trigger celebratory animation
                applyBtn.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
                setTimeout(() => applyBtn.style.boxShadow = 'none', 1500);
            } else {
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.6';
                applyBtn.style.cursor = 'not-allowed';
                applyBtn.style.background = 'var(--gray-400)';
                applyBtn.innerHTML = 'You must score 80%+ to Apply';
            }
        }"""

replace_block = """        if (applyBtn) {
            if (score >= 80) {
                applyBtn.disabled = false;
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
                applyBtn.style.background = 'var(--primary)';
                applyBtn.style.color = 'white';
                applyBtn.innerHTML = 'Next Step: AI Interview Prep ➔';
                // Trigger celebratory animation
                applyBtn.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
                setTimeout(() => applyBtn.style.boxShadow = 'none', 1500);
                
                applyBtn.onclick = () => window.location.href='prep-hub.html';
            } else {
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.6';
                applyBtn.style.cursor = 'not-allowed';
                applyBtn.style.background = 'var(--gray-400)';
                applyBtn.innerHTML = 'You must score 80%+ to Apply';
            }
        }"""

if find_block in html:
    html = html.replace(find_block, replace_block)
    print("Fixed syntax error!")
else:
    print("Could not find syntax error block.")

# Also fix the inner one in roleSelect
find_inner = """        const applyBtn = document.getElementById('apply-btn');
        if(applyBtn) {"""
replace_inner = """        if(applyBtn) {"""

html = html.replace(find_inner, replace_inner)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
