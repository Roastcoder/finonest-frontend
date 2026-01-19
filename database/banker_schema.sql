-- Lenders table
CREATE TABLE IF NOT EXISTS lenders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    email_domain VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bankers table
CREATE TABLE IF NOT EXISTS bankers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lender_id INT NOT NULL,
    banker_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    official_email VARCHAR(255) NOT NULL,
    profile ENUM('sales-executive', 'sales-manager', 'cluster-sales-manager', 'area-sales-manager', 'zonal-sales-manager', 'national-sales-manager') NOT NULL,
    reporting_to INT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lender_id) REFERENCES lenders(id),
    FOREIGN KEY (reporting_to) REFERENCES bankers(id)
);

-- Territories table
CREATE TABLE IF NOT EXISTS territories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    banker_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (banker_id) REFERENCES bankers(id) ON DELETE CASCADE
);

-- Case types table
CREATE TABLE IF NOT EXISTS case_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    territory_id INT NOT NULL,
    type ENUM('sale-purchase', 'normal-refinance', 'balance-transfer') NOT NULL,
    remarks TEXT,
    loan_capping DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE CASCADE
);

-- Branches table (if not exists)
CREATE TABLE IF NOT EXISTS branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    x_position DECIMAL(5,2) NULL,
    y_position DECIMAL(5,2) NULL,
    manager_name VARCHAR(255),
    working_hours VARCHAR(100) DEFAULT '9:00 AM - 6:00 PM',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default lenders (ignore if exists)
INSERT IGNORE INTO lenders (name, code, email_domain) VALUES
('HDFC Bank', 'hdfc', '@hdfcbank.com'),
('ICICI Bank', 'icici', '@icicibank.com'),
('State Bank of India', 'sbi', '@sbi.co.in'),
('Axis Bank', 'axis', '@axisbank.com'),
('Kotak Mahindra Bank', 'kotak', '@kotak.com');