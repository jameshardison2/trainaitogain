with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

duplicate_wait = """            // Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }
            
            // Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }"""

single_wait = """            // Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }"""

content = content.replace(duplicate_wait, single_wait)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("duplicate wait block removed")
