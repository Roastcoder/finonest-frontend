/**
 * FBA (Financial Bureau of Asia) Codes Dictionary
 * Contains all code mappings for credit bureau data processing
 */

export const FBA_CODES = {
  Enquiry_Reason: {
    "1": "Agriculture Loan",
    "2": "Auto Loan",
    "3": "Business Loan",
    "4": "Commercial Vehicle Loans",
    "5": "Construction Equipment loan",
    "6": "Consumer Loan",
    "7": "Credit Card",
    "8": "Education Loan",
    "9": "Leasing",
    "10": "Loan against collateral",
    "11": "Microfinance",
    "12": "Non-funded Credit Facility",
    "13": "Personal Loan",
    "14": "Property Loan",
    "15": "Telecom",
    "16": "Two/Three Wheeler Loan",
    "17": "Working Capital Loan",
    "18": "Consumer Loan",
    "19": "Credit Review",
    "99": "Others"
  },

  Finance_Purpose: {
    "1": "Agricultural Machinery",
    "2": "Animal Husbandry",
    "3": "Aquaculture",
    "4": "Biogas Plant",
    "5": "Crop Loan",
    "6": "Horticulture",
    "7": "Irrigation System",
    "8": "New Car",
    "9": "Overdraft against Car",
    "10": "Used Car",
    "11": "General",
    "12": "Small & Medium Business",
    "13": "Professionals",
    "14": "Trade",
    "15": "Bus",
    "16": "Tempo",
    "17": "Tipper",
    "18": "Truck",
    "20": "Forklift",
    "21": "Wheel Loaders",
    "22": "Consumer Search",
    "23": "Credit Card",
    "24": "Fleet Card",
    "25": "For Working Executives",
    "26": "Study Abroad",
    "27": "Study in India",
    "28": "Leasing",
    "29": "Bank Deposits",
    "30": "Gold",
    "31": "Govt. Bonds / PPF / NSC / KVP / FD",
    "32": "Shares and Mutual Funds",
    "33": "Business Loan",
    "34": "Housing Loan",
    "35": "Personal Loan",
    "36": "Agriculture",
    "37": "General",
    "38": "Small Business",
    "39": "Computers / Laptops",
    "40": "Consumer Durables",
    "41": "Marriage / Religious Ceremonies",
    "42": "Travel",
    "43": "Balance Transfer",
    "44": "Home Improvement / Extension",
    "45": "Land",
    "46": "Lease Rental Discounting",
    "47": "Loan against Property",
    "48": "New Home",
    "49": "Office Premises",
    "50": "Under construction",
    "51": "Broadband",
    "52": "Landline",
    "53": "Mobile",
    "54": "Three Wheeler",
    "55": "Two Wheeler",
    "56": "Cash credit facility",
    "57": "Overdraft",
    "58": "Term Loan",
    "60": "Microfinance Detailed Report",
    "61": "Summary Report",
    "62": "VB OLM Retrieval Service",
    "63": "Account Review",
    "64": "Retro Enquiry",
    "65": "Locate Plus",
    "66": "Consumer Search Loan",
    "67": "Indicative Report",
    "68": "Consumer Search Loan",
    "69": "Bank OLM Retrieval Service",
    "70": "Adviser Liability",
    "71": "Secured (Account Group for Portfolio Review response)",
    "72": "Unsecured (Account Group for Portfolio Review response)",
    "99": "Others"
  },

  Terms_Frequency: {
    "D": "Daily",
    "P": "Single payment loan",
    "W": "Weekly",
    "B": "Bi-Weekly",
    "E": "Semi-monthly",
    "M": "Monthly",
    "L": "2 monthly (bimonthly)",
    "Q": "3 monthly (quarterly)",
    "T": "Triannualy",
    "HY": "Half-Yearly",
    "Y": "Yearly",
    "X": "Variable",
    "U": "Unknown",
    "OD": "On-demand",
    "BP": "Bullet Payment"
  },

  Gender_Code: {
    "1": "Male",
    "2": "Female",
    "3": "Transgender"
  },

  State: {
    "01": "JAMMU and KASHMIR",
    "02": "HIMACHAL PRADESH",
    "03": "PUNJAB",
    "04": "CHANDIGARH",
    "05": "UTTRANCHAL",
    "06": "HARAYANA",
    "07": "DELHI",
    "08": "RAJASTHAN",
    "09": "UTTAR PRADESH",
    "10": "BIHAR",
    "11": "SIKKIM",
    "12": "ARUNACHAL PRADESH",
    "13": "NAGALAND",
    "14": "MANIPUR",
    "15": "MIZORAM",
    "16": "TRIPURA",
    "17": "MEGHALAYA",
    "18": "ASSAM",
    "19": "WEST BENGAL",
    "20": "JHARKHAND",
    "21": "ORRISA",
    "22": "CHHATTISGARH",
    "23": "MADHYA PRADESH",
    "24": "GUJRAT",
    "25": "DAMAN and DIU",
    "26": "DADARA and NAGAR HAVELI",
    "27": "MAHARASHTRA",
    "28": "ANDHRA PRADESH",
    "29": "KARNATAKA",
    "30": "GOA",
    "31": "LAKSHADWEEP",
    "32": "KERALA",
    "33": "TAMIL NADU",
    "34": "PONDICHERRY",
    "35": "ANDAMAN and NICOBAR ISLANDS",
    "36": "TELANGANA",
    "99": "APO Address"
  },

  Marital_Status: {
    "1": "Single",
    "2": "Married",
    "3": "Widow/Widower",
    "4": "Divorced",
    "blank": ""
  },

  Employment_Status: {
    "blank": "blank",
    "S": "Salaried",
    "N": "Non-Salaried",
    "E": "Self-employed",
    "P": "Self-employed Professional",
    "U": "Unemployed"
  },

  Account_Type: {
    "1": "AUTO LOAN",
    "2": "HOUSING LOAN",
    "3": "PROPERTY LOAN",
    "4": "LOAN AGAINST SHARES/SECURITIES",
    "5": "PERSONAL LOAN",
    "6": "CONSUMER LOAN",
    "7": "GOLD LOAN",
    "8": "EDUCATIONAL LOAN",
    "9": "LOAN TO PROFESSIONAL",
    "10": "CREDIT CARD",
    "11": "LEASING",
    "12": "OVERDRAFT",
    "13": "TWO-WHEELER LOAN",
    "14": "NON-FUNDED CREDIT FACILITY",
    "15": "LOAN AGAINST BANK DEPOSITS",
    "16": "FLEET CARD",
    "17": "Commercial Vehicle Loan",
    "18": "Telco - Wireless",
    "19": "Telco - Broadband",
    "20": "Telco - Landline",
    "23": "GECL Secured",
    "24": "GECL Unsecured",
    "31": "Secured Credit Card",
    "32": "Used Car Loan",
    "33": "Construction Equipment Loan",
    "34": "Tractor Loan",
    "35": "Corporate Credit Card",
    "36": "Kisan Credit Card",
    "37": "Loan on Credit Card",
    "38": "Prime Minister Jaan Dhan Yojana - Overdraft",
    "39": "Mudra Loans - Shishu / Kishor / Tarun",
    "40": "Microfinance - Business Loan",
    "41": "Microfinance - Personal Loan",
    "42": "Microfinance - Housing Loan",
    "43": "Microfinance - Others",
    "44": "Pradhan Mantri Awas Yojana - Credit Link Subsidy Scheme MAY CLSS",
    "45": "P2P Personal Loan",
    "46": "P2P Auto Loan",
    "47": "P2P Education Loan",
    "50": "Business Loan - Secured",
    "51": "BUSINESS LOAN - GENERAL",
    "52": "BUSINESS LOAN -PRIORITY SECTOR - SMALL BUSINESS",
    "53": "BUSINESS LOAN -PRIORITY SECTOR - AGRICULTURE",
    "54": "BUSINESS LOAN -PRIORITY SECTOR - OTHERS",
    "55": "BUSINESS NON-FUNDED CREDIT FACILITY - GENERAL",
    "56": "BUSINESS NON-FUNDED CREDIT FACILITY - PRIORITY SECTOR - SMALL BUSINESS",
    "57": "BUSINESS NON-FUNDED CREDIT FACILITY - PRIORITY SECTOR - AGRICULTURE",
    "58": "BUSINESS NON-FUNDED CREDIT FACILITY - PRIORITY SECTOR - OTHERS",
    "59": "BUSINESS LOANS AGAINST BANK DEPOSITS",
    "60": "Staff Loan",
    "61": "Business Loan - Unsecured",
    "69": "Short Term Personal Loan [Unsecured]",
    "70": "Priority Sector Gold Loan [Secured]",
    "71": "Temporary Overdraft [Unsecured]",
    "blank": "",
    "00": "Others"
  },

  Account_Status: {
    "11": "ACTIVE",
    "12": "CLOSED",
    "13": "CLOSED",
    "14": "CLOSED",
    "15": "CLOSED",
    "16": "CLOSED",
    "17": "CLOSED",
    "21": "ACTIVE",
    "22": "ACTIVE",
    "23": "ACTIVE",
    "24": "ACTIVE",
    "25": "ACTIVE",
    "30": "Restructured",
    "31": "Restructured Loan (Govt. Mandated)",
    "32": "Settled",
    "33": "Post (WO) Settled",
    "34": "Account Sold",
    "35": "Written Off and Account Sold",
    "36": "Account Purchased",
    "37": "Account Purchased and Written Off",
    "38": "Account Purchased and Settled",
    "39": "Account Purchased and Restructured",
    "40": "Status Cleared",
    "41": "Restructured Loan",
    "42": "Restructured Loan (Govt. Mandated)",
    "43": "Written-off",
    "44": "Settled",
    "45": "Post (WO) Settled",
    "46": "Account Sold",
    "47": "Written Off and Account Sold",
    "48": "Account Purchased",
    "49": "Account Purchased and Written Off",
    "50": "Account Purchased and Settled",
    "51": "Account Purchased and Restructured",
    "52": "Status Cleared",
    "53": "Suit Filed",
    "54": "Suit Filed and Written-off",
    "55": "Suit Filed and Settled",
    "56": "Suit Filed and Post (WO) Settled",
    "57": "Suit Filed and Account Sold",
    "58": "Suit Filed and Written Off and Account Sold",
    "59": "Suit Filed and Account Purchased",
    "60": "Suit Filed and Account Purchased and Written Off",
    "61": "Suit Filed and Account Purchased and Settled",
    "62": "Suit Filed and Account Purchased and Restructured",
    "63": "Suit Filed and Status Cleared",
    "64": "Wilful Default and Restructured Loan",
    "65": "Wilful Default and Restructured Loan (Govt. Mandated)",
    "66": "Wilful Default and Settled",
    "67": "Wilful Default and Post (WO) Settled",
    "68": "Wilful Default and Account Sold",
    "69": "Wilful Default and Written Off and Account Sold",
    "70": "Wilful Default and Account Purchased",
    "71": "ACTIVE",
    "72": "Wilful Default and Account Purchased and Written Off",
    "73": "Wilful Default and Account Purchased and Settled",
    "74": "Wilful Default and Account Purchased and Restructured",
    "75": "Wilful Default and Status Cleared",
    "76": "Suit filed (Wilful default) and Restructured",
    "77": "Suit filed (Wilful default) and Restructured Loan (Govt. Mandated)",
    "78": "ACTIVE",
    "79": "Suit filed (Wilful default) and Settled",
    "80": "ACTIVE",
    "81": "Suit filed (Wilful default) and Post (WO) Settled",
    "82": "ACTIVE",
    "83": "ACTIVE",
    "84": "ACTIVE",
    "85": "Suit filed (Wilful default) and Account Sold",
    "86": "Suit filed (Wilful default) and Written Off and Account Sold",
    "87": "Suit filed (Wilful default) and Account Purchased",
    "88": "Suit filed (Wilful default) and Account Purchased and Written Off",
    "89": "Wilful default",
    "90": "Suit filed (Wilful default) and Account Purchased and Restructured",
    "91": "Suit filed (Wilful default) and Status Cleared",
    "93": "Suit Filed(Wilful default)",
    "94": "Suit filed (Wilful default) and Account Purchased and Settled",
    "97": "Suit Filed(Wilful Default) and Written-off",
    "130": "Restructured due to COVID-19",
    "131": "Restructured due to natural calamity",
    "132": "Post Write Off Closed",
    "133": "Restructured & Closed",
    "134": "Auctioned & Settled",
    "135": "Repossessed & Settled",
    "136": "Guarantee Invoked",
    "137": "Entity ceased while account was open",
    "138": "Entity ceased while account was closed",
    "00": "No Suit Filed",
    "DEFAULTVALUE": "ACTIVE"
  },

  AccountHoldertypeCode: {
    "1": "Individual",
    "2": "Joint",
    "3": "Authorized User",
    "7": "Guarantor",
    "blank": "",
    "Z": "Deceased"
  },

  Identification_Number: {
    "PU": "BANK",
    "PV": "BANK",
    "FO": "BANK",
    "RR": "BANK",
    "CO": "BANK",
    "NB": "NBFC",
    "HF": "HOUSING FINANCE COMPANY",
    "TE": "TELECOM",
    "IN": "INSURANCE",
    "MF": "MICROFINANCE INSTITUTION",
    "CR": "CREDIT RATING AGENCY"
  },

  Payment_History_Profile: {
    "0": "0–29 days past the due date",
    "1": "30-59 days past the due date",
    "2": "60-89 days past the due date",
    "3": "90-119 days past the due date",
    "4": "120-149 days past the due date",
    "5": "150-179 days past the due date",
    "6": "180 or more days past the due date",
    "N": "Value not available",
    "S": "Asset Classification is Standard",
    "B": "Asset Classification is Substandard",
    "D": "Asset Classification is Doubtful",
    "M": "Asset Classification is Special Mention Account",
    "L": "Asset Classification is Loss"
  },

  Asset_Classification: {
    "0": "0–29 days past the due date",
    "1": "30-59 days past the due date",
    "2": "60-89 days past the due date",
    "3": "90-119 days past the due date",
    "4": "120-149 days past the due date",
    "5": "150-179 days past the due date",
    "6": "180 or more days past the due date",
    "N": "Value not available",
    "S": "Asset Classification is Standard",
    "B": "Asset Classification is Substandard",
    "D": "Asset Classification is Doubtful",
    "M": "Asset Classification is Special Mention Account",
    "L": "Asset Classification is Loss"
  },

  Address_Indicator: {
    "1": "Permanent address",
    "2": "Residence Address",
    "3": "Office Address",
    "4": "Not Categorised",
    "5": "Mortgage Property"
  }
} as const;

// Helper functions for code lookups
export const getFBACodeDescription = (category: keyof typeof FBA_CODES, code: string): string => {
  const categoryData = FBA_CODES[category] as Record<string, string>;
  return categoryData[code] || code;
};

export const getAccountStatusDescription = (code: string): string => {
  return getFBACodeDescription('Account_Status', code);
};

export const getAccountTypeDescription = (code: string): string => {
  return getFBACodeDescription('Account_Type', code);
};

export const getStateDescription = (code: string): string => {
  return getFBACodeDescription('State', code);
};

export const getEmploymentStatusDescription = (code: string): string => {
  return getFBACodeDescription('Employment_Status', code);
};

export const getGenderDescription = (code: string): string => {
  return getFBACodeDescription('Gender_Code', code);
};

export const getMaritalStatusDescription = (code: string): string => {
  return getFBACodeDescription('Marital_Status', code);
};

export const getPaymentHistoryDescription = (code: string): string => {
  return getFBACodeDescription('Payment_History_Profile', code);
};

export const getAssetClassificationDescription = (code: string): string => {
  return getFBACodeDescription('Asset_Classification', code);
};

export const getHolderTypeDescription = (code: string): string => {
  return getFBACodeDescription('AccountHoldertypeCode', code);
};

export const getInstitutionTypeDescription = (code: string): string => {
  return getFBACodeDescription('Identification_Number', code);
};

export const getTermsFrequencyDescription = (code: string): string => {
  return getFBACodeDescription('Terms_Frequency', code);
};

export const getEnquiryReasonDescription = (code: string): string => {
  return getFBACodeDescription('Enquiry_Reason', code);
};

export const getFinancePurposeDescription = (code: string): string => {
  return getFBACodeDescription('Finance_Purpose', code);
};

export const getAddressIndicatorDescription = (code: string): string => {
  return getFBACodeDescription('Address_Indicator', code);
};

// Type definitions for better TypeScript support
export type FBACodeCategory = keyof typeof FBA_CODES;
export type AccountStatusCode = keyof typeof FBA_CODES.Account_Status;
export type AccountTypeCode = keyof typeof FBA_CODES.Account_Type;
export type StateCode = keyof typeof FBA_CODES.State;
export type GenderCode = keyof typeof FBA_CODES.Gender_Code;
export type MaritalStatusCode = keyof typeof FBA_CODES.Marital_Status;
export type EmploymentStatusCode = keyof typeof FBA_CODES.Employment_Status;
export type PaymentHistoryCode = keyof typeof FBA_CODES.Payment_History_Profile;
export type AssetClassificationCode = keyof typeof FBA_CODES.Asset_Classification;
export type HolderTypeCode = keyof typeof FBA_CODES.AccountHoldertypeCode;
export type InstitutionTypeCode = keyof typeof FBA_CODES.Identification_Number;
export type TermsFrequencyCode = keyof typeof FBA_CODES.Terms_Frequency;
export type EnquiryReasonCode = keyof typeof FBA_CODES.Enquiry_Reason;
export type FinancePurposeCode = keyof typeof FBA_CODES.Finance_Purpose;
export type AddressIndicatorCode = keyof typeof FBA_CODES.Address_Indicator;