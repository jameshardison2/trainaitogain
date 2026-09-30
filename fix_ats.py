with open("resume-ats-guide.html", "r") as f:
    content = f.read()

# I will add a script to the bottom of the body (or in DOMContentLoaded) that reads ?role=... and selects it.
injection = """
  // Global Affiliate Tracker
  (function() {
    var ref = new URLSearchParams(window.location.search).get('ref');
"""

new_injection = """
  // Auto-Select Role from URL if passed via ?role=...
  document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const passedRole = params.get('role');
    if (passedRole) {
        setTimeout(() => {
            const hiddenInput = document.getElementById('role-select');
            const customDisplayText = document.getElementById('custom-role-text');
            if (hiddenInput && customDisplayText) {
                hiddenInput.value = passedRole;
                customDisplayText.textContent = passedRole;
                
                // Trigger the selection logic (this fires the updateRequirements)
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
                
                // Find and trigger the hidden option if needed
                const customOptionsDiv = document.getElementById('custom-role-options');
                if (customOptionsDiv) {
                    const options = customOptionsDiv.querySelectorAll('.custom-role-option');
                    options.forEach(opt => {
                        if (opt.textContent === passedRole) {
                            opt.click();
                        }
                    });
                }
            }
        }, 500); // give the fetch waves.json time to complete
    }
  });

  // Global Affiliate Tracker
  (function() {
    var ref = new URLSearchParams(window.location.search).get('ref');
"""

if "Auto-Select Role from URL" not in content:
    content = content.replace(injection, new_injection)

with open("resume-ats-guide.html", "w") as f:
    f.write(content)

