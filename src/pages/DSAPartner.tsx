import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle, 
  FileText, 
  Phone, 
  Mail,
  CreditCard,
  Home,
  Car,
  Building,
  GraduationCap,
  Briefcase,
  DollarSign,
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const DSAPartner = () => {
  const loanProducts = [
    { icon: Home, name: "Home Loans", description: "Residential & commercial property loans" },
    { icon: Briefcase, name: "Business Loans", description: "Working capital & term loans" },
    { icon: Users, name: "Personal Loans", description: "Unsecured personal financing" },
    { icon: Building, name: "Loan Against Property", description: "Secured loans against property" },
    { icon: Car, name: "Car Loans", description: "New & used vehicle financing" },
    { icon: GraduationCap, name: "Education Loans", description: "Study abroad & domestic education" },
    { icon: CreditCard, name: "Credit Cards", description: "Various credit card options" },
    { icon: Shield, name: "Insurance Products", description: "Life & general insurance" }
  ];

  const benefits = [
    { icon: DollarSign, title: "Zero Investment", description: "No upfront costs or hidden fees" },
    { icon: TrendingUp, title: "High Earnings", description: "Attractive commissions on disbursals" },
    { icon: Clock, title: "Fast Payouts", description: "Quick & transparent payment system" },
    { icon: Users, title: "Multiple Products", description: "Wide portfolio of loan products" },
    { icon: Shield, title: "Dedicated Support", description: "Professional team assistance" },
    { icon: CheckCircle, title: "Digital Tools", description: "Smart lead management system" }
  ];

  const eligibilityProfiles = [
    "Loan Agents",
    "Ex-Bankers", 
    "Financial Advisors",
    "Mutual Fund Agents",
    "Chartered Accountants",
    "Real Estate Professionals",
    "Business Owners & Entrepreneurs"
  ];

  const trainingTopics = [
    "Loan Products Knowledge - Types, rates, eligibility & terms",
    "Sales & Communication Skills - Effective pitching & conversion",
    "Customer Relationship Management - Building trust & relationships", 
    "Compliance & Guidelines - RBI norms & lender policies"
  ];

  const documents = [
    "Mobile Number",
    "PAN Card", 
    "Aadhaar Card (for Individuals)",
    "GST Certificate (for Firms, if applicable)"
  ];

  const registrationSteps = [
    { step: 1, title: "Apply Online", description: "Fill DSA Partner registration form and upload documents" },
    { step: 2, title: "Verification Call", description: "Our team contacts you for verification and guidance" },
    { step: 3, title: "Orientation Session", description: "Learn about products, process, and lead handling" },
    { step: 4, title: "Agreement Signing", description: "Become official Finonest DSA Partner and start earning" }
  ];

  return (
    <>
      <Helmet>
        <title>DSA Partner Registration - Finonest | Start Your Loan Business</title>
        <meta name="description" content="Join Finonest as DSA Partner. Earn high commissions on loan disbursals. Zero investment, multiple products, fast payouts. Register online now!" />
        <meta name="keywords" content="DSA partner, loan agent, financial services, commission, business opportunity, Finonest" />
        <link rel="canonical" href="https://finonest.com/dsa-partner" />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen bg-background pb-20 lg:pb-0">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          
          <div className="container relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6">
                Partner Opportunity
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Start Your <span className="text-primary">Loan Business</span> with Finonest
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                Partner with a Trusted Loan Distribution Network
              </p>
              <p className="text-foreground text-xl font-semibold mb-8">
                Earn high & fast payouts on every successfully disbursed loan.
              </p>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join Finonest as a DSA Partner and build a scalable, hassle-free loan business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="#register">Become Partner</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="#benefits">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is DSA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
                Who is a DSA?
              </h2>
              <Card className="mb-8">
                <CardContent className="p-8">
                  <p className="text-lg text-center mb-6">
                    A Direct Selling Agent (DSA) acts as a bridge between customers and financial institutions such as Banks & NBFCs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Key Responsibilities:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Identify Potential Customers</strong>
                            <p className="text-sm text-muted-foreground">Find individuals or businesses looking for financial solutions</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Guide Borrowers</strong>
                            <p className="text-sm text-muted-foreground">Explain loan products, eligibility, and application processes</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Ensure Documentation</strong>
                            <p className="text-sm text-muted-foreground">Collect and verify required documents accurately</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Close Deals</strong>
                            <p className="text-sm text-muted-foreground">Coordinate with lenders and help complete loan disbursement</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4 text-primary">Earning Potential</h3>
                      <p className="text-sm">
                        As a Finonest DSA Partner, your earnings are directly linked to the loan amount disbursed.
                      </p>
                      <div className="mt-4 p-4 bg-background rounded border">
                        <p className="text-center font-semibold text-lg">Unlimited Earning Potential</p>
                        <p className="text-center text-sm text-muted-foreground">Commission on every successful disbursement</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Loan Products Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Wide Portfolio of Products
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Partner with a fast-growing loan distribution platform offering comprehensive financial solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loanProducts.map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <product.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who Can Become DSA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Who Can Become a Finonest DSA Partner?
              </h2>
              <p className="text-lg mb-8">
                Anyone with communication skills, market understanding, and ambition can join Finonest.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Ideal Profiles Include:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {eligibilityProfiles.map((profile, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{profile}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>No heavy investment required</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>No prior finance degree required</span>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-4 mt-4">
                        <h4 className="font-semibold mb-2">Eligibility Criteria:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Age: 25 years or above</li>
                          <li>• Nationality: Indian Resident</li>
                          <li>• Education: No mandatory qualification</li>
                          <li>• Profession: Open to all professionals</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Why Partner with Finonest?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Finonest is a modern, tech-driven loan distribution platform designed for today's DSAs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Training Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
                Training Provided to Finonest DSAs
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Once onboarded, Finonest provides structured training covering:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {trainingTopics.map((topic, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-sm">{topic}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Registration Process Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
                Finonest DSA Registration Process
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Getting started with Finonest is quick and simple:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {registrationSteps.map((step, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{step.step}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Documents Required Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
                Documents Required for DSA Registration
              </h2>
              <p className="text-muted-foreground mb-8">
                To register as a Finonest Loan DSA Partner, you need:
              </p>
              
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    All documents are submitted online during registration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features & Earnings Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
                Features & Earnings – Finonest DSA Program
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>As a Finonest Business Partner, you can:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Identify & onboard clients</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Verify customer eligibility</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Match borrowers with the right lender</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Ensure quicker loan disbursals</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What You Get:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>Unlimited earning potential</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>Be your own boss</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>No office or staff required</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>Build long-term customer relationships</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>Expand your professional network</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Who can become a Finonest DSA Partner?</h3>
                    <p className="text-sm text-muted-foreground">Anyone interested in financial services and business growth.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Is there any registration fee?</h3>
                    <p className="text-sm text-muted-foreground">No, Finonest DSA registration is investment-free.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How do DSAs earn?</h3>
                    <p className="text-sm text-muted-foreground">DSAs earn commissions on every successful loan disbursement.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How do I register?</h3>
                    <p className="text-sm text-muted-foreground">Simply apply online through Finonest.com. Become Partner page and form application will be shown to admin.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="register" className="py-16">
          <div className="container">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Ready to Start Your Loan Business?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of successful DSA partners who are earning attractive commissions with Finonest. 
                Start your journey today with zero investment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/dsa-registration">Register as DSA Partner</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <BottomNavigation />
    </>
  );
};

export default DSAPartner;