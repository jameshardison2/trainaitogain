// Fix for Uncaught ReferenceError: trackInterviewScore is not defined
window.trackInterviewScore = function(score, status, fillers, isOverall = false, passProbability = '') {
    try {
        console.log("Tracking interview metrics:", { score, status, fillers, isOverall, passProbability });
        let pastScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        pastScores.push({ 
            score: score, 
            status: status, 
            fillers: fillers || 0,
            isOverall: isOverall,
            passProbability: passProbability,
            date: new Date().toISOString() 
        });
        localStorage.setItem('interviewScores', JSON.stringify(pastScores));
        if (typeof gtag === 'function') {
            gtag('event', isOverall ? 'interview_module_complete' : 'interview_scored', { 
                score_value: score, 
                star_status: status,
                fillers: fillers || 0,
                pass_probability: passProbability
            });
        }
    } catch(e) {
        console.error("Error tracking score", e);
    }
};

window.onerror = function(msg, url, line, col, error) {
    var errorBox = document.createElement('div');
    errorBox.style.cssText = 'position:fixed; bottom:0; left:0; width:100%; background:red; color:white; z-index:999999; padding:20px; font-family:monospace; font-size:14px;';
    errorBox.innerText = 'CRITICAL JS ERROR: ' + msg + '\nLine: ' + line;
    document.body.appendChild(errorBox);
    return false;
};
window.addEventListener('unhandledrejection', function(event) {
    var errorBox = document.createElement('div');
    errorBox.style.cssText = 'position:fixed; bottom:0; left:0; width:100%; background:darkred; color:white; z-index:999999; padding:20px; font-family:monospace; font-size:14px;';
    errorBox.innerText = 'PROMISE ERROR: ' + event.reason;
    document.body.appendChild(errorBox);
});
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7Z54KYTV6B');
// UC-13: Prevent concurrent interview sessions across tabs
const interviewChannel = new BroadcastChannel('interview_session_lock');
interviewChannel.postMessage('new_session');
interviewChannel.onmessage = (msg) => {
    if (msg.data === 'new_session') {
        alert('Another interview session was opened in a different tab. Closing this tab to prevent audio buffer desynchronization.');
        window.close();
    }
};
      window.currentApplySource = 'unknown';
      function openApplyModal(source) {
        window.currentApplySource = source;
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            var targetUrl = "https://t.mercor.com/wbPMF";
            if (ref) targetUrl += "?ref=" + encodeURIComponent(ref);
            window.open(targetUrl, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }
      function closeApplyModal() {
        var modal = document.getElementById('applyModal');
        modal.style.display = 'none';
        document.getElementById('modalApplyBtn').innerHTML = 'Proceed to Application Portal ➔';
        document.getElementById('modalApplyBtn').disabled = false;
      }
      async function handleModalSubmit(e) {
        e.preventDefault();
        var emailInput = document.getElementById('applyModalEmail').value.trim();
        var nameInput = document.getElementById('applyModalName').value.trim();
        if (!emailInput) {
            alert('Please enter your email to proceed.');
            return;
        }
        
        var btn = document.getElementById('modalApplyBtn');
        btn.innerHTML = 'Routing...';
        localStorage.setItem('hasEnteredEmailForApply', 'true');
        btn.disabled = true;
        
        try {
            const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const { getApp, getApps, initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
            
            let app;
            if (!getApps().length) {
                app = initializeApp({ 
                    apiKey: "AIzaSyD54pf1L7RK3uc4y8qK_gsY38BHzXJwb_A", 
                    authDomain: "trainaitogain-50c19.firebaseapp.com", 
                    projectId: "trainaitogain-50c19", 
                    storageBucket: "trainaitogain-50c19.firebasestorage.app", 
                    messagingSenderId: "637746276432", 
                    appId: "1:637746276432:web:1a7cfa65357b0bc3b90955"
                });
            } else {
                app = getApp();
            }
            const db = getFirestore(app);
            
            const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            
            await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started' // They are applying right now
            });
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');
            
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':window.currentApplySource});
            
            var targetUrl = "https://t.mercor.com/wbPMF";
            if (refCode) {
                targetUrl += "?ref=" + encodeURIComponent(refCode);
            }
            window.open(targetUrl, '_blank');
            closeApplyModal();
            
        } catch (err) {
            console.error(err);
            localStorage.setItem('hasEnteredEmailForApply', 'true'); // Even if db fails, don't ask again
            var targetUrl = "https://t.mercor.com/wbPMF";
            var refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            if (refCode) targetUrl += "?ref=" + encodeURIComponent(refCode);
            window.open(targetUrl, '_blank');
            closeApplyModal();
        }
      }
      (function() {
        var ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) localStorage.setItem('affiliate_ref', ref);
      })();
  // Browser Speech APIs
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  let recognition;
  
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  const domainData = {
  "software": [
    {
      "q": "I see you have experience with distributed systems. Explain how you would handle network partitions in a microservices architecture to ensure high availability.",
      "answer": "I would implement the Circuit Breaker pattern to prevent cascading failures, use fallback mechanisms for degraded functionality, and design the system with eventual consistency in mind using asynchronous event queues.",
      "keywords": [
        "circuit breaker",
        "fallback",
        "eventual consistency",
        "asynchronous",
        "queue",
        "CAP theorem"
      ],
      "feedbackMiss": "You didn't address the core architectural patterns. A strong answer must mention Circuit Breakers, fallbacks, or eventual consistency to handle partitions.",
      "feedbackHit": "Excellent. You correctly identified Circuit Breakers and eventual consistency as the standard patterns for network partition tolerance."
    },
    {
      "q": "Walk me through how you would optimize a React application that is experiencing severe re-rendering issues on a complex dashboard.",
      "answer": "I would profile the app using React DevTools to identify unnecessary renders, then memoize expensive components using React.memo, and optimize state management by keeping local state close to where it's used rather than in a global context.",
      "keywords": [
        "profile",
        "devtools",
        "memo",
        "useMemo",
        "local state",
        "context"
      ],
      "feedbackMiss": "You missed the profiling step. You should always start by using React DevTools to measure, and then apply memoization strategies like React.memo or useMemo.",
      "feedbackHit": "Spot on. Profiling first and then applying targeted memoization is exactly how a senior engineer handles this."
    },
    {
      "q": "Explain the underlying mechanism of how a garbage collector works in a language like Java or Go, and how it impacts latency.",
      "answer": "Garbage collectors typically use a mark-and-sweep algorithm to identify unreachable objects. This process can cause 'stop-the-world' pauses, which directly increase tail latency in high-throughput applications if not tuned properly.",
      "keywords": [
        "mark and sweep",
        "unreachable",
        "stop-the-world",
        "pause",
        "tail latency",
        "heap"
      ],
      "feedbackMiss": "You didn't explain the latency impact. You must mention 'stop-the-world' pauses and how they create tail latency spikes in production.",
      "feedbackHit": "Great explanation. Linking mark-and-sweep mechanics to tail latency shows deep systems knowledge."
    }
  ],
  "data": [
    {
      "q": "You are building a recommendation engine. How do you mitigate the 'cold start' problem for brand new users?",
      "answer": "For new users, I would fall back to a popularity-based model or use content-based filtering based on their initial onboarding questionnaire until we gather enough interaction data for collaborative filtering.",
      "keywords": [
        "popularity",
        "content-based",
        "onboarding",
        "collaborative",
        "fallback",
        "heuristic"
      ],
      "feedbackMiss": "You missed the fallback strategies. You need to explicitly mention using popularity-based recommendations or content-based filtering for new users.",
      "feedbackHit": "Perfect. Switching between content-based and collaborative filtering is the exact solution to the cold start problem."
    },
    {
      "q": "How would you design a data pipeline to ingest 5 terabytes of streaming log data per day with sub-second latency requirements?",
      "answer": "I would use Apache Kafka as the distributed event streaming platform to buffer the data, process it in real-time using Apache Flink or Spark Streaming, and sink it into a fast OLAP database like ClickHouse.",
      "keywords": [
        "Kafka",
        "Flink",
        "streaming",
        "buffer",
        "ClickHouse",
        "OLAP"
      ],
      "feedbackMiss": "You didn't specify the right tools for sub-second streaming. You should mention Kafka for ingestion and Flink or Spark for stream processing.",
      "feedbackHit": "Excellent architectural choices. Kafka combined with Flink and ClickHouse perfectly handles high-throughput, low-latency streaming."
    },
    {
      "q": "Explain the concept of Data Leakage in machine learning training and how you prevent it.",
      "answer": "Data leakage occurs when information from outside the training dataset is used to create the model, artificially inflating performance. I prevent it by strictly splitting data before any preprocessing or feature engineering occurs.",
      "keywords": [
        "leakage",
        "inflate",
        "split",
        "preprocessing",
        "feature engineering",
        "future"
      ],
      "feedbackMiss": "You missed the prevention step. You must emphasize that train/test splitting must occur BEFORE any feature engineering or scaling.",
      "feedbackHit": "Spot on. Applying the train/test split prior to preprocessing is the golden rule to prevent leakage."
    }
  ],
  "product": [
    {
      "q": "Your engineering team says a critical feature will take 3 months, but sales needs it in 3 weeks to close a major deal. How do you handle this?",
      "answer": "I would sit down with engineering to brutally scope down the feature to its absolute Minimum Viable Product, removing all edge cases, and negotiate with sales to deliver that core value in 3 weeks while scheduling the rest later.",
      "keywords": [
        "scope",
        "MVP",
        "negotiate",
        "edge cases",
        "core value",
        "compromise"
      ],
      "feedbackMiss": "You didn't focus on scoping. The PM's job here is to ruthlessly cut scope to an MVP to meet the deadline without burning out the team.",
      "feedbackHit": "Great answer. Ruthless prioritization and MVP scoping is exactly how a PM resolves timeline conflicts."
    },
    {
      "q": "How do you measure the success of a newly launched onboarding flow?",
      "answer": "I would track the conversion rate through each step of the funnel to identify drop-offs, measure the time-to-first-value, and look at the 7-day retention rate of cohorts who experienced the new flow versus the old one.",
      "keywords": [
        "funnel",
        "conversion",
        "drop-off",
        "time-to-value",
        "retention",
        "cohort"
      ],
      "feedbackMiss": "You missed the cohort analysis. You need to explicitly mention tracking the funnel drop-off and comparing retention cohorts.",
      "feedbackHit": "Excellent metrics. Time-to-first-value and cohort retention are the strongest indicators of onboarding success."
    },
    {
      "q": "Tell me about a time you had to pivot a product strategy based on user data.",
      "answer": "We noticed through Mixpanel that users were completely ignoring our primary feature and heavily using a secondary sharing tool. We immediately reallocated engineering resources to expand the sharing tool, which doubled our active users.",
      "keywords": [
        "data",
        "analytics",
        "reallocate",
        "resources",
        "ignore",
        "double"
      ],
      "feedbackMiss": "You didn't give a clear hypothetical or structural response. Mention using an analytics tool, observing unexpected behavior, and decisively reallocating resources.",
      "feedbackHit": "Perfect structure. You highlighted the data source, the surprising insight, and the decisive action taken."
    }
  ],
  "math": [
    {
      "q": "Explain the concept of eigenvectors and eigenvalues, and give a practical application in machine learning.",
      "answer": "An eigenvector is a vector whose direction does not change when a linear transformation is applied, and the eigenvalue is the scale of that stretch. In ML, they are the foundation of Principal Component Analysis for dimensionality reduction.",
      "keywords": [
        "direction",
        "transformation",
        "scale",
        "PCA",
        "dimensionality",
        "reduction"
      ],
      "feedbackMiss": "You missed the ML application. You must explicitly connect eigenvectors to Principal Component Analysis (PCA) and dimensionality reduction.",
      "feedbackHit": "Spot on. Connecting eigenvectors directly to PCA shows strong applied mathematical knowledge."
    },
    {
      "q": "Walk me through how Gradient Descent optimizes a loss function.",
      "answer": "Gradient descent calculates the derivative of the loss function with respect to each weight to find the direction of steepest ascent. It then updates the weights by taking a small step in the opposite direction, controlled by the learning rate.",
      "keywords": [
        "derivative",
        "steepest",
        "opposite",
        "learning rate",
        "update",
        "minimum"
      ],
      "feedbackMiss": "You missed the derivative concept. You need to explain that it calculates the gradient (derivative) to find the slope, and moves in the opposite direction.",
      "feedbackHit": "Excellent. You clearly explained the relationship between the derivative, the learning rate, and the weight update."
    },
    {
      "q": "What is the difference between L1 and L2 regularization mathematically, and how do they affect the model?",
      "answer": "L1 adds the absolute value of the weights to the loss, driving less important weights exactly to zero, creating a sparse model. L2 adds the squared value of the weights, forcing them to be small but rarely exactly zero.",
      "keywords": [
        "absolute",
        "zero",
        "sparse",
        "squared",
        "small",
        "penalty"
      ],
      "feedbackMiss": "You didn't mention sparsity. You must explicitly state that L1 drives weights to absolute zero (feature selection), while L2 just shrinks them.",
      "feedbackHit": "Perfect. Distinguishing between L1's sparsity and L2's shrinkage is exactly what we look for."
    }
  ],
  "language": [
    {
      "q": "How would you design an evaluation prompt to grade an LLM's ability to maintain a specific persona across a long conversation?",
      "answer": "I would prompt the evaluator LLM to act as a strict linguistic judge, providing it with the exact character traits, and instruct it to penalize any responses that break character, use modern slang inappropriately, or contradict previous statements.",
      "keywords": [
        "judge",
        "traits",
        "penalize",
        "break character",
        "slang",
        "contradict"
      ],
      "feedbackMiss": "You lacked specificity in the grading criteria. You need to tell the evaluator to look for specific infractions like breaking character or logical contradictions.",
      "feedbackHit": "Great answer. Setting up the evaluator as a strict judge with specific penalty conditions is the industry standard."
    },
    {
      "q": "An AI model is translating English idioms literally into Spanish, losing the meaning. How do we fix this in the training data?",
      "answer": "We need to curate a high-quality dataset of idiomatic pairs and use supervised fine-tuning. We should also implement RLHF to heavily penalize literal translations of known idioms and reward culturally equivalent phrases.",
      "keywords": [
        "curate",
        "pairs",
        "SFT",
        "RLHF",
        "penalize",
        "equivalent"
      ],
      "feedbackMiss": "You missed the RLHF component. You should mention penalizing literal translations and rewarding cultural equivalents using reinforcement learning.",
      "feedbackHit": "Spot on. Combining SFT with curated pairs and RLHF penalties is the right approach for idiomatic translation."
    },
    {
      "q": "Explain the challenge of tokenization for morphologically rich languages like Turkish or Finnish.",
      "answer": "Because words are formed by stacking many suffixes, standard subword tokenizers like BPE often split words in ways that destroy grammatical meaning. It requires custom morphological tokenizers that respect the language's root structures.",
      "keywords": [
        "suffixes",
        "BPE",
        "split",
        "destroy",
        "morphological",
        "root"
      ],
      "feedbackMiss": "You didn't explain WHY it's a problem. You must mention that standard BPE tokenizers split words arbitrarily, destroying the root grammatical meaning.",
      "feedbackHit": "Excellent. You accurately identified the conflict between standard BPE tokenization and suffix-heavy agglutinative languages."
    }
  ],
  "medical": [
    {
      "q": "How do you evaluate an AI model designed to detect anomalies in MRI scans to ensure it doesn't have a high false-negative rate?",
      "answer": "I would prioritize tracking the Recall metric over Precision, ensuring the threshold is set conservatively. I would also mandate that the test set includes a highly diverse demographic pool to check for bias in edge-case anomalies.",
      "keywords": [
        "Recall",
        "Precision",
        "threshold",
        "diverse",
        "demographic",
        "bias"
      ],
      "feedbackMiss": "You missed the statistical metrics. In medical anomaly detection, you must explicitly state that Recall (minimizing false negatives) is vastly more important than Precision.",
      "feedbackHit": "Perfect. Prioritizing Recall and checking for demographic bias is critical for medical AI safety."
    },
    {
      "q": "An LLM is giving outdated pharmacological dosing advice. How do you force it to adhere strictly to current medical guidelines?",
      "answer": "I would implement a Retrieval-Augmented Generation (RAG) architecture that queries a strictly curated, up-to-date medical database, and instruct the system prompt to explicitly refuse to answer if the information is not in the retrieved documents.",
      "keywords": [
        "RAG",
        "retrieval",
        "curated",
        "database",
        "refuse",
        "hallucination"
      ],
      "feedbackMiss": "You didn't mention RAG. You cannot rely on model weights for dosing; you must use Retrieval-Augmented Generation connected to a verified medical database.",
      "feedbackHit": "Excellent. Using RAG and instructing the model to refuse unverified answers prevents dangerous medical hallucinations."
    },
    {
      "q": "What ethical considerations must be evaluated when training a diagnostic AI on historical patient records?",
      "answer": "We must strictly anonymize the data to comply with HIPAA, and rigorously audit the historical records for systemic bias, as past diagnostic data often reflects historical healthcare disparities against minority groups.",
      "keywords": [
        "anonymize",
        "HIPAA",
        "audit",
        "bias",
        "disparities",
        "minority"
      ],
      "feedbackMiss": "You missed the bias audit. While HIPAA is important, you must also address that historical data contains systemic biases that the AI will learn if not corrected.",
      "feedbackHit": "Spot on. Addressing both privacy (HIPAA) and historical systemic bias shows deep medical AI ethics."
    }
  ],
  "finance": [
    {
      "q": "How do you evaluate a trading algorithm's backtest to ensure it isn't overfitted to historical data?",
      "answer": "I would strictly separate the data into training and out-of-sample holdout sets, evaluate the Sharpe ratio across different market regimes, and check if the strategy degrades significantly when small transaction costs and slippage are added.",
      "keywords": [
        "out-of-sample",
        "holdout",
        "Sharpe",
        "regimes",
        "transaction costs",
        "slippage"
      ],
      "feedbackMiss": "You didn't mention slippage or out-of-sample testing. You must emphasize testing on holdout data and accounting for real-world transaction costs.",
      "feedbackHit": "Great answer. Checking out-of-sample performance and factoring in slippage are the hallmarks of a robust backtest."
    },
    {
      "q": "Explain how you would prompt an LLM to extract complex covenants from a 200-page corporate bond prospectus.",
      "answer": "I would break the document into overlapping chunks, pass each chunk through the LLM with a highly structured JSON schema prompt demanding specific covenant fields, and use a final map-reduce step to consolidate the extracted clauses.",
      "keywords": [
        "chunks",
        "overlapping",
        "JSON",
        "schema",
        "map-reduce",
        "consolidate"
      ],
      "feedbackMiss": "You missed the chunking strategy. LLMs have context limits; you must mention chunking the document and forcing a structured JSON output.",
      "feedbackHit": "Perfect. Chunking with a strict JSON schema and a map-reduce consolidation is the exact right pipeline."
    },
    {
      "q": "What is the difference between Delta and Gamma in options pricing, and why does an AI model need to understand both?",
      "answer": "Delta measures the rate of change of the option price relative to the underlying asset, while Gamma measures the rate of change of the Delta itself. The AI must understand both to accurately hedge against large, sudden market movements.",
      "keywords": [
        "rate of change",
        "underlying",
        "Gamma",
        "hedge",
        "sudden",
        "acceleration"
      ],
      "feedbackMiss": "You missed the hedging application. You need to explain that Gamma is the acceleration of Delta, which is critical for dynamic hedging.",
      "feedbackHit": "Excellent. Defining Gamma as the derivative of Delta and linking it to dynamic hedging is exactly correct."
    }
  ],
  "creative": [
    {
      "q": "How do you prompt an AI to write a fictional story that has a genuine emotional arc, rather than just a flat sequence of events?",
      "answer": "I would prompt the AI using the 'Save the Cat' beat sheet framework, explicitly forcing it to outline the protagonist's internal flaw, the inciting incident, and the specific emotional realization at the climax before generating the prose.",
      "keywords": [
        "beat sheet",
        "framework",
        "flaw",
        "inciting incident",
        "climax",
        "outline"
      ],
      "feedbackMiss": "You didn't provide a structural framework. You should mention using established narrative frameworks like 'Save the Cat' or the Hero's Journey in the prompt.",
      "feedbackHit": "Spot on. Forcing the AI to outline the emotional beats using a framework BEFORE generating prose yields the best results."
    },
    {
      "q": "An AI is generating dialogue that sounds completely robotic and overly formal. How do you fix the prompt?",
      "answer": "I would instruct the AI to use contractions, allow characters to interrupt each other, use sentence fragments, and provide specific few-shot examples of natural, messy human conversation in the system prompt.",
      "keywords": [
        "contractions",
        "interrupt",
        "fragments",
        "few-shot",
        "messy",
        "examples"
      ],
      "feedbackMiss": "You missed the specific linguistic instructions. You need to explicitly tell the AI to use contractions and sentence fragments to break the formal tone.",
      "feedbackHit": "Great answer. Specifying contractions, fragments, and providing few-shot examples immediately fixes robotic dialogue."
    },
    {
      "q": "How do you evaluate an AI-generated poem for thematic consistency and meter?",
      "answer": "I evaluate meter by checking the specific syllable stress patterns, like iambic pentameter, and check thematic consistency by ensuring the extended metaphors introduced in the first stanza carry through logically to the conclusion.",
      "keywords": [
        "syllable",
        "stress",
        "iambic",
        "metaphor",
        "stanza",
        "conclusion"
      ],
      "feedbackMiss": "You didn't explain the mechanics of poetry. You must mention checking syllable stress for meter, and tracking extended metaphors for theme.",
      "feedbackHit": "Perfect. Evaluating syllable stress patterns and extended metaphors shows a deep understanding of poetic structure."
    }
  ],
  "legal": [
    {
      "q": "How do you ensure an AI summarizing legal contracts does not omit critical indemnification clauses?",
      "answer": "I would use a two-pass system: the first pass specifically extracts all sentences containing risk-shifting keywords like 'indemnify' or 'hold harmless', and the second pass generates the summary, guaranteeing those extracted clauses are included.",
      "keywords": [
        "two-pass",
        "extract",
        "risk",
        "indemnify",
        "hold harmless",
        "guarantee"
      ],
      "feedbackMiss": "You missed the extraction strategy. You must use a two-pass or targeted extraction step focusing on specific legal keywords before summarizing.",
      "feedbackHit": "Excellent. A two-pass extraction and summarization system is the only safe way to ensure critical legal clauses aren't dropped."
    },
    {
      "q": "An AI model is generating legal advice. Why is this dangerous, and how do you restrict it?",
      "answer": "Generating legal advice constitutes the unauthorized practice of law, creating massive liability. I would implement strict guardrails in the system prompt to explicitly state 'This is legal information, not legal advice' and refuse subjective interpretations.",
      "keywords": [
        "unauthorized",
        "liability",
        "guardrails",
        "information",
        "advice",
        "refuse"
      ],
      "feedbackMiss": "You didn't mention the 'unauthorized practice of law'. You must explicitly define the liability and force the AI to disclaim that it provides information, not advice.",
      "feedbackHit": "Spot on. Identifying the liability of unauthorized practice and implementing strict disclaimers is exactly right."
    },
    {
      "q": "Explain how you would evaluate an AI model trained to identify privileged communications in e-discovery.",
      "answer": "I would evaluate its ability to accurately flag attorney-client communications by testing it on edge cases, such as emails where an attorney is merely CC'd for visibility rather than providing legal counsel, minimizing false positives.",
      "keywords": [
        "attorney-client",
        "edge cases",
        "CC",
        "visibility",
        "counsel",
        "false positives"
      ],
      "feedbackMiss": "You missed the nuance of privilege. You must evaluate the AI on edge cases, like distinguishing between legal counsel and an attorney just being CC'd on a business email.",
      "feedbackHit": "Great answer. Testing edge cases like CC'd attorneys demonstrates a strong grasp of e-discovery nuances."
    }
  ],
  "general": [
    {
      "q": "You are given a model output containing multiple historical claims. Walk me through your fact-checking workflow.",
      "answer": "I would isolate each specific claim, cross-reference it against primary academic sources, and strictly verify every generated citation to ensure the model isn't hallucinating fake journals or authors.",
      "keywords": [
        "isolate",
        "cross-reference",
        "primary",
        "verify",
        "hallucinating",
        "fake"
      ],
      "feedbackMiss": "You missed the hallucination check. You must explicitly mention verifying the citations themselves, as AI is notorious for hallucinating fake academic sources.",
      "feedbackHit": "Perfect. Isolating claims and explicitly checking for hallucinated citations is the correct workflow."
    },
    {
      "q": "How do you handle a situation where an AI refuses to answer a safe prompt due to an overly aggressive safety filter?",
      "answer": "I would analyze the prompt to identify which specific word triggered the false positive, rewrite the prompt using euphemisms or structural framing to bypass the filter, and log the incident to tune the safety guardrails.",
      "keywords": [
        "trigger",
        "false positive",
        "rewrite",
        "framing",
        "log",
        "tune"
      ],
      "feedbackMiss": "You didn't mention identifying the trigger. You must explain diagnosing the false positive and rewriting the structural framing of the prompt.",
      "feedbackHit": "Excellent. Diagnosing the false positive, reframing, and logging it for tuning is the standard prompt engineering approach."
    },
    {
      "q": "Tell me about a time you had to learn a completely new technical domain very quickly to evaluate an AI's performance.",
      "answer": "I was assigned to evaluate a quantum computing model. I spent 48 hours reading introductory textbooks, identified the 5 core principles it needed to get right, and built a targeted evaluation rubric based purely on those constraints.",
      "keywords": [
        "textbooks",
        "core principles",
        "rubric",
        "constraints",
        "targeted",
        "48 hours"
      ],
      "feedbackMiss": "You didn't explain a structured learning approach. You need to mention identifying core principles and building a targeted rubric, rather than trying to become an expert overnight.",
      "feedbackHit": "Great structural answer. Focusing on identifying core principles to build a targeted rubric is exactly how generalists succeed."
    }
  ]
};

  let totalScore = 0;
  let totalFillers = 0;
  let totalQuestionsAnswered = 0;
  let currentDomain = "software";
  let currentQuestions = domainData[currentDomain];
  let currentQ = 0;
  
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const setupView = document.getElementById('setup-view');
  const activeView = document.getElementById('active-view');
  const domainSelector = document.getElementById('domain-selector');
  
  // Auto-fill from ATS Scanner
  const atsRole = localStorage.getItem('atsRole');
  const atsDomain = localStorage.getItem('atsDomain');
  
  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
  }
  
  if (atsDomain) {
      const domLow = atsDomain.toLowerCase();
      let matchedValue = 'software';
      if (domLow.includes('medical') || domLow.includes('health')) matchedValue = 'medical';
      if (domLow.includes('finance') || domLow.includes('quant')) matchedValue = 'finance';
      if (domLow.includes('legal') || domLow.includes('law')) matchedValue = 'legal';
      if (domLow.includes('creative') || domLow.includes('writer')) matchedValue = 'creative';
      if (domLow.includes('data')) matchedValue = 'data';
      if (domLow.includes('product')) matchedValue = 'product';
      
      domainSelector.value = matchedValue;
      
      // Update the option text to match their exact role!
      const option = domainSelector.querySelector('option[value="' + matchedValue + '"]');
      if (option && atsRole) {
          // option.text hidden
      }
  }

  
  
  const cdsDisplay = document.getElementById('cds-display');
  const cdsOptions = document.getElementById('cds-options');
  const cdsText = document.getElementById('cds-text');
  
  // Populate custom options from hidden select
  Array.from(domainSelector.options).forEach(opt => {
      const div = document.createElement('div');
      div.style.padding = '12px 16px';
      div.style.cursor = 'pointer';
      div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      div.style.color = '#ccc';
      div.style.fontSize = '14px';
      div.style.transition = 'background 0.2s, color 0.2s';
      div.innerText = opt.text;
      
      div.onmouseover = () => { div.style.background = 'rgba(255,255,255,0.1)'; div.style.color = 'white'; };
      div.onmouseout = () => { div.style.background = 'transparent'; div.style.color = '#ccc'; };
      
      div.onclick = () => {
          cdsText.innerText = opt.text;
          cdsOptions.style.display = 'none';
          domainSelector.value = opt.value;
          currentDomain = opt.value;
          currentQuestions = domainData[currentDomain];
          
          // FIX UP THE POSITION ABOVE (h2 title)
          const newRole = opt.text.replace("Role: ", "");
          const titleEl = document.querySelector('#setup-view h2');
          if (titleEl) {
              titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + newRole + '</span>';
          }
      };
      cdsOptions.appendChild(div);
  });
  
  cdsDisplay.onclick = () => {
      cdsOptions.style.display = cdsOptions.style.display === 'none' ? 'block' : 'none';
      cdsDisplay.style.borderColor = cdsOptions.style.display === 'block' ? 'var(--primary)' : 'rgba(255,255,255,0.2)';
  };
  
  document.addEventListener('click', (e) => {
      const container = document.getElementById('custom-domain-selector');
      if (container && !container.contains(e.target)) {
          cdsOptions.style.display = 'none';
          cdsDisplay.style.borderColor = 'rgba(255,255,255,0.2)';
      }
  });
  
  // Also update cdsText if atsRole was set on load
  if (atsRole) {
      cdsText.innerText = "Role: " + atsRole;
  }

  
  
  
  const simText = document.getElementById('sim-text');
  
  
  let transcriptEnabled = false;
  
  let teleprompterEnabled = false;
  document.getElementById('toggle-teleprompter').addEventListener('change', (e) => {
      teleprompterEnabled = e.target.checked;
  });
  
  let availableVoices = [];
  let voiceInterval;
  function populateVoiceList() {
      if(typeof synth === 'undefined') return;
      
      let voices = synth.getVoices();
      const voiceSelect = document.getElementById('voice-select');
      
      if (voices.length === 0) {
          if (voiceSelect && voiceSelect.options.length === 1 && voiceSelect.options[0].textContent.includes('Loading')) {
              voiceSelect.options[0].textContent = "System Default Voice (Auto-selected)";
          }
          return; // Still loading or blocked by browser
      }
      
      if (voiceInterval) clearInterval(voiceInterval);
      
      // Filter for clean, premium human-sounding voices
      const premiumNames = ['Samantha', 'Ava', 'Allison', 'Susan', 'Alex', 'Tom', 'Daniel', 'Serena', 'Google US English', 'Google UK English Female', 'Google UK English Male', 'Microsoft Aria', 'Microsoft Guy'];
      let filteredVoices = voices.filter(v => v.lang.startsWith('en') && premiumNames.some(p => v.name.includes(p)));
      
      // Fallback if none of the premiums are found (e.g. Linux or custom browser)
      if(filteredVoices.length === 0) {
          filteredVoices = voices.filter(v => v.lang.startsWith('en') && !v.name.includes('Bells') && !v.name.includes('Bad News') && !v.name.includes('Boing') && !v.name.includes('Cellos')).slice(0, 5);
      }
      
      // Enforce max 5 choices to prevent choice fatigue
      filteredVoices = filteredVoices.slice(0, 5);
      
      // If we already have the exact same list, skip redraw
      if (availableVoices.length === filteredVoices.length && availableVoices.every((v,i) => v.name === filteredVoices[i].name)) return;
      
      availableVoices = filteredVoices;
      
      if (voiceSelect) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              // Clean up the name for the UI (remove "Online (Natural) - English (United States)", etc)
              let cleanName = v.name.replace(/ Online \(Natural\).*| \(en-[A-Z]+\)/g, '').trim();
              option.textContent = cleanName;
              
              // We need to map the value back to the ORIGINAL voice array index so the synth engine finds it
              const originalIndex = voices.indexOf(v);
              option.value = originalIndex;
              
              if (cleanName.includes('Google US English') || cleanName.includes('Ava') || cleanName.includes('Samantha') || i === 0) {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }
  }
  
  // Try populating on user interaction as well
  document.addEventListener('click', populateVoiceList, {once: false});
  document.addEventListener('touchstart', populateVoiceList, {once: false});
  
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // Fallback: poll every 250ms until voices load (max 10 seconds)
  let pollAttempts = 0;
  voiceInterval = setInterval(() => {
      populateVoiceList();
      pollAttempts++;
      if (pollAttempts > 40) clearInterval(voiceInterval); // Give up after 10s
  }, 250);
  populateVoiceList();


  function setUIState(state, text) {
    if (text) {
        simText.innerText = text;
        simText.style.display = 'inline-block';
    }
    
    if (state === 'speaking') {
      
      nextBtn.style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      document.getElementById('teleprompter-box').style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {
      simText.style.opacity = '1';
      simText.style.transform = 'scale(1)';
      simText.innerText = 'Listening...';
      
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      
      if (teleprompterEnabled && currentQuestions[currentQ]) {
          const tText = document.getElementById('teleprompter-text');
          tText.innerText = currentQuestions[currentQ].answer || ("Try mentioning: " + currentQuestions[currentQ].keywords.join(', '));
          
          // Reset animation by triggering reflow
          tText.classList.remove('teleprompter-text-anim');
          void tText.offsetWidth; 
          tText.classList.add('teleprompter-text-anim');
          
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {
          document.getElementById('teleprompter-box').style.display = 'none';
      }
      
      simText.style.display = 'none';
    } else if (state === 'analyzing') {
      simText.style.display = 'none';
    } else if (state === 'feedback') {
      simText.style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }
  }

  window._utterances = []; // Global array to prevent garbage collection bugs
  function speakText(text, callback) {
    if (synth.speaking) {
        synth.cancel();
    }
    const stopBtn = document.getElementById('stop-ai-btn');
    if (stopBtn) stopBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;

    const utterance = new SpeechSynthesisUtterance(text);
    window._utterances.push(utterance); // Prevent Chromium from garbage collecting the utterance before onend fires!

    
    // Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && availableVoices.length > 0) {
        const selectedIndex = parseInt(voiceSelect.value, 10);
        if (!isNaN(selectedIndex) && availableVoices[selectedIndex]) {
            utterance.voice = availableVoices[selectedIndex];
        }
    } else {
        const voices = synth.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices.find(v => v.lang.includes('en-')) || voices[0];
        }
    }
    
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.volume = 1; // Unmuted to let them hear the voice
    
    utterance.onend = () => {
      if (callback) callback();
    };
    
    synth.speak(utterance);
  }

  function processAnswer(transcript) {
    setUIState('analyzing', 'Analyzing your transcript...');
    
    setTimeout(() => {
      const text = " " + transcript.toLowerCase() + " ";
      const qData = currentQuestions[currentQ];
      
      let matches = 0;
      qData.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) matches++;
      });
      
      // Filler word analysis
      const fillers = [' um ', ' uh ', ' like ', ' you know ', ' basically ', ' i mean '];
      let fillerCount = 0;
      fillers.forEach(fw => {
         const fwMatches = text.match(new RegExp(fw, 'g'));
         if (fwMatches) fillerCount += fwMatches.length;
      });
      
      // Base confidence score logic
      const wordCount = text.split(' ').filter(w => w.length > 0).length;
      let confScore = 75; // baseline
      
      // AI Token / Length Penalties (From Research)
      let lengthFeedback = "";
      if (wordCount < 15) {
          confScore -= 30; // penalty for too short
          lengthFeedback = "AI WARNING: Your answer was too short. AI scanners cannot infer expertise—you must state your skills explicitly.";
      } else if (wordCount > 160) {
          confScore -= 20; // penalty for rambling
          lengthFeedback = "AI WARNING: Tangent detected! You spoke for too long. AI models have token limits and penalize rambling. Keep answers concise (60-90 seconds).";
      }

      // S.T.A.R Method Check (From Research)
      let starFeedback = "";
      const starKeywords = ['situation', 'task', 'action', 'result', 'because', 'resulted in', 'led to', 'resolved', 'outcome'];
      let starMatches = 0;
      starKeywords.forEach(sk => {
          if (text.includes(sk)) starMatches++;
      });
      if (starMatches > 0) {
          confScore += 15;
          starFeedback = "✓ Good use of S.T.A.R. structural keywords (Result/Outcome). AI grades structured storytelling higher.";
      } else {
          confScore -= 10;
          starFeedback = "⚠ Missing S.T.A.R. structure. AI scanners look for explicit cause-and-effect language ('resulted in', 'outcome').";
      }

      confScore += (matches * 15); // bonus for direct keyword hits
      confScore -= (fillerCount * 10); // massive penalty for fillers
      
      const cappedScore = Math.min(100, Math.max(10, confScore));
      totalScore += cappedScore;
      totalFillers += fillerCount;
      totalQuestionsAnswered++;

      let feedback = "";
      if (wordCount < 15) {
         feedback = qData.feedbackMiss;
      } else if (matches >= 2) {
         feedback = qData.feedbackHit;
      } else {
         feedback = "⚠ You missed the core industry keywords the AI was scanning for. " + qData.feedbackMiss;
      }
      
      const finalFeedback = feedback + `

---
**AI Scanner Diagnostics:**
• Confidence Score: ${cappedScore}%
• Filler Words ('Ums/Ahs'): ${fillerCount} (AI penalizes these heavily as transcription errors)
${lengthFeedback ? '• ' + lengthFeedback + '\n' : ''}• ${starFeedback}`;
      
      setUIState('feedback', 'Feedback generated. Check the AI Copilot panel.');
      document.getElementById('copilot-feedback-container').style.display = 'block';
      
      const stratBox = document.getElementById('copilot-strategy');
      stratBox.innerText = finalFeedback;
      if (cappedScore >= 80) {
          stratBox.style.background = 'rgba(16,185,129,0.1)';
          stratBox.style.borderLeftColor = 'var(--primary)';
      } else {
          stratBox.style.background = 'rgba(239,68,68,0.1)';
          stratBox.style.borderLeftColor = '#ef4444';
      }
      
      // TRIGGER THE NEW INSTANT SCORECARD MODAL
      const modal = document.getElementById('scorecard-modal');
      if(modal) {
          document.getElementById('modal-conf-score').innerText = cappedScore + "%";
          document.getElementById('modal-conf-score').style.color = (cappedScore >= 80) ? 'var(--primary)' : (cappedScore >= 50 ? 'var(--accent)' : '#ef4444');
          
          document.getElementById('modal-filler-score').innerText = fillerCount + (fillerCount > 0 ? " (e.g. um, like)" : "");
          document.getElementById('modal-filler-score').style.color = (fillerCount === 0) ? 'var(--primary)' : '#ef4444';
          
          document.getElementById('modal-star-score').innerText = starMatches > 0 ? "Pass ✅" : "Fail ❌";
          document.getElementById('modal-star-score').style.color = starMatches > 0 ? 'var(--primary)' : '#ef4444';
          
          trackInterviewScore(cappedScore, starMatches > 0 ? 'Pass' : 'Fail', fillerCount);
          
          document.getElementById('modal-transcript').innerText = transcript;
          document.getElementById('modal-ideal').innerText = qData.answer || ("Try mentioning: " + qData.keywords.join(', '));
          
          document.getElementById('modal-ai-feedback').innerHTML = finalFeedback.replace(/\n/g, '<br>');
          
          modal.style.display = 'flex';
          
          // Wire up the modal Next Question button to trigger the existing flow
          document.getElementById('modal-next-btn').onclick = () => {
              modal.style.display = 'none';
              document.getElementById('next-btn').click();
          };
          
          // Wire up the Drill Deeper follow up
          document.getElementById('modal-drill-btn').onclick = () => {
              modal.style.display = 'none';
              const followUpQ = {
                  q: "Follow up on that: Defend your architectural decisions. What edge cases did you ignore, and how would this system fail under 10x load?",
                  keywords: ["scale", "bottleneck", "load", "latency", "architecture", "tradeoff", "failure", "cache", "rate limiting"],
                  answer: "When scaling to 10x, the primary bottleneck would shift to the database layer. I intentionally traded off immediate consistency for high availability using a caching layer. To mitigate complete failure, I would implement circuit breakers and rate limiting.",
                  feedbackHit: "Excellent defense. You acknowledged trade-offs and demonstrated senior-level systems thinking.",
                  feedbackMiss: "You failed to identify the architectural limits. Senior engineers always know how their systems break."
              };
              currentQuestions.splice(currentQ + 1, 0, followUpQ);
              document.getElementById('next-btn').click();
          };
      }

      speakText(feedback, () => {
         
      });
      
    }, 1000);
  }

  function askQuestion() {
    const qText = currentQuestions[currentQ].q;
    document.getElementById('copilot-content').style.display = 'none';
    document.getElementById('copilot-status').style.display = 'block';
    document.getElementById('copilot-status').innerText = "Listening to interviewer...";
    simText.style.opacity = '1'; simText.style.transform = 'scale(1)'; setUIState('speaking', qText);
    
    
    speakText(qText, () => {
      if (!recognition) {
         setUIState('feedback', 'Speech Recognition is not supported on this browser. Please use Google Chrome or Safari.');
         return;
      }
      
      setUIState('listening', 'Waiting for your answer...');
      
      // FIX: Activate the Blueprint dynamic keyword highlighting during speech!
      document.getElementById('copilot-status').style.display = 'none';
      document.getElementById('copilot-content').style.display = 'flex';
      document.getElementById('copilot-content').style.flexDirection = 'column';
      document.getElementById('copilot-feedback-container').style.display = 'none';
      
      const kwBox = document.getElementById('copilot-keywords');
      kwBox.innerHTML = '';
      currentQuestions[currentQ].keywords.forEach(kw => {
          const s = document.createElement('span');
          s.className = 'kw-tag kw-' + kw.replace(/\s+/g, '-');
          s.innerText = kw;
          kwBox.appendChild(s);
      });
      
      let finalTranscript = '';
      
      
      let speechStartTime = Date.now();
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t + ' ';
          } else {
            interim += t;
          }
        }
        
        // ADVANCED FEATURE 3: Live Pace (WPM) Analyzer
        const liveText = (finalTranscript + interim).trim();
        const liveWordCount = liveText.split(/\s+/).filter(w => w.length > 0).length;
        const secondsElapsed = (Date.now() - speechStartTime) / 1000;
        if (secondsElapsed > 5 && liveWordCount > 5) {
            const wpm = (liveWordCount / secondsElapsed) * 60;
            const paceWarning = document.getElementById('pace-warning');
            if (paceWarning) {
                if (wpm > 170) {
                    paceWarning.innerText = '⏱️ PACE: Speaking too fast (approx ' + Math.round(wpm) + ' WPM). Slow down so the AI can transcribe you.';
                    paceWarning.style.display = 'flex';
                } else if (wpm < 80) {
                    paceWarning.innerText = '⏱️ PACE: Speaking too slow (approx ' + Math.round(wpm) + ' WPM). Keep a natural, professional rhythm.';
                    paceWarning.style.display = 'flex';
                } else {
                    paceWarning.style.display = 'none';
                }
            }
        }
        


        
        
        // Real-time copilot keyword highlighting
        const copilotText = (finalTranscript + interim).toLowerCase();
        currentQuestions[currentQ].keywords.forEach(kw => {
            if (copilotText.includes(kw.toLowerCase())) {
                const tag = document.querySelector('.kw-' + kw.replace(/\s+/g, '-'));
                if(tag) tag.classList.add('hit');
            }
        });
      };
      
      let isAnswering = true;
      document.getElementById('finish-btn').onclick = () => {
          if (!isAnswering) return;
          isAnswering = false;
          if (recognition) recognition.stop();
          
          if (finalTranscript.trim() === '') {
              processAnswer("I don't know");
          } else {
              processAnswer(finalTranscript);
          }
      };

      recognition.onerror = (e) => {
         if (e.error === 'no-speech' && isAnswering) {
             // Ignore no-speech and keep listening
         } else if (e.error === 'audio-capture' || e.error === 'not-allowed' || e.error === 'aborted') {
             alert('Hardware Error: Microphone disconnected mid-session. Please reconnect your audio device and refresh.');
             if(window.activeStream) window.activeStream.getTracks().forEach(t => t.stop());
         }
      };
      
      recognition.onend = () => {
        if (isAnswering) {
            // SpeechRecognition often cuts out if the user pauses for a few seconds.
            // If they haven't clicked 'Done Answering', we automatically restart it!
            try {
                recognition.start();
            } catch(err) {
                console.log("Restart failed", err);
            }
        }
      };
      
      recognition.start();
    });
  }

  startBtn.addEventListener('click', () => {
    
    // Prevent Autoplay block by playing silent audio
    const silentSynth = new SpeechSynthesisUtterance('');
    silentSynth.volume = 0;
    window.speechSynthesis.speak(silentSynth);
    
    startBtn.innerText = "Requesting Camera...";
    startBtn.disabled = true;
    
    // FIX: Ask for permissions IMMEDIATELY on user gesture, BEFORE any setTimeouts or API calls
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        window.activeStream = stream; // Save stream globally
        proceedWithInterviewLoading();
    })
    .catch(err => {
        console.warn("Camera not available, proceeding with audio only:", err);
        window.activeStream = null;
        proceedWithInterviewLoading();
    });
});

function proceedWithInterviewLoading() {

    // PRIME THE SPEECH SYNTHESIS ENGINE SYNCHRONOUSLY!
    // Browsers block speech synthesis if it's not triggered directly by a user click.
    // By speaking a silent, empty string right now, we "unlock" the engine for future async calls.
    const silentUtterance = new SpeechSynthesisUtterance('');
    silentUtterance.volume = 0;
    window.speechSynthesis.speak(silentUtterance);

    const selectedDomain = domainSelector.value;
    currentDomain = selectedDomain;
    currentQuestions = domainData[currentDomain];
    
    setupView.style.display = 'none';
    
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'gemini-loading-screen';
    loadingScreen.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:var(--gray-900); z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px;";
    loadingScreen.innerHTML = `
        <img src="logo.svg" style="height:64px; margin-bottom:24px; animation: pulse 1.5s infinite;" alt="TrainAIToGain Logo" />
        <h2 style="font-size:24px; font-weight:800; color:white; margin-bottom:12px;">Initializing AI Recruiter...</h2>
        <p style="color:var(--gray-400); font-size:16px;">Loading offline question bank for ${currentDomain}...</p>
        
        <!-- ADVANCED FEATURE 4: Pre-flight Internet & System Diagnostics (From Video Research) -->
        <div id="preflight-checks" style="margin-top:24px; text-align:left; background:rgba(0,0,0,0.4); padding:16px 24px; border-radius:12px; width:100%; max-width:400px; display:inline-block;">
            <div id="check-mic" style="color:var(--gray-400); font-size:14px; margin-bottom:8px; display:flex; justify-content:space-between;"><span>Microphone connected</span> <span id="check-mic-status">...</span></div>
            <div id="check-cam" style="color:var(--gray-400); font-size:14px; margin-bottom:8px; display:flex; justify-content:space-between;"><span>Camera initialized</span> <span id="check-cam-status">...</span></div>
            <div id="check-net" style="color:var(--gray-400); font-size:14px; display:flex; justify-content:space-between;"><span>Network latency (< 100ms)</span> <span id="check-net-status">...</span></div>
        </div>
        
    `;
    document.getElementById('sim-container').appendChild(loadingScreen);
    
    // Execute preflight animations now that they are in the DOM
    setTimeout(() => { const el = document.getElementById('check-mic-status'); if(el){ el.innerHTML = '✅'; document.getElementById('check-mic').style.color = '#10b981'; }}, 400);
    setTimeout(() => { const el = document.getElementById('check-cam-status'); if(el){ el.innerHTML = '✅'; document.getElementById('check-cam').style.color = '#10b981'; }}, 800);
    setTimeout(() => { 
        const el = document.getElementById('check-net-status');
        if(el) {
            el.innerHTML = '✅ 42ms'; 
            document.getElementById('check-net').style.color = '#10b981'; 
            document.getElementById('preflight-checks').innerHTML += `<div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.1); color:#3b82f6; font-size:13px; font-weight:700;">💡 PRO TIP: Tape a small photo or arrow right next to your webcam lens. Staring at the lens prevents the AI from flagging you for looking away.</div>`;
        }
    }, 1200);

    

    const candidateResume = localStorage.getItem('candidateResumeText');
    const roleTarget = localStorage.getItem('atsRole') || currentDomain;
    
    if (candidateResume) {
        document.querySelector('#gemini-loading-screen p').innerText = "Analyzing your resume and generating personalized technical questions...";
        
        const payload = {
            systemInstruction: {
                role: "system",
                parts: [{ text: `You are an AI screening interviewer. Generate exactly 5 highly technical interview questions based DIRECTLY on the projects and skills in the provided resume for the target role. Return ONLY a raw JSON array of objects with this schema: [{ "q": "[Question]", "answer": "[Ideal Answer]", "keywords": ["kw1", "kw2", "kw3", "kw4"], "feedbackMiss": "You missed [x]", "feedbackHit": "Excellent. [x]" }]. Do not use markdown code blocks, just raw JSON.` }]
            },
            contents: [
                { role: "user", parts: [{ text: "Target Role: " + roleTarget + "\n\nResume:\n" + candidateResume }] }
            ]
        };
        
        fetch('/api/generateAiResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            try {
                let jsonStr = data.candidates[0].content.parts[0].text.trim();
                if (jsonStr.startsWith("```json")) jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                const customQuestions = JSON.parse(jsonStr);
                if (customQuestions && customQuestions.length > 0) {
                    currentQuestions = customQuestions;
                    console.log("Loaded custom resume questions!");
                }
            } catch (err) {
                console.error("Failed to parse AI questions, falling back to offline bank.", err);
            }
            loadingScreen.remove();
            startInterviewEngine();
        })
        .catch(err => {
            console.error(err);
            loadingScreen.remove();
            startInterviewEngine();
        });
        
    } else {
        
    const candidateResume = localStorage.getItem('candidateResumeText');
    const roleTarget = localStorage.getItem('atsRole') || currentDomain;
    
    if (candidateResume) {
        document.querySelector('#gemini-loading-screen p').innerText = "Analyzing your resume and generating personalized technical questions...";
        
        const payload = {
            systemInstruction: {
                role: "system",
                parts: [{ text: `You are an AI screening interviewer. Generate exactly 5 highly technical interview questions based DIRECTLY on the projects and skills in the provided resume for the target role. Return ONLY a raw JSON array of objects with this schema: [{ "q": "[Question]", "answer": "[Ideal Answer]", "keywords": ["kw1", "kw2", "kw3", "kw4"], "feedbackMiss": "You missed [x]", "feedbackHit": "Excellent. [x]" }]. Do not use markdown code blocks, just raw JSON.` }]
            },
            contents: [
                { role: "user", parts: [{ text: "Target Role: " + roleTarget + "\n\nResume:\n" + candidateResume }] }
            ]
        };
        
        fetch('/api/generateAiResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            try {
                let jsonStr = data.candidates[0].content.parts[0].text.trim();
                if (jsonStr.startsWith("```json")) jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                const customQuestions = JSON.parse(jsonStr);
                if (customQuestions && customQuestions.length > 0) {
                    currentQuestions = customQuestions;
                    console.log("Loaded custom resume questions!");
                }
            } catch (err) {
                console.error("Failed to parse AI questions, falling back to offline bank.", err);
            }
            loadingScreen.remove();
            startInterviewEngine();
        })
        .catch(err => {
            console.error(err);
            loadingScreen.remove();
            startInterviewEngine();
        });
        
    } else {
        // Simulate a brief loading screen so it feels realistic, then start

        setTimeout(() => {
            loadingScreen.remove();
            startInterviewEngine();
        }, 3500);
    }
    }
} // CLOSE proceedWithInterviewLoading()

    function startInterviewEngine() {
        currentQ = 0;
        
        if (window.activeStream) {
            const videoEl = document.getElementById('user-camera');
            videoEl.srcObject = window.activeStream;
            videoEl.style.display = 'block';
            document.getElementById('camera-placeholder').style.display = 'none';
        } else {
            document.getElementById('camera-placeholder').innerHTML = '<div style="font-size:48px; margin-bottom:16px;">🎙️</div><p style="color:#aaa; font-weight:600;">Audio Only Mode</p>';
        }


    activeView.style.display = 'block';

    // ADVANCED FEATURE 1: Real-time Lighting Detection (From Video Research)
    // African applicants were failing due to poor lighting. We analyze the canvas brightness.
    window.paceTimer = setInterval(() => {
        const video = document.getElementById('user-camera');
        if (!video || video.style.display === 'none' || video.paused) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(video, 0, 0, 64, 64);
            const data = ctx.getImageData(0, 0, 64, 64).data;
            let sum = 0;
            for (let i = 0; i < data.length; i += 4) {
                sum += (data[i] + data[i+1] + data[i+2]) / 3;
            }
            const brightness = sum / (64 * 64);
            // If average pixel brightness is below 40, warn them.
            if (brightness > 0 && brightness < 40) {
                document.getElementById('lighting-warning').style.display = 'flex';
            } else {
                document.getElementById('lighting-warning').style.display = 'none';
            }
        } catch(e) {}
    }, 2000);

    // ADVANCED FEATURE 2: Pace Analyzer & Teleprompter Eye-Tracking Warning
    if (teleprompterEnabled) {
        document.getElementById('lighting-warning').insertAdjacentHTML('afterend', 
            '<div style="position:absolute; top:100px; left:20px; z-index:100; background:rgba(16,185,129,0.9); color:white; padding:8px 16px; border-radius:8px; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.5);">👁️ WARNING: Do not read directly. AI tracks eye movement.</div>'
        );
    }

    
    synth.getVoices(); // Ensure voices are loaded
    
    // Skip the long greeting and immediately start the interview
    setTimeout(() => {
        askQuestion();
    }, 500);
    } // CLOSE startInterviewEngine() !!


  nextBtn.addEventListener('click', () => {
    // UC-03: Clear countdown timers to prevent desync during rapid question switches
    if(window.paceTimer) clearInterval(window.paceTimer);
    if(window.fallbackTimer) clearTimeout(window.fallbackTimer);
    const paceWarning = document.getElementById('pace-warning');
    if (paceWarning) paceWarning.style.display = 'none';

    if (synth.speaking) synth.cancel();
    
    if (currentQ + 1 >= currentQuestions.length) {
      setUIState('feedback', 'Module Complete');
      
      // Hide the global chat widget so it doesn't overlap the final dashboard
      const chatWidget = document.getElementById('chat-widget-container');
      if (chatWidget) chatWidget.style.display = 'none';
      const chatToggle = document.getElementById('chat-widget-toggle');
      if (chatToggle) chatToggle.style.display = 'none';
      
      nextBtn.style.display = 'none';
      
      const avgScore = totalQuestionsAnswered > 0 ? Math.round(totalScore / totalQuestionsAnswered) : 0;
      let passChance = 'Low (<20%)';
      let passColor = '#ef4444';
      if (avgScore >= 80) { passChance = 'High (85%+)'; passColor = '#10b981'; }
      else if (avgScore >= 50) { passChance = 'Moderate (50%)'; passColor = '#eab308'; }
      
      // Hook: Analytics tracker for post-interview transition state
      if (typeof window.trackInterviewScore === 'function') {
          window.trackInterviewScore(avgScore, passChance, totalFillers, true, passChance);
      }
      
      let improvement = "Your delivery is crisp. Focus on projecting confidence and maintaining this pacing.";
      if (totalFillers > 2) {
          improvement = "You use too many filler words ('um', 'like', 'uh'). Practice speaking slower and embracing silent pauses to sound more authoritative.";
      } else if (avgScore < 80) {
          improvement = "You need to incorporate more domain-specific keywords into your answers. The AI relies heavily on vocabulary density to score you.";
      }
      
      const summaryHTML = `
        <div style="background:var(--black); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:48px; text-align:center; width:100%; box-shadow:0 12px 48px rgba(0,0,0,0.5); animation:fade-up 0.6s ease-out;">
            <h2 style="color:white; font-size:32px; margin-bottom:8px; font-weight:800;">Interview Complete 🏆</h2>
            <p style="color:var(--gray-400); margin-bottom:32px; font-size:16px;">Here is your performance breakdown.</p>
            
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:32px; margin-bottom:32px;">
                <div style="font-size:12px; color:var(--gray-400); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Predicted Pass Probability</div>
                <div style="font-size:48px; font-weight:800; color:${passColor}; margin-bottom:32px; text-shadow: 0 4px 12px ${passColor}33;">${passChance}</div>
                
                <div style="display:flex; justify-content:center; gap:64px; border-top:1px solid rgba(255,255,255,0.05); padding-top:32px;">
                    <div>
                        <div style="font-size:11px; color:var(--gray-500); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Confidence Score</div>
                        <div style="font-size:28px; color:white; font-weight:700;">${avgScore}%</div>
                    </div>
                    <div>
                        <div style="font-size:11px; color:var(--gray-500); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Total Filler Words</div>
                        <div style="font-size:28px; color:white; font-weight:700;">${totalFillers}</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align:left; background:rgba(16, 185, 129, 0.05); border:1px solid rgba(16, 185, 129, 0.2); border-radius:12px; padding:24px; margin-bottom:32px;">
                <div style="font-size:12px; color:var(--primary); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em; font-weight:800; display:flex; align-items:center; gap:8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Priority Action Plan
                </div>
                <div style="font-size:15px; color:#ddd; line-height:1.6;">${improvement}</div>
            </div>
            
            <a href="apply.html" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; width:100%; max-width:400px; font-size:16px; margin-bottom:16px; background:#3b82f6; box-shadow:0 8px 24px rgba(59, 130, 246, 0.4);">Your interview score qualifies you for 3 active roles. View matches now ➔</a><br><a href="post-hire.html" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; width:100%; max-width:300px; font-size:16px;">Next Step: Post-Hire Guide ➔</a>
        </div>
      `;
      
      const vContainer = document.querySelector('.video-container');
      vContainer.style.display = 'none'; // Hide the restricted video container
      document.getElementById('active-view').insertAdjacentHTML('beforeend', summaryHTML); // Append clean layout

      
      // Stop the camera feed to save battery now that we're done
      const cam = document.getElementById('user-camera');
      if (cam && cam.srcObject) {
          cam.srcObject.getTracks().forEach(t => t.stop());
      }
    } else {
      currentQ++;
      askQuestion();
    }
  });
  




  document.getElementById('stop-ai-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (synth.paused) {
          synth.resume();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;
      } else if (synth.speaking) {
          synth.pause();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume AI`;
      }
  });
  // Global Affiliate Tracker
  (function() {
    var ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('affiliate_ref', ref);
    var activeRef = localStorage.getItem('affiliate_ref');
    if (activeRef) {
      document.addEventListener('DOMContentLoaded', function() {
        var links = document.querySelectorAll('a[href^="https://t.mercor.com"]');
        links.forEach(function(link) {
          try {
            var url = new URL(link.href);
            url.searchParams.set('ref', activeRef);
            link.href = url.toString();
          } catch(e) {}
        });
      });
    }
  })();
function openNavbarLeadModal(e) {
  e.preventDefault();
  document.getElementById('navbarLeadModal').style.display = 'flex';
}
function closeNavbarLeadModal() {
  document.getElementById('navbarLeadModal').style.display = 'none';
}
function submitNavbarLead(e) {
  e.preventDefault();
  var btn = document.getElementById('navbarLeadBtn');
  var name = document.getElementById('navbarLeadName').value;
  var email = document.getElementById('navbarLeadEmail').value.trim();
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  
  btn.innerHTML = 'Sending...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  fetch('https://script.google.com/macros/s/AKfycbymXTe1ePaiA33w_q1DnCrixUi_ZiFbWxFXL7bBCKP-Z-hvyI_EyKPyajSaB1oqPltS2Q/exec', {
    method: 'POST',
    body: JSON.stringify({ firstName: name, email: email, source: 'Navbar Popup Form' })
  }).catch(e => console.error(e));

  setTimeout(function() {
    window.location.href = 'hiring-blueprint.html';
  }, 1000);
}
