with open("resume-ats-guide.html", "r") as f:
    content = f.read()

# Replace the auto-load saved resume logic
old_autoload = """    // AUTO-LOAD SAVED RESUME
    const savedResume = localStorage.getItem('savedUserResume');
    if (savedResume) {
        document.getElementById('resume-text').value = savedResume;
        // AUTOMATICALLY TRIGGER AUTO-MATCH IN BACKGROUND!
        setTimeout(() => {
            const autoBtn = document.getElementById('btn-auto-match');
            if (autoBtn) autoBtn.click();
        }, 500);
    }"""

new_autoload = """    // AUTO-LOAD SAVED RESUME
    const savedResume = localStorage.getItem('savedUserResume');
    if (savedResume) {
        document.getElementById('resume-text').value = savedResume;
        // AUTOMATICALLY TRIGGER AUTO-MATCH IN BACKGROUND!
        setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (!params.get('role')) {
                const autoBtn = document.getElementById('btn-auto-match');
                if (autoBtn) autoBtn.click();
            }
        }, 500);
    }"""

if "if (!params.get('role')) {" not in content:
    content = content.replace(old_autoload, new_autoload)

# Replace the URL param logic
old_url_logic = """                // Find and trigger the hidden option if needed
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
  });"""

new_url_logic = """                // Find and trigger the hidden option if needed
                const customOptionsDiv = document.getElementById('custom-role-options');
                if (customOptionsDiv) {
                    const options = customOptionsDiv.querySelectorAll('.custom-role-option');
                    options.forEach(opt => {
                        if (opt.textContent === passedRole) {
                            opt.click();
                        }
                    });
                }
                
                // If a resume is already loaded, auto-run the scan for this role!
                setTimeout(() => {
                    const rBox = document.getElementById('resume-text');
                    const sBtn = document.getElementById('scan-btn');
                    if (rBox && rBox.value.length >= 50 && sBtn) {
                        sBtn.disabled = false;
                        sBtn.click();
                    }
                }, 600);
            }
        }, 500); // give the fetch waves.json time to complete
    }
  });"""

if "auto-run the scan for this role!" not in content:
    content = content.replace(old_url_logic, new_url_logic)

with open("resume-ats-guide.html", "w") as f:
    f.write(content)
