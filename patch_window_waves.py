with open('apply.html', 'r') as f:
    content = f.read()

old_fetch = """          // 2. Fetch active roles
          const response = await fetch('waves.json');
          const waves = await response.json();
          const roleList = (waves.roles || waves).map(w => ({ name: w.title, rate: w.hourlyRate || w.pay, url: w.applyUrl || w.linkTarget }));"""

new_fetch = """          // 2. Fetch active roles
          const response = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=12');
          const waves = await response.json();
          window.wavesData = waves.roles || waves; // Save for mapping later
          const roleList = (window.wavesData).map(w => ({ name: w.title, rate: w.hourlyRate || w.pay, url: w.applyUrl || w.linkTarget }));"""

content = content.replace(old_fetch, new_fetch)

with open('apply.html', 'w') as f:
    f.write(content)
print("Updated fetch to set window.wavesData")
