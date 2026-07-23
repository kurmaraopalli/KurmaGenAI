// Quick test script for the knowledge base search logic

const knowledgeBase = [
    { patterns: ['fifa 2026', 'world cup 2026', 'fifa world cup 2026'], answer: 'The 2026 FIFA World Cup is being held in the United States, Canada, and Mexico...' },
    { patterns: ['fifa 2022', 'world cup 2022', 'fifa world cup 2022'], answer: 'Argentina won the 2022 FIFA World Cup...' },
    { patterns: ['most fifa world cup', 'most world cups won'], answer: 'Brazil holds the record for the most FIFA World Cup titles with 5 wins...' },
    { patterns: ['cricket world cup 2023', 'icc world cup 2023', 'cwc 2023', 'odi world cup 2023'], answer: 'Australia won the 2023 ICC Cricket World Cup...' },
    { patterns: ['cricket world cup 2011', '2011 cricket world cup', 'icc world cup 2011', 'cwc 2011', 'odi world cup 2011'], answer: 'India won the 2011 ICC Cricket World Cup, defeating Sri Lanka by 6 wickets...' },
    { patterns: ['most cricket world cup', 'most odi world cups'], answer: 'Australia holds the record for the most ICC Cricket World Cup (ODI) titles with 6 wins...' },
    { patterns: ['t20 world cup 2024', 'icc t20 world cup 2024', 't20 wc 2024'], answer: 'India won the 2024 ICC T20 World Cup...' },
    { patterns: ['capital of india'], answer: 'The capital of India is New Delhi.' },
    { patterns: ['champions trophy 2025', 'icc champions trophy 2025', 'ct 2025'], answer: 'India won the 2025 ICC Champions Trophy...' },
    { patterns: ['ipl 2024', 'ipl 2024 winner'], answer: 'Kolkata Knight Riders (KKR) won the IPL 2024 title...' },
];

function searchKnowledgeBase(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    const stopWords = new Set([
        'who', 'what', 'when', 'where', 'which', 'how', 'is', 'are', 'was', 'were',
        'won', 'win', 'winner', 'did', 'does', 'do', 'has', 'have', 'had',
        'the', 'a', 'an', 'in', 'on', 'at', 'of', 'for', 'to', 'and', 'or',
        'tell', 'me', 'about', 'please', 'can', 'you', 'i', 'want', 'know',
        'give', 'info', 'information', 'details', 'explain'
    ]);
    const normalizedQuery = lowerQuery.replace(/[?!.,]/g, '').split(/\s+/)
        .filter(w => !stopWords.has(w)).join(' ');
    
    // Step 2: Try exact pattern matching on BOTH original and normalized query
    for (const entry of knowledgeBase) {
        for (const pattern of entry.patterns) {
            if (lowerQuery.includes(pattern) || normalizedQuery.includes(pattern)) {
                return entry.answer;
            }
        }
    }
    
    // Step 3: Smart keyword matching
    const queryWords = normalizedQuery.split(/\s+/);
    let bestMatch = null;
    let bestScore = 0;
    
    for (const entry of knowledgeBase) {
        for (const pattern of entry.patterns) {
            const patternWords = pattern.split(/\s+/);
            const matchedPatternWords = patternWords.filter(pw => queryWords.includes(pw));
            const matchCount = matchedPatternWords.length;
            const matchRatio = matchCount / patternWords.length;
            const threshold = patternWords.length >= 4 ? 0.75 : 1.0;
            
            if (matchRatio >= threshold && patternWords.length >= 2) {
                const score = matchCount + matchRatio;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = entry.answer;
                }
            }
        }
    }
    
    return bestMatch;
}

// ====== TEST CASES ======
const tests = [
    { query: "Who won the cricket world cup in 2011?", expected: "India won the 2011" },
    { query: "Who won the 2011 cricket world cup?", expected: "India won the 2011" },
    { query: "cricket world cup 2011", expected: "India won the 2011" },
    { query: "Who won FIFA 2022?", expected: "Argentina won the 2022" },
    { query: "Who won the FIFA 2026 world cup?", expected: "2026 FIFA World Cup is being held" },
    { query: "who won the world cup 2022", expected: "Argentina won the 2022" },  
    { query: "most world cups won", expected: "Brazil holds the record" },
    { query: "Who won the T20 World Cup 2024?", expected: "India won the 2024 ICC T20" },
    { query: "What is the capital of India?", expected: "New Delhi" },
    { query: "Who won IPL 2024?", expected: "Kolkata Knight Riders" },
    { query: "Who won Champions Trophy 2025?", expected: "India won the 2025 ICC Champions" },
    { query: "cricket world cup 2023 winner", expected: "Australia won the 2023" },
];

console.log("=== Knowledge Base Search Tests ===\n");
let passed = 0;
let failed = 0;

for (const test of tests) {
    const result = searchKnowledgeBase(test.query);
    const isPass = result && result.includes(test.expected);
    
    if (isPass) {
        passed++;
        console.log(`✅ PASS: "${test.query}"`);
        console.log(`   → ${result.substring(0, 80)}...`);
    } else {
        failed++;
        console.log(`❌ FAIL: "${test.query}"`);
        console.log(`   Expected to contain: "${test.expected}"`);
        console.log(`   Got: ${result ? result.substring(0, 80) + '...' : 'null (no match)'}`);
    }
    console.log();
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed out of ${tests.length} tests ===`);
