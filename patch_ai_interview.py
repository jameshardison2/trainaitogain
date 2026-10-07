import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# UC-13: Concurrent Interview Sessions
uc13_patch = """
<script>
// UC-13: Prevent concurrent interview sessions across tabs
const interviewChannel = new BroadcastChannel('interview_session_lock');
interviewChannel.postMessage('new_session');
interviewChannel.onmessage = (msg) => {
    if (msg.data === 'new_session') {
        alert('Another interview session was opened in a different tab. Closing this tab to prevent audio buffer desynchronization.');
        window.close();
    }
};
</script>
</head>"""
content = content.replace("</head>", uc13_patch)

# UC-17: Audio Device Disconnection (SpeechRecognition error handler)
old_onerror = """      recognition.onerror = (e) => {
         if (e.error === 'no-speech' && isAnswering) {
             // Ignore no-speech and keep listening
         }
      };"""

new_onerror = """      recognition.onerror = (e) => {
         if (e.error === 'no-speech' && isAnswering) {
             // Ignore no-speech and keep listening
         } else if (e.error === 'audio-capture' || e.error === 'not-allowed' || e.error === 'aborted') {
             alert('Hardware Error: Microphone disconnected mid-session. Please reconnect your audio device and refresh.');
             if(window.activeStream) window.activeStream.getTracks().forEach(t => t.stop());
         }
      };"""
content = content.replace(old_onerror, new_onerror)

# UC-03: Timer Glitch (Clear timers on question switch)
# We will inject a clearInterval and clear state at the top of nextBtn click.
old_nextBtn = "  nextBtn.addEventListener('click', () => {"
new_nextBtn = """  nextBtn.addEventListener('click', () => {
    // UC-03: Clear countdown timers to prevent desync during rapid question switches
    if(window.paceTimer) clearInterval(window.paceTimer);
    if(window.fallbackTimer) clearTimeout(window.fallbackTimer);
    const paceWarning = document.getElementById('pace-warning');
    if (paceWarning) paceWarning.style.display = 'none';
"""
content = content.replace(old_nextBtn, new_nextBtn)

# Also define window.paceTimer around the interval
old_interval = "setInterval(() => {\n        const video = document.getElementById('user-camera');"
new_interval = "window.paceTimer = setInterval(() => {\n        const video = document.getElementById('user-camera');"
content = content.replace(old_interval, new_interval)

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("ai-interview patched")
