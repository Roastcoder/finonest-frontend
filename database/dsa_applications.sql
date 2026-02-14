-- DSA Applications Table
CREATE TABLE IF NOT EXISTS dsa_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pan_number VARCHAR(10) NULL,
    aadhar_number VARCHAR(12) NULL,
    date_of_birth DATE NOT NULL,
    
    -- Address Information
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    
    -- Professional Information
    current_profession VARCHAR(100) NOT NULL,
    experience_years VARCHAR(10) NOT NULL,
    monthly_income VARCHAR(50) NULL,
    
    -- Business Information
    business_type ENUM('individual', 'firm') DEFAULT 'individual',
    gst_number VARCHAR(15) NULL,
    firm_name VARCHAR(255) NULL,
    
    -- Banking Information (Optional)
    bank_name VARCHAR(255) NULL,
    account_number VARCHAR(50) NULL,
    ifsc_code VARCHAR(11) NULL,
    
    -- Business Preferences
    preferred_products JSON NULL,
    target_monthly_cases VARCHAR(20) NULL,
    coverage_area VARCHAR(255) NULL,
    remarks TEXT NULL,
    
    -- Application Status
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Agreements
    terms_accepted BOOLEAN DEFAULT FALSE,
    data_consent BOOLEAN DEFAULT FALSE,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_mobile (mobile_number),
    INDEX idx_status (status),
    INDEX idx_registration_date (registration_date)
);

-- Insert sample data for testing
INSERT INTO dsa_applications (
    full_name, mobile_number, email, pan_number, date_of_birth,
    address, city, state, pincode, current_profession, experience_years,
    business_type, preferred_products, target_monthly_cases, coverage_area,
    status, terms_accepted, data_consent
) VALUES 
(
    'Rajesh Kumar', '+91 9876543210', 'rajesh.kumar@example.com', 'ABCDE1234F', '1985-06-15',
    '123 Main Street, Sector 15', 'Jaipur', 'Rajasthan', '302015', 'Financial Advisor', '5',
    'individual', '["Home Loans", "Personal Loans", "Business Loans"]', '11-20', 'Jaipur, Ajmer',
    'pending', TRUE, TRUE
),
(
    'Priya Sharma', '+91 9876543211', 'priya.sharma@example.com', 'FGHIJ5678K', '1990-03-22',
    '456 Park Avenue, Civil Lines', 'Delhi', 'Delhi', '110001', 'Ex-Banker', '8',
    'individual', '["Home Loans", "Car Loans", "Credit Cards"]', '21-50', 'Delhi NCR',
    'approved', TRUE, TRUE
),
(
    'Amit Singh', '+91 9876543212', 'amit.singh@example.com', NULL, '1988-11-10',
    '789 Business District, MG Road', 'Mumbai', 'Maharashtra', '400001', 'Business Owner', '3',
    'firm', '["Business Loans", "Loan Against Property"]', '6-10', 'Mumbai, Pune',
    'rejected', TRUE, TRUE
);