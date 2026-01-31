// Knowledge Base for AI Chat Support
export interface LoanProduct {
  name: string;
  type: string;
  interestRate: string;
  maxAmount: string;
  maxTenure: string;
  eligibility: string[];
  documents: string[];
  features: string[];
  useCases?: string[];
}

export interface CompanyInfo {
  name: string;
  description: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  stats: {
    bankPartners: number;
    customersServed: string;
    loansDisbursed: string;
  };
}

export const companyInfo: CompanyInfo = {
  name: "Finonest",
  description: "India's fastest growing loan provider offering home loans, car loans, personal loans & business loans with quick approval and best interest rates.",
  services: [
    "Home Loans",
    "Personal Loans", 
    "Car Loans",
    "Business Loans",
    "Loan Against Property",
    "Credit Cards",
    "Used Car Loans"
  ],
  contact: {
    phone: "+919462553887",
    email: "info@finonest.com",
    website: "https://finonest.com"
  },
  stats: {
    bankPartners: 50,
    customersServed: "10,000+",
    loansDisbursed: "₹500+ Crores"
  }
};

export const loanProducts: LoanProduct[] = [
  {
    name: "Home Loan",
    type: "secured",
    interestRate: "Starting 7.3% p.a.",
    maxAmount: "₹5 Crores",
    maxTenure: "30 years",
    eligibility: [
      "Indian Resident or NRI",
      "Age: 21-65 years",
      "Minimum income: ₹25,000/month",
      "Employment: Salaried or Self-employed",
      "Minimum work experience: 2 years",
      "Good credit score (650+)"
    ],
    documents: [
      "Identity Proof (Aadhaar, PAN, Passport)",
      "Address Proof (Utility bills, Rent agreement)",
      "Income Proof (Salary slips, ITR, Bank statements)",
      "Property Documents",
      "Passport size photographs",
      "Employment/Business proof"
    ],
    features: [
      "Industry's lowest interest rates",
      "24 Hour Approval",
      "100% Transparent - No hidden charges",
      "50+ Bank Partners for best rates",
      "Flexible tenure up to 30 years",
      "Quick sanction & disbursement"
    ]
  },
  {
    name: "Personal Loan",
    type: "unsecured",
    interestRate: "From 9.99% p.a.",
    maxAmount: "₹40 Lakhs",
    maxTenure: "5 years",
    eligibility: [
      "Indian Resident",
      "Age: 21-60 years",
      "Minimum income: ₹25,000/month",
      "Salaried with 1+ year experience",
      "Credit score: 700+ preferred",
      "Stable employment history"
    ],
    documents: [
      "PAN Card & Aadhaar Card",
      "Latest 3 months salary slips",
      "6 months bank statement",
      "Employment ID proof",
      "Passport size photograph"
    ],
    features: [
      "Instant Disbursal - Money in 24 hours",
      "Minimal Documentation",
      "Paperless process",
      "Easy repayment options",
      "No collateral required",
      "Flexible use of funds"
    ],
    useCases: [
      "Wedding Expenses",
      "Medical Emergency",
      "Home Renovation",
      "Travel & Vacation",
      "Debt Consolidation",
      "Education"
    ]
  },
  {
    name: "Car Loan",
    type: "secured",
    interestRate: "Starting 8.5% p.a.",
    maxAmount: "₹1 Crore",
    maxTenure: "7 years",
    eligibility: [
      "Indian Resident",
      "Age: 21-65 years",
      "Minimum income: ₹20,000/month",
      "Salaried or Self-employed",
      "Good credit score (650+)"
    ],
    documents: [
      "Identity & Address Proof",
      "Income Proof",
      "Bank Statements",
      "Car quotation/invoice",
      "Insurance documents"
    ],
    features: [
      "Up to 90% financing",
      "Quick approval process",
      "Competitive interest rates",
      "Flexible repayment options",
      "New & used car financing"
    ]
  },
  {
    name: "Business Loan",
    type: "secured/unsecured",
    interestRate: "Starting 11% p.a.",
    maxAmount: "₹50 Lakhs",
    maxTenure: "5 years",
    eligibility: [
      "Business vintage: 2+ years",
      "Annual turnover: ₹10 Lakhs+",
      "Good credit score",
      "Profitable business"
    ],
    documents: [
      "Business registration documents",
      "Financial statements",
      "Bank statements",
      "ITR for 2 years",
      "Identity & address proof"
    ],
    features: [
      "Working capital financing",
      "Equipment financing",
      "Business expansion loans",
      "Quick processing",
      "Minimal documentation"
    ]
  },
  {
    name: "Loan Against Property",
    type: "secured",
    interestRate: "Starting 9% p.a.",
    maxAmount: "₹5 Crores",
    maxTenure: "20 years",
    eligibility: [
      "Property owner",
      "Age: 25-70 years",
      "Stable income source",
      "Good credit score"
    ],
    documents: [
      "Property documents",
      "Identity & address proof",
      "Income proof",
      "Bank statements",
      "Property valuation report"
    ],
    features: [
      "High loan amount",
      "Lower interest rates",
      "Flexible end-use",
      "Long tenure options"
    ]
  }
];

export const faqData = [
  {
    question: "What is the minimum credit score required?",
    answer: "For most loans, we prefer a credit score of 650+. However, we evaluate applications holistically and may consider lower scores based on other factors."
  },
  {
    question: "How long does loan approval take?",
    answer: "We provide in-principle approval within 24 hours for most loan products. Final approval depends on documentation and verification."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, we believe in 100% transparency. All charges are clearly mentioned upfront with no hidden fees."
  },
  {
    question: "Can I prepay my loan?",
    answer: "Yes, you can prepay your loan partially or fully. Some products may have prepayment charges which will be clearly communicated."
  },
  {
    question: "What documents are required?",
    answer: "Documents vary by loan type but typically include identity proof, address proof, income proof, and bank statements. Specific requirements are shared during application."
  }
];

export const processSteps = [
  {
    step: 1,
    title: "Apply Online",
    description: "Fill out our simple online application form with basic details"
  },
  {
    step: 2,
    title: "Document Verification",
    description: "Upload required documents for quick verification"
  },
  {
    step: 3,
    title: "Approval",
    description: "Get in-principle approval within 24 hours"
  },
  {
    step: 4,
    title: "Disbursement",
    description: "Receive funds directly in your bank account"
  }
];

// Generate comprehensive context for AI
export const generateAIContext = (): string => {
  const context = `
FINONEST COMPANY INFORMATION:
${companyInfo.name} - ${companyInfo.description}

SERVICES OFFERED:
${companyInfo.services.join(', ')}

CONTACT INFORMATION:
Phone: ${companyInfo.contact.phone}
Email: ${companyInfo.contact.email}
Website: ${companyInfo.contact.website}

COMPANY STATISTICS:
- ${companyInfo.stats.bankPartners}+ Banking Partners
- ${companyInfo.stats.customersServed} Customers Served
- ${companyInfo.stats.loansDisbursed} Loans Disbursed

LOAN PRODUCTS DETAILS:

${loanProducts.map(product => `
${product.name.toUpperCase()}:
- Type: ${product.type}
- Interest Rate: ${product.interestRate}
- Maximum Amount: ${product.maxAmount}
- Maximum Tenure: ${product.maxTenure}

Eligibility Criteria:
${product.eligibility.map(item => `• ${item}`).join('\n')}

Required Documents:
${product.documents.map(item => `• ${item}`).join('\n')}

Key Features:
${product.features.map(item => `• ${item}`).join('\n')}

${product.useCases ? `Use Cases:\n${product.useCases.map(item => `• ${item}`).join('\n')}` : ''}
`).join('\n')}

LOAN PROCESS:
${processSteps.map(step => `${step.step}. ${step.title}: ${step.description}`).join('\n')}

FREQUENTLY ASKED QUESTIONS:
${faqData.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

IMPORTANT GUIDELINES:
- Always provide accurate and helpful information about Finonest's loan products
- Direct users to apply online or call ${companyInfo.contact.phone} for assistance
- Mention that rates and terms are subject to credit profile and approval
- Emphasize transparency and no hidden charges policy
- Suggest EMI calculator for loan planning
- Be helpful, professional, and customer-focused in all responses
`;

  return context;
};