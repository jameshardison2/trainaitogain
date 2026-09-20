import re

# Update prep-hub.html
with open('prep-hub.html', 'r', encoding='utf-8') as f:
    hub = f.read()

hub = hub.replace('>Voice Evaluator Simulator<', '>Live AI Mock Interview<')
hub = hub.replace('Practice behavioral prompts live. Our Web Speech API analyzes your cadence, filler words, and delivers an instant confidence score.', 'Practice your interview skills with our interactive AI recruiter. Talk through your microphone, get real-time voice feedback, and conquer your interview anxiety before the real thing.')

with open('prep-hub.html', 'w', encoding='utf-8') as f:
    f.write(hub)
print("Updated prep-hub.html")


# Update ai-interview.html
with open('ai-interview.html', 'r', encoding='utf-8') as f:
    ai = f.read()
    
ai = ai.replace('>Voice Evaluator Simulator<', '>Live AI Mock Interview<')
ai = ai.replace('Voice AI Interview Simulator', 'Live AI Mock Interview')
ai = ai.replace('Practice behavioral prompts live.', 'Conquer your interview anxiety with our live voice AI mock interviewer.')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(ai)
print("Updated ai-interview.html")

