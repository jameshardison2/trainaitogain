import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_click = """  startBtn.addEventListener('click', () => {
    currentDomain = domainSelector.value;"""
replace_click = """  startBtn.addEventListener('click', () => {
    // UNLOCK SPEECH ENGINE SYNCHRONOUSLY
    const unlockUtterance = new SpeechSynthesisUtterance('');
    unlockUtterance.volume = 0;
    window.speechSynthesis.speak(unlockUtterance);

    currentDomain = domainSelector.value;"""
html = html.replace(find_click, replace_click)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Unlocked speech engine")
