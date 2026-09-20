import re, json

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will use a regex to find all instances of feedbackHit and inject an 'answer' field below it.
def replacer(match):
    full_match = match.group(0)
    # Extract keywords to construct a generic answer
    return full_match

# Actually, it's easier to just do a strict replace on the raw text for each domain.
# Since there are 18 questions, I'll just write a quick dictionary map.
answers_map = {
    "Explain how a Transformer architecture works to a non-technical manager.": "Unlike older models that read word-by-word, Transformers look at the whole sentence all at once. This parallel processing allows them to understand context and relationships much faster.",
    "What is the difference between supervised fine-tuning and RLHF?": "Supervised fine-tuning teaches the model basic facts and capabilities. RLHF is used later to teach the model manners and align its behavior with human preferences.",
    "If an AI generates a response that is factually correct but highly biased, how do you provide feedback?": "I would rewrite the answer to maintain a completely neutral, objective tone, and penalize the biased response in the RLHF reward model.",
    
    "Explain the difference between supervised and unsupervised learning, and when you would use each.": "Supervised learning uses labeled data to predict targets. Unsupervised learning uses unlabeled data to find hidden clusters and patterns.",
    "How do you evaluate an AI model that writes SQL queries for a massive, unnormalized database?": "I would evaluate the query's execution plan and efficiency, ensuring it uses indexes properly and avoids complex Cartesian joins that cause timeouts.",
    "An AI generates a Pandas script that causes an OutOfMemory error on a 50GB dataset. How do you fix it?": "I would optimize the script by chunking the data using iterators, or by switching to lazy-evaluation libraries like Dask.",
    
    "How do you prioritize feature development when engineering constraints clash with immediate user needs?": "I would use an impact-versus-effort matrix to find trade-offs, focusing on delivering a Minimum Viable Product (MVP) to stakeholders first for rapid iteration.",
    "An AI model generates a product roadmap that ignores technical debt. How do you correct this?": "I would instruct the AI to allocate a specific percentage of sprint capacity to refactoring. Balancing feature delivery with maintenance is crucial for long-term velocity.",
    "How do you evaluate an AI-generated user story for a complex technical feature?": "I evaluate it by checking if it has clear, testable acceptance criteria, explicitly handles edge cases, and clearly defines who receives the value.",
    
    "An AI fails a multi-step calculus derivation. Walk me through your step-by-step verification process.": "I would break the derivation down to verify intermediate steps, like isolating where the chain rule was applied, to find exactly where the hallucination occurred.",
    "How do you evaluate an AI model's code for solving a system of non-linear differential equations?": "I would evaluate the numerical stability and convergence rates of the code, and ensure it chose the appropriate solver with a strict error tolerance.",
    "If an AI model hallucinated a proof in linear algebra, what specific constraints would you add to the prompt?": "I would explicitly constrain the prompt to cite specific axioms and theorems at each step to enforce mathematical rigor and prevent contradictions.",
    
    "How do you evaluate an AI's translation of an idiomatic phrase where a direct translation loses the original cultural context?": "I evaluate based on whether it correctly localizes the intent and cultural nuance, rather than just providing a literal, direct equivalent.",
    "An AI model struggles with gendered nouns in a highly inflected language. How do you train it to improve?": "I would heavily penalize agreement errors during RLHF, training the model to recognize syntax clues and context for proper grammar.",
    "Explain how you would write a prompt to force an LLM to output text in a specific regional dialect.": "I would provide few-shot examples of the dialect, specify exact colloquial vocabulary and slang to use, and define the required formal or informal register.",
    
    "You are given a model output containing multiple historical claims. Walk me through your fact-checking workflow.": "I would isolate each specific claim and cross-reference it against primary sources, strictly verifying every citation to check for hallucinations or bias."
}

for q_text, ans_text in answers_map.items():
    # Find the question block and insert the answer
    # We look for the exact string `q: "..."` and inject `answer: "...",` below it
    q_str = f'q: "{q_text}",'
    replace_str = f'q: "{q_text}",\n        answer: "{ans_text}",'
    html = html.replace(q_str, replace_str)

# Cache bust
html = html.replace('<!-- CACHE BUST 14', '<!-- CACHE BUST 15')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected full answers into domainData")
