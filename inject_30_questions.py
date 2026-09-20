import re, json

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the massive new domainData
domainData = {
  "software": [
    {
      "q": "I see you have experience with distributed systems. Explain how you would handle network partitions in a microservices architecture to ensure high availability.",
      "answer": "I would implement the Circuit Breaker pattern to prevent cascading failures, use fallback mechanisms for degraded functionality, and design the system with eventual consistency in mind using asynchronous event queues.",
      "keywords": ["circuit breaker", "fallback", "eventual consistency", "asynchronous", "queue", "CAP theorem"],
      "feedbackMiss": "You didn't address the core architectural patterns. A strong answer must mention Circuit Breakers, fallbacks, or eventual consistency to handle partitions.",
      "feedbackHit": "Excellent. You correctly identified Circuit Breakers and eventual consistency as the standard patterns for network partition tolerance."
    },
    {
      "q": "Walk me through how you would optimize a React application that is experiencing severe re-rendering issues on a complex dashboard.",
      "answer": "I would profile the app using React DevTools to identify unnecessary renders, then memoize expensive components using React.memo, and optimize state management by keeping local state close to where it's used rather than in a global context.",
      "keywords": ["profile", "devtools", "memo", "useMemo", "local state", "context"],
      "feedbackMiss": "You missed the profiling step. You should always start by using React DevTools to measure, and then apply memoization strategies like React.memo or useMemo.",
      "feedbackHit": "Spot on. Profiling first and then applying targeted memoization is exactly how a senior engineer handles this."
    },
    {
      "q": "Explain the underlying mechanism of how a garbage collector works in a language like Java or Go, and how it impacts latency.",
      "answer": "Garbage collectors typically use a mark-and-sweep algorithm to identify unreachable objects. This process can cause 'stop-the-world' pauses, which directly increase tail latency in high-throughput applications if not tuned properly.",
      "keywords": ["mark and sweep", "unreachable", "stop-the-world", "pause", "tail latency", "heap"],
      "feedbackMiss": "You didn't explain the latency impact. You must mention 'stop-the-world' pauses and how they create tail latency spikes in production.",
      "feedbackHit": "Great explanation. Linking mark-and-sweep mechanics to tail latency shows deep systems knowledge."
    }
  ],
  "data": [
    {
      "q": "You are building a recommendation engine. How do you mitigate the 'cold start' problem for brand new users?",
      "answer": "For new users, I would fall back to a popularity-based model or use content-based filtering based on their initial onboarding questionnaire until we gather enough interaction data for collaborative filtering.",
      "keywords": ["popularity", "content-based", "onboarding", "collaborative", "fallback", "heuristic"],
      "feedbackMiss": "You missed the fallback strategies. You need to explicitly mention using popularity-based recommendations or content-based filtering for new users.",
      "feedbackHit": "Perfect. Switching between content-based and collaborative filtering is the exact solution to the cold start problem."
    },
    {
      "q": "How would you design a data pipeline to ingest 5 terabytes of streaming log data per day with sub-second latency requirements?",
      "answer": "I would use Apache Kafka as the distributed event streaming platform to buffer the data, process it in real-time using Apache Flink or Spark Streaming, and sink it into a fast OLAP database like ClickHouse.",
      "keywords": ["Kafka", "Flink", "streaming", "buffer", "ClickHouse", "OLAP"],
      "feedbackMiss": "You didn't specify the right tools for sub-second streaming. You should mention Kafka for ingestion and Flink or Spark for stream processing.",
      "feedbackHit": "Excellent architectural choices. Kafka combined with Flink and ClickHouse perfectly handles high-throughput, low-latency streaming."
    },
    {
      "q": "Explain the concept of Data Leakage in machine learning training and how you prevent it.",
      "answer": "Data leakage occurs when information from outside the training dataset is used to create the model, artificially inflating performance. I prevent it by strictly splitting data before any preprocessing or feature engineering occurs.",
      "keywords": ["leakage", "inflate", "split", "preprocessing", "feature engineering", "future"],
      "feedbackMiss": "You missed the prevention step. You must emphasize that train/test splitting must occur BEFORE any feature engineering or scaling.",
      "feedbackHit": "Spot on. Applying the train/test split prior to preprocessing is the golden rule to prevent leakage."
    }
  ],
  "product": [
    {
      "q": "Your engineering team says a critical feature will take 3 months, but sales needs it in 3 weeks to close a major deal. How do you handle this?",
      "answer": "I would sit down with engineering to brutally scope down the feature to its absolute Minimum Viable Product, removing all edge cases, and negotiate with sales to deliver that core value in 3 weeks while scheduling the rest later.",
      "keywords": ["scope", "MVP", "negotiate", "edge cases", "core value", "compromise"],
      "feedbackMiss": "You didn't focus on scoping. The PM's job here is to ruthlessly cut scope to an MVP to meet the deadline without burning out the team.",
      "feedbackHit": "Great answer. Ruthless prioritization and MVP scoping is exactly how a PM resolves timeline conflicts."
    },
    {
      "q": "How do you measure the success of a newly launched onboarding flow?",
      "answer": "I would track the conversion rate through each step of the funnel to identify drop-offs, measure the time-to-first-value, and look at the 7-day retention rate of cohorts who experienced the new flow versus the old one.",
      "keywords": ["funnel", "conversion", "drop-off", "time-to-value", "retention", "cohort"],
      "feedbackMiss": "You missed the cohort analysis. You need to explicitly mention tracking the funnel drop-off and comparing retention cohorts.",
      "feedbackHit": "Excellent metrics. Time-to-first-value and cohort retention are the strongest indicators of onboarding success."
    },
    {
      "q": "Tell me about a time you had to pivot a product strategy based on user data.",
      "answer": "We noticed through Mixpanel that users were completely ignoring our primary feature and heavily using a secondary sharing tool. We immediately reallocated engineering resources to expand the sharing tool, which doubled our active users.",
      "keywords": ["data", "analytics", "reallocate", "resources", "ignore", "double"],
      "feedbackMiss": "You didn't give a clear hypothetical or structural response. Mention using an analytics tool, observing unexpected behavior, and decisively reallocating resources.",
      "feedbackHit": "Perfect structure. You highlighted the data source, the surprising insight, and the decisive action taken."
    }
  ],
  "math": [
    {
      "q": "Explain the concept of eigenvectors and eigenvalues, and give a practical application in machine learning.",
      "answer": "An eigenvector is a vector whose direction does not change when a linear transformation is applied, and the eigenvalue is the scale of that stretch. In ML, they are the foundation of Principal Component Analysis for dimensionality reduction.",
      "keywords": ["direction", "transformation", "scale", "PCA", "dimensionality", "reduction"],
      "feedbackMiss": "You missed the ML application. You must explicitly connect eigenvectors to Principal Component Analysis (PCA) and dimensionality reduction.",
      "feedbackHit": "Spot on. Connecting eigenvectors directly to PCA shows strong applied mathematical knowledge."
    },
    {
      "q": "Walk me through how Gradient Descent optimizes a loss function.",
      "answer": "Gradient descent calculates the derivative of the loss function with respect to each weight to find the direction of steepest ascent. It then updates the weights by taking a small step in the opposite direction, controlled by the learning rate.",
      "keywords": ["derivative", "steepest", "opposite", "learning rate", "update", "minimum"],
      "feedbackMiss": "You missed the derivative concept. You need to explain that it calculates the gradient (derivative) to find the slope, and moves in the opposite direction.",
      "feedbackHit": "Excellent. You clearly explained the relationship between the derivative, the learning rate, and the weight update."
    },
    {
      "q": "What is the difference between L1 and L2 regularization mathematically, and how do they affect the model?",
      "answer": "L1 adds the absolute value of the weights to the loss, driving less important weights exactly to zero, creating a sparse model. L2 adds the squared value of the weights, forcing them to be small but rarely exactly zero.",
      "keywords": ["absolute", "zero", "sparse", "squared", "small", "penalty"],
      "feedbackMiss": "You didn't mention sparsity. You must explicitly state that L1 drives weights to absolute zero (feature selection), while L2 just shrinks them.",
      "feedbackHit": "Perfect. Distinguishing between L1's sparsity and L2's shrinkage is exactly what we look for."
    }
  ],
  "language": [
    {
      "q": "How would you design an evaluation prompt to grade an LLM's ability to maintain a specific persona across a long conversation?",
      "answer": "I would prompt the evaluator LLM to act as a strict linguistic judge, providing it with the exact character traits, and instruct it to penalize any responses that break character, use modern slang inappropriately, or contradict previous statements.",
      "keywords": ["judge", "traits", "penalize", "break character", "slang", "contradict"],
      "feedbackMiss": "You lacked specificity in the grading criteria. You need to tell the evaluator to look for specific infractions like breaking character or logical contradictions.",
      "feedbackHit": "Great answer. Setting up the evaluator as a strict judge with specific penalty conditions is the industry standard."
    },
    {
      "q": "An AI model is translating English idioms literally into Spanish, losing the meaning. How do we fix this in the training data?",
      "answer": "We need to curate a high-quality dataset of idiomatic pairs and use supervised fine-tuning. We should also implement RLHF to heavily penalize literal translations of known idioms and reward culturally equivalent phrases.",
      "keywords": ["curate", "pairs", "SFT", "RLHF", "penalize", "equivalent"],
      "feedbackMiss": "You missed the RLHF component. You should mention penalizing literal translations and rewarding cultural equivalents using reinforcement learning.",
      "feedbackHit": "Spot on. Combining SFT with curated pairs and RLHF penalties is the right approach for idiomatic translation."
    },
    {
      "q": "Explain the challenge of tokenization for morphologically rich languages like Turkish or Finnish.",
      "answer": "Because words are formed by stacking many suffixes, standard subword tokenizers like BPE often split words in ways that destroy grammatical meaning. It requires custom morphological tokenizers that respect the language's root structures.",
      "keywords": ["suffixes", "BPE", "split", "destroy", "morphological", "root"],
      "feedbackMiss": "You didn't explain WHY it's a problem. You must mention that standard BPE tokenizers split words arbitrarily, destroying the root grammatical meaning.",
      "feedbackHit": "Excellent. You accurately identified the conflict between standard BPE tokenization and suffix-heavy agglutinative languages."
    }
  ],
  "medical": [
    {
      "q": "How do you evaluate an AI model designed to detect anomalies in MRI scans to ensure it doesn't have a high false-negative rate?",
      "answer": "I would prioritize tracking the Recall metric over Precision, ensuring the threshold is set conservatively. I would also mandate that the test set includes a highly diverse demographic pool to check for bias in edge-case anomalies.",
      "keywords": ["Recall", "Precision", "threshold", "diverse", "demographic", "bias"],
      "feedbackMiss": "You missed the statistical metrics. In medical anomaly detection, you must explicitly state that Recall (minimizing false negatives) is vastly more important than Precision.",
      "feedbackHit": "Perfect. Prioritizing Recall and checking for demographic bias is critical for medical AI safety."
    },
    {
      "q": "An LLM is giving outdated pharmacological dosing advice. How do you force it to adhere strictly to current medical guidelines?",
      "answer": "I would implement a Retrieval-Augmented Generation (RAG) architecture that queries a strictly curated, up-to-date medical database, and instruct the system prompt to explicitly refuse to answer if the information is not in the retrieved documents.",
      "keywords": ["RAG", "retrieval", "curated", "database", "refuse", "hallucination"],
      "feedbackMiss": "You didn't mention RAG. You cannot rely on model weights for dosing; you must use Retrieval-Augmented Generation connected to a verified medical database.",
      "feedbackHit": "Excellent. Using RAG and instructing the model to refuse unverified answers prevents dangerous medical hallucinations."
    },
    {
      "q": "What ethical considerations must be evaluated when training a diagnostic AI on historical patient records?",
      "answer": "We must strictly anonymize the data to comply with HIPAA, and rigorously audit the historical records for systemic bias, as past diagnostic data often reflects historical healthcare disparities against minority groups.",
      "keywords": ["anonymize", "HIPAA", "audit", "bias", "disparities", "minority"],
      "feedbackMiss": "You missed the bias audit. While HIPAA is important, you must also address that historical data contains systemic biases that the AI will learn if not corrected.",
      "feedbackHit": "Spot on. Addressing both privacy (HIPAA) and historical systemic bias shows deep medical AI ethics."
    }
  ],
  "finance": [
    {
      "q": "How do you evaluate a trading algorithm's backtest to ensure it isn't overfitted to historical data?",
      "answer": "I would strictly separate the data into training and out-of-sample holdout sets, evaluate the Sharpe ratio across different market regimes, and check if the strategy degrades significantly when small transaction costs and slippage are added.",
      "keywords": ["out-of-sample", "holdout", "Sharpe", "regimes", "transaction costs", "slippage"],
      "feedbackMiss": "You didn't mention slippage or out-of-sample testing. You must emphasize testing on holdout data and accounting for real-world transaction costs.",
      "feedbackHit": "Great answer. Checking out-of-sample performance and factoring in slippage are the hallmarks of a robust backtest."
    },
    {
      "q": "Explain how you would prompt an LLM to extract complex covenants from a 200-page corporate bond prospectus.",
      "answer": "I would break the document into overlapping chunks, pass each chunk through the LLM with a highly structured JSON schema prompt demanding specific covenant fields, and use a final map-reduce step to consolidate the extracted clauses.",
      "keywords": ["chunks", "overlapping", "JSON", "schema", "map-reduce", "consolidate"],
      "feedbackMiss": "You missed the chunking strategy. LLMs have context limits; you must mention chunking the document and forcing a structured JSON output.",
      "feedbackHit": "Perfect. Chunking with a strict JSON schema and a map-reduce consolidation is the exact right pipeline."
    },
    {
      "q": "What is the difference between Delta and Gamma in options pricing, and why does an AI model need to understand both?",
      "answer": "Delta measures the rate of change of the option price relative to the underlying asset, while Gamma measures the rate of change of the Delta itself. The AI must understand both to accurately hedge against large, sudden market movements.",
      "keywords": ["rate of change", "underlying", "Gamma", "hedge", "sudden", "acceleration"],
      "feedbackMiss": "You missed the hedging application. You need to explain that Gamma is the acceleration of Delta, which is critical for dynamic hedging.",
      "feedbackHit": "Excellent. Defining Gamma as the derivative of Delta and linking it to dynamic hedging is exactly correct."
    }
  ],
  "creative": [
    {
      "q": "How do you prompt an AI to write a fictional story that has a genuine emotional arc, rather than just a flat sequence of events?",
      "answer": "I would prompt the AI using the 'Save the Cat' beat sheet framework, explicitly forcing it to outline the protagonist's internal flaw, the inciting incident, and the specific emotional realization at the climax before generating the prose.",
      "keywords": ["beat sheet", "framework", "flaw", "inciting incident", "climax", "outline"],
      "feedbackMiss": "You didn't provide a structural framework. You should mention using established narrative frameworks like 'Save the Cat' or the Hero's Journey in the prompt.",
      "feedbackHit": "Spot on. Forcing the AI to outline the emotional beats using a framework BEFORE generating prose yields the best results."
    },
    {
      "q": "An AI is generating dialogue that sounds completely robotic and overly formal. How do you fix the prompt?",
      "answer": "I would instruct the AI to use contractions, allow characters to interrupt each other, use sentence fragments, and provide specific few-shot examples of natural, messy human conversation in the system prompt.",
      "keywords": ["contractions", "interrupt", "fragments", "few-shot", "messy", "examples"],
      "feedbackMiss": "You missed the specific linguistic instructions. You need to explicitly tell the AI to use contractions and sentence fragments to break the formal tone.",
      "feedbackHit": "Great answer. Specifying contractions, fragments, and providing few-shot examples immediately fixes robotic dialogue."
    },
    {
      "q": "How do you evaluate an AI-generated poem for thematic consistency and meter?",
      "answer": "I evaluate meter by checking the specific syllable stress patterns, like iambic pentameter, and check thematic consistency by ensuring the extended metaphors introduced in the first stanza carry through logically to the conclusion.",
      "keywords": ["syllable", "stress", "iambic", "metaphor", "stanza", "conclusion"],
      "feedbackMiss": "You didn't explain the mechanics of poetry. You must mention checking syllable stress for meter, and tracking extended metaphors for theme.",
      "feedbackHit": "Perfect. Evaluating syllable stress patterns and extended metaphors shows a deep understanding of poetic structure."
    }
  ],
  "legal": [
    {
      "q": "How do you ensure an AI summarizing legal contracts does not omit critical indemnification clauses?",
      "answer": "I would use a two-pass system: the first pass specifically extracts all sentences containing risk-shifting keywords like 'indemnify' or 'hold harmless', and the second pass generates the summary, guaranteeing those extracted clauses are included.",
      "keywords": ["two-pass", "extract", "risk", "indemnify", "hold harmless", "guarantee"],
      "feedbackMiss": "You missed the extraction strategy. You must use a two-pass or targeted extraction step focusing on specific legal keywords before summarizing.",
      "feedbackHit": "Excellent. A two-pass extraction and summarization system is the only safe way to ensure critical legal clauses aren't dropped."
    },
    {
      "q": "An AI model is generating legal advice. Why is this dangerous, and how do you restrict it?",
      "answer": "Generating legal advice constitutes the unauthorized practice of law, creating massive liability. I would implement strict guardrails in the system prompt to explicitly state 'This is legal information, not legal advice' and refuse subjective interpretations.",
      "keywords": ["unauthorized", "liability", "guardrails", "information", "advice", "refuse"],
      "feedbackMiss": "You didn't mention the 'unauthorized practice of law'. You must explicitly define the liability and force the AI to disclaim that it provides information, not advice.",
      "feedbackHit": "Spot on. Identifying the liability of unauthorized practice and implementing strict disclaimers is exactly right."
    },
    {
      "q": "Explain how you would evaluate an AI model trained to identify privileged communications in e-discovery.",
      "answer": "I would evaluate its ability to accurately flag attorney-client communications by testing it on edge cases, such as emails where an attorney is merely CC'd for visibility rather than providing legal counsel, minimizing false positives.",
      "keywords": ["attorney-client", "edge cases", "CC", "visibility", "counsel", "false positives"],
      "feedbackMiss": "You missed the nuance of privilege. You must evaluate the AI on edge cases, like distinguishing between legal counsel and an attorney just being CC'd on a business email.",
      "feedbackHit": "Great answer. Testing edge cases like CC'd attorneys demonstrates a strong grasp of e-discovery nuances."
    }
  ],
  "general": [
    {
      "q": "You are given a model output containing multiple historical claims. Walk me through your fact-checking workflow.",
      "answer": "I would isolate each specific claim, cross-reference it against primary academic sources, and strictly verify every generated citation to ensure the model isn't hallucinating fake journals or authors.",
      "keywords": ["isolate", "cross-reference", "primary", "verify", "hallucinating", "fake"],
      "feedbackMiss": "You missed the hallucination check. You must explicitly mention verifying the citations themselves, as AI is notorious for hallucinating fake academic sources.",
      "feedbackHit": "Perfect. Isolating claims and explicitly checking for hallucinated citations is the correct workflow."
    },
    {
      "q": "How do you handle a situation where an AI refuses to answer a safe prompt due to an overly aggressive safety filter?",
      "answer": "I would analyze the prompt to identify which specific word triggered the false positive, rewrite the prompt using euphemisms or structural framing to bypass the filter, and log the incident to tune the safety guardrails.",
      "keywords": ["trigger", "false positive", "rewrite", "framing", "log", "tune"],
      "feedbackMiss": "You didn't mention identifying the trigger. You must explain diagnosing the false positive and rewriting the structural framing of the prompt.",
      "feedbackHit": "Excellent. Diagnosing the false positive, reframing, and logging it for tuning is the standard prompt engineering approach."
    },
    {
      "q": "Tell me about a time you had to learn a completely new technical domain very quickly to evaluate an AI's performance.",
      "answer": "I was assigned to evaluate a quantum computing model. I spent 48 hours reading introductory textbooks, identified the 5 core principles it needed to get right, and built a targeted evaluation rubric based purely on those constraints.",
      "keywords": ["textbooks", "core principles", "rubric", "constraints", "targeted", "48 hours"],
      "feedbackMiss": "You didn't explain a structured learning approach. You need to mention identifying core principles and building a targeted rubric, rather than trying to become an expert overnight.",
      "feedbackHit": "Great structural answer. Focusing on identifying core principles to build a targeted rubric is exactly how generalists succeed."
    }
  ]
}

# Find the domainData declaration in HTML and replace it entirely
find_domain_start = "const domainData = {"
find_domain_end = r"    \]\n  \};\n" # Regex to find the end of the object

# We will use regex to replace the entire domainData block
pattern = re.compile(r"const domainData = \{.*?\n  \};\n", re.DOTALL)

replacement = "const domainData = " + json.dumps(domainData, indent=2) + ";\n"

if pattern.search(html):
    html = pattern.sub(replacement, html)
else:
    print("Warning: Could not find domainData via regex")

# Cache bust
html = html.replace('<!-- CACHE BUST 18', '<!-- CACHE BUST 19')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected 30 highly realistic Mercor-style questions")
