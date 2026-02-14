// Simple RAG system for Finonest with Ollama
interface FinonestData {
  category: string;
  content: string;
  keywords: string[];
}

// Finonest knowledge base
const finonestKnowledgeBase: FinonestData[] = [
  {
    category: "Home Loans",
    content: "Finonest offers home loans starting from 7.3% p.a. up to ₹5 crores. Features: Quick approval in 24-48 hours, minimal documentation, flexible tenure up to 30 years, no prepayment charges after 12 months. Eligibility: Age 21-65, minimum income ₹25,000/month, credit score 650+.",
    keywords: ["home loan", "housing loan", "property loan", "mortgage", "house", "flat", "apartment"]
  },
  {
    category: "Personal Loans", 
    content: "Personal loans from 9.99% p.a. up to ₹40 lakhs. No collateral required, instant approval, flexible repayment 1-7 years. Use for medical emergencies, education, travel, debt consolidation. Eligibility: Salaried/self-employed, minimum income ₹25,000, credit score 650+.",
    keywords: ["personal loan", "instant loan", "emergency loan", "medical loan", "education loan", "travel loan"]
  },
  {
    category: "Business Loans",
    content: "Business loans from 11% p.a. up to ₹50 lakhs. For working capital, equipment purchase, business expansion. Quick disbursement, minimal documentation. Eligibility: Business vintage 2+ years, annual turnover ₹10 lakhs+, good credit history.",
    keywords: ["business loan", "working capital", "equipment loan", "expansion loan", "SME loan", "commercial loan"]
  },
  {
    category: "Car Loans",
    content: "Car loans starting 8.5% p.a. for new and used cars. Up to 90% financing, tenure up to 7 years. Covers all car brands. Fast approval, competitive rates. Eligibility: Age 21-65, stable income, valid driving license.",
    keywords: ["car loan", "auto loan", "vehicle loan", "new car", "used car", "automobile"]
  },
  {
    category: "Credit Cards",
    content: "Multiple credit card options with lifetime free cards, cashback rewards, travel benefits. Compare and apply for best credit cards from top banks. Features vary by card type and bank partner.",
    keywords: ["credit card", "cashback", "rewards", "travel card", "shopping card", "fuel card"]
  },
  {
    category: "Company Info",
    content: "Finonest is India's fastest growing loan provider with 50+ banking partners. Founded by Surya Mohan Roy (MD), Sanam Makkar (CTO), CA Prateek Somani (CFO), Prateek Rathore (Sales Director), Atishay Jain (Co-founder). Transparent process, no hidden charges, expert guidance.",
    keywords: ["finonest", "company", "about", "founders", "team", "partners", "banks"]
  },
  {
    category: "Process",
    content: "Finonest loan process: 1) Apply online with basic details 2) Upload documents 3) Verification by our team 4) Approval within 24-48 hours 5) Disbursement to your account. Contact: +91 9462553887, website: finonest.com",
    keywords: ["process", "apply", "documents", "approval", "disbursement", "contact", "phone"]
  },
  {
    category: "Eligibility",
    content: "General eligibility: Age 21-65 years, minimum income ₹25,000/month, credit score 650+, employment stability 2+ years. Documents: Aadhar, PAN, salary slips/ITR, bank statements, employment proof. Specific criteria vary by loan type.",
    keywords: ["eligibility", "documents", "age", "income", "credit score", "salary", "employment"]
  }
];

// Simple text similarity function
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

// Find relevant knowledge based on user query
function findRelevantKnowledge(query: string, limit: number = 3): FinonestData[] {
  const queryLower = query.toLowerCase();
  
  // Score each knowledge item
  const scored = finonestKnowledgeBase.map(item => {
    let score = 0;
    
    // Check keyword matches
    const keywordMatches = item.keywords.filter(keyword => 
      queryLower.includes(keyword.toLowerCase())
    ).length;
    score += keywordMatches * 3;
    
    // Check content similarity
    score += calculateSimilarity(query, item.content) * 2;
    
    // Check category match
    if (queryLower.includes(item.category.toLowerCase())) {
      score += 2;
    }
    
    return { ...item, score };
  });
  
  // Sort by score and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter(item => item.score > 0);
}

// Generate context-aware prompt for Ollama
export function generateOllamaPrompt(userQuery: string, language: 'hindi' | 'english' = 'english'): string {
  const relevantKnowledge = findRelevantKnowledge(userQuery);
  
  let context = "";
  if (relevantKnowledge.length > 0) {
    context = "Relevant Finonest Information:\n" + 
      relevantKnowledge.map(item => `${item.category}: ${item.content}`).join("\n\n");
  }
  
  const systemPrompt = language === 'hindi' 
    ? `आप Finonest के AI सहायक हैं। हिंदी में जवाब दें। Finonest भारत की सबसे तेजी से बढ़ने वाली लोन कंपनी है।`
    : `You are Finonest's AI assistant. Respond in English. Finonest is India's fastest growing loan provider.`;
  
  const instructions = language === 'hindi'
    ? `निर्देश:
- केवल Finonest की सेवाओं के बारे में जानकारी दें
- दिए गए संदर्भ का उपयोग करें
- यदि जानकारी उपलब्ध नहीं है तो +91 9462553887 पर संपर्क करने को कहें
- finonest.com पर आवेदन करने का सुझाव दें`
    : `Instructions:
- Only provide information about Finonest services
- Use the provided context
- If information not available, direct to call +91 9462553887
- Suggest applying at finonest.com`;
  
  return `${systemPrompt}

${context}

${instructions}

User Question: ${userQuery}

Response:`;
}

// Call Ollama API
export async function callOllama(prompt: string, model: string = 'llama3.1:8b'): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Ollama API error:', error);
    throw error;
  }
}

// Main RAG function
export async function askFinonestRAG(
  userQuery: string, 
  language: 'hindi' | 'english' = 'english',
  model: string = 'llama3.1:8b'
): Promise<string> {
  try {
    const prompt = generateOllamaPrompt(userQuery, language);
    const response = await callOllama(prompt, model);
    return response;
  } catch (error) {
    const fallbackMessage = language === 'hindi'
      ? 'तकनीकी समस्या है। कृपया +91 9462553887 पर संपर्क करें।'
      : 'Technical issue. Please contact +91 9462553887.';
    
    return fallbackMessage;
  }
}

// Available Ollama models for fast chat
export const OLLAMA_MODELS = [
  'llama3.2:1b',    // Fastest
  'llama3.2:3b',    // Fast + better quality
  'llama3.1:8b',    // Best balance
  'mistral:7b',     // Alternative
  'phi3:mini',      // Microsoft model
  'gemma:2b'        // Google model
];