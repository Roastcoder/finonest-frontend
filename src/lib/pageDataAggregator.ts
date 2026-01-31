// Page Data Aggregator for AI Training
import { companyInfo, loanProducts, faqData, processSteps } from './knowledgeBase';

export interface PageData {
  route: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
}

export const pageDataCollection: PageData[] = [
  {
    route: "/",
    title: "Finonest | India's Fastest Growing Loan Provider",
    description: "Get home loans, car loans, personal loans & business loans with quick approval and best interest rates from India's fastest growing loan provider.",
    content: `
    Welcome to Finonest - Your trusted financial partner for all loan needs.
    
    Our Services:
    - Home Loans starting at 7.3% p.a.
    - Personal Loans from 9.99% p.a.
    - Car Loans starting at 8.5% p.a.
    - Business Loans from 11% p.a.
    - Loan Against Property from 9% p.a.
    - Credit Cards with attractive benefits
    
    Why Choose Finonest:
    - 50+ Banking Partners
    - 24-hour approval process
    - 100% transparent pricing
    - No hidden charges
    - Quick disbursement
    - Expert guidance throughout
    
    Process:
    1. Apply Online - Simple application form
    2. Document Upload - Minimal documentation
    3. Quick Approval - Within 24 hours
    4. Instant Disbursement - Direct to your account
    `,
    keywords: ["loan", "home loan", "personal loan", "car loan", "business loan", "India", "Finonest", "financial services", "quick approval", "best rates"]
  },
  {
    route: "/services/home-loan",
    title: "Home Loan - Finonest | Rates Starting 7.3% p.a.",
    description: "Get home loans starting at 7.3% p.a. with Finonest. Up to ₹5Cr financing, 30-year tenure, 24-hour approval.",
    content: `
    Home Loan Details:
    - Interest Rate: Starting 7.3% p.a.
    - Maximum Amount: ₹5 Crores
    - Maximum Tenure: 30 years
    - Processing: 24-hour approval
    
    Eligibility:
    - Indian Resident or NRI
    - Age: 21-65 years
    - Minimum income: ₹25,000/month
    - Employment: Salaried or Self-employed
    - Work experience: 2+ years
    - Credit score: 650+
    
    Features:
    - Industry's lowest rates
    - Transparent pricing
    - Quick approval
    - Flexible tenure
    - 50+ bank partners
    
    Rate Structure:
    - ₹10L-₹25L: 7.50% (up to 20 years)
    - ₹25L-₹50L: 7.45% (up to 25 years)
    - ₹50L-₹1Cr: 7.40% (up to 30 years)
    - ₹1Cr+: 7.30% (up to 30 years)
    `,
    keywords: ["home loan", "housing loan", "property loan", "mortgage", "7.3%", "30 years", "5 crores"]
  },
  {
    route: "/services/personal-loan",
    title: "Personal Loan - Finonest | Instant Approval | Up to ₹40 Lakhs",
    description: "Get instant personal loans up to ₹40 lakhs. Interest from 9.99% p.a., minimal documentation, 24-hour disbursal.",
    content: `
    Personal Loan Details:
    - Interest Rate: From 9.99% p.a.
    - Maximum Amount: ₹40 Lakhs
    - Maximum Tenure: 5 years
    - Processing: Instant approval
    
    Eligibility:
    - Indian Resident
    - Age: 21-60 years
    - Minimum income: ₹25,000/month
    - Employment: Salaried (1+ year experience)
    - Credit score: 700+ preferred
    
    Use Cases:
    - Wedding expenses
    - Medical emergencies
    - Home renovation
    - Travel & vacation
    - Debt consolidation
    - Education funding
    
    Features:
    - Instant disbursal (24 hours)
    - Minimal documentation
    - Paperless process
    - No collateral required
    - Flexible usage
    `,
    keywords: ["personal loan", "instant loan", "unsecured loan", "9.99%", "40 lakhs", "24 hours", "minimal docs"]
  },
  {
    route: "/services/car-loan",
    title: "Car Loan - Finonest | New & Used Car Financing",
    description: "Get car loans for new and used vehicles with competitive rates starting 8.5% p.a. Up to 90% financing available.",
    content: `
    Car Loan Details:
    - Interest Rate: Starting 8.5% p.a.
    - Maximum Amount: ₹1 Crore
    - Maximum Tenure: 7 years
    - Financing: Up to 90% of vehicle value
    
    Eligibility:
    - Indian Resident
    - Age: 21-65 years
    - Minimum income: ₹20,000/month
    - Employment: Salaried or Self-employed
    - Credit score: 650+
    
    Features:
    - New & used car financing
    - Quick approval process
    - Competitive rates
    - Flexible repayment
    - Minimal documentation
    `,
    keywords: ["car loan", "vehicle loan", "auto loan", "new car", "used car", "8.5%", "90% financing"]
  },
  {
    route: "/services/business-loan",
    title: "Business Loan - Finonest | Fuel Your Business Growth",
    description: "Get business loans starting 11% p.a. for working capital, equipment, and expansion. Up to ₹50 lakhs with quick approval.",
    content: `
    Business Loan Details:
    - Interest Rate: Starting 11% p.a.
    - Maximum Amount: ₹50 Lakhs
    - Maximum Tenure: 5 years
    - Processing: Quick approval
    
    Eligibility:
    - Business vintage: 2+ years
    - Annual turnover: ₹10 Lakhs+
    - Good credit score
    - Profitable business operations
    
    Use Cases:
    - Working capital financing
    - Equipment purchase
    - Business expansion
    - Inventory funding
    - Technology upgrades
    
    Features:
    - Flexible usage
    - Quick processing
    - Minimal documentation
    - Competitive rates
    `,
    keywords: ["business loan", "working capital", "equipment loan", "business expansion", "11%", "50 lakhs"]
  },
  {
    route: "/about",
    title: "About Finonest - India's Trusted Loan Provider",
    description: "Learn about Finonest's mission to provide transparent, quick, and affordable financial solutions across India.",
    content: `
    About Finonest:
    
    Mission: To democratize access to financial services and make loan processes transparent, quick, and customer-friendly.
    
    Vision: To become India's most trusted financial services platform.
    
    Values:
    - Transparency in all dealings
    - Customer-first approach
    - Quick and efficient service
    - Competitive pricing
    - Ethical business practices
    
    Achievements:
    - 50+ Banking Partners
    - 10,000+ Satisfied Customers
    - ₹500+ Crores Disbursed
    - Pan-India Presence
    
    Team: Experienced professionals from banking and financial services industry committed to serving customers.
    `,
    keywords: ["about finonest", "company", "mission", "vision", "team", "achievements", "trusted", "transparent"]
  },
  {
    route: "/contact",
    title: "Contact Finonest - Get Expert Loan Assistance",
    description: "Contact Finonest for expert loan assistance. Call +919462553887 or visit our offices across India.",
    content: `
    Contact Information:
    
    Phone: +919462553887
    Email: info@finonest.com
    Website: https://finonest.com
    
    Office Hours: Monday to Saturday, 9 AM to 7 PM
    
    Services Available:
    - Loan consultation
    - Application assistance
    - Document guidance
    - Status tracking
    - Customer support
    
    How to Reach:
    - Call our toll-free number
    - WhatsApp for quick queries
    - Email for detailed inquiries
    - Visit nearest branch
    - Online chat support
    `,
    keywords: ["contact", "phone", "email", "support", "assistance", "consultation", "customer service"]
  }
];

// Generate comprehensive training data for AI
export const generateTrainingData = (): string => {
  const trainingContent = `
COMPREHENSIVE FINONEST KNOWLEDGE BASE FOR AI TRAINING

COMPANY OVERVIEW:
${companyInfo.name} is ${companyInfo.description}

COMPLETE SERVICE PORTFOLIO:
${companyInfo.services.map(service => `• ${service}`).join('\n')}

DETAILED PAGE CONTENT:
${pageDataCollection.map(page => `
PAGE: ${page.route}
TITLE: ${page.title}
DESCRIPTION: ${page.description}
CONTENT: ${page.content}
KEYWORDS: ${page.keywords.join(', ')}
`).join('\n')}

LOAN PRODUCTS COMPREHENSIVE DETAILS:
${loanProducts.map(product => `
${product.name.toUpperCase()} COMPLETE INFORMATION:
- Product Type: ${product.type}
- Interest Rate: ${product.interestRate}
- Maximum Loan Amount: ${product.maxAmount}
- Maximum Repayment Tenure: ${product.maxTenure}

DETAILED ELIGIBILITY CRITERIA:
${product.eligibility.map(criteria => `✓ ${criteria}`).join('\n')}

COMPLETE DOCUMENT REQUIREMENTS:
${product.documents.map(doc => `📄 ${doc}`).join('\n')}

KEY PRODUCT FEATURES & BENEFITS:
${product.features.map(feature => `⭐ ${feature}`).join('\n')}

${product.useCases ? `COMMON USE CASES:\n${product.useCases.map(useCase => `💡 ${useCase}`).join('\n')}` : ''}
`).join('\n')}

CUSTOMER SUPPORT & PROCESS:
${processSteps.map(step => `STEP ${step.step}: ${step.title}\n${step.description}`).join('\n\n')}

FREQUENTLY ASKED QUESTIONS & ANSWERS:
${faqData.map(faq => `❓ QUESTION: ${faq.question}\n✅ ANSWER: ${faq.answer}`).join('\n\n')}

CONTACT & SUPPORT INFORMATION:
📞 Phone: ${companyInfo.contact.phone}
📧 Email: ${companyInfo.contact.email}
🌐 Website: ${companyInfo.contact.website}

COMPANY STATISTICS & ACHIEVEMENTS:
🏦 Banking Partners: ${companyInfo.stats.bankPartners}+
👥 Customers Served: ${companyInfo.stats.customersServed}
💰 Total Loans Disbursed: ${companyInfo.stats.loansDisbursed}

AI RESPONSE GUIDELINES:
1. Always provide accurate, helpful, and detailed information
2. Use the comprehensive knowledge base above for all responses
3. Be conversational yet professional in tone
4. Direct users to specific loan products based on their needs
5. Mention eligibility criteria when discussing loan products
6. Always include contact information for further assistance
7. Emphasize Finonest's key differentiators (transparency, quick approval, competitive rates)
8. Suggest relevant services based on user queries
9. Provide step-by-step guidance when explaining processes
10. Use emojis and formatting to make responses engaging and easy to read
`;

  return trainingContent;
};

// Export all data for AI consumption
export const aiKnowledgeBase = {
  companyInfo,
  loanProducts,
  pageDataCollection,
  faqData,
  processSteps,
  generateTrainingData
};