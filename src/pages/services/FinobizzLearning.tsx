import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Video, Award, Users, Clock, CheckCircle, ArrowRight, Play } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: string;
}

const features = [
  {
    icon: Video,
    title: "Video Lessons",
    description: "High-quality video content by industry experts",
  },
  {
    icon: BookOpen,
    title: "Study Materials",
    description: "Downloadable PDFs and reference guides",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Get certified upon course completion",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow learners and mentors",
  },
];

const FinobizzLearning = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses?.filter((course: Course) => course.status === 'active') || []);
      } else {
        // Use fallback courses if API fails
        setCourses([
          {
            id: 1,
            title: "Personal Finance Basics",
            description: "Learn the fundamentals of personal finance, budgeting, and money management.",
            duration: "2 hours",
            lessons: 8,
            level: "Beginner" as const,
            status: "active"
          },
          {
            id: 2,
            title: "Understanding Credit Scores",
            description: "Master credit scores, reports, and how to improve your creditworthiness.",
            duration: "1.5 hours",
            lessons: 6,
            level: "Beginner" as const,
            status: "active"
          },
          {
            id: 3,
            title: "Loan Application Process",
            description: "Step-by-step guide to applying for loans and getting the best rates.",
            duration: "3 hours",
            lessons: 12,
            level: "Intermediate" as const,
            status: "active"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Use fallback courses on error
      setCourses([
        {
          id: 1,
          title: "Personal Finance Basics",
          description: "Learn the fundamentals of personal finance, budgeting, and money management.",
          duration: "2 hours",
          lessons: 8,
          level: "Beginner" as const,
          status: "active"
        },
        {
          id: 2,
          title: "Understanding Credit Scores",
          description: "Master credit scores, reports, and how to improve your creditworthiness.",
          duration: "1.5 hours",
          lessons: 6,
          level: "Beginner" as const,
          status: "active"
        },
        {
          id: 3,
          title: "Loan Application Process",
          description: "Step-by-step guide to applying for loans and getting the best rates.",
          duration: "3 hours",
          lessons: 12,
          level: "Intermediate" as const,
          status: "active"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  return (
    <>
      <Helmet>
        <title>Finobizz Learning Platform - Finonest | Financial Education</title>
        <meta name="description" content="Learn about loans, credit scores, investments, and financial planning with Finobizz Learning Platform by Finonest. Free courses for everyone." />
        <meta name="keywords" content="financial education, loan courses, credit score, investment basics, Finobizz, Finonest" />
        <link rel="canonical" href="https://finonest.com/services/finobizz-learning" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pb-16 lg:pb-0">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Finobizz Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Master Your <span className="text-gradient">Financial Future</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Free financial education courses designed to help you make smarter decisions about 
                loans, investments, and money management. Learn from industry experts at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/services/finobizz-learning/apply">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Courses */}
        {courses.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Available Courses
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Start your financial education journey with our expertly crafted courses
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons} lessons
                      </div>
                      <Button variant="outline" size="sm">
                        Start Course
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Program Details */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                About Finobizz Learning Program
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by Finonest - Your gateway to financial expertise and career growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Program Objective */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Program Objective</h3>
                <p className="text-muted-foreground text-sm">
                  To provide comprehensive financial education and practical skills training to help individuals excel in the finance industry and make informed financial decisions.
                </p>
              </div>

              {/* Program Fee & Enrollment */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Program Fee & Enrollment</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Fee:</strong> ₹15,000 (One-time payment)
                </p>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Enrollment:</strong> Rolling admissions throughout the year
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>Payment Options:</strong> Online payment, EMI available
                </p>
              </div>

              {/* Finance Knowledge & Skills */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Finance Knowledge & Skills Covered</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Personal Finance Management</li>
                  <li>• Loan Processing & Documentation</li>
                  <li>• Credit Analysis & Risk Assessment</li>
                  <li>• Investment Planning & Portfolio Management</li>
                  <li>• Banking Operations & Compliance</li>
                  <li>• Financial Planning & Advisory</li>
                </ul>
              </div>

              {/* Practical Training Approach */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Practical Training Approach</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Live case studies and real-world scenarios</li>
                  <li>• Hands-on training with industry tools</li>
                  <li>• Interactive workshops and simulations</li>
                  <li>• Project-based learning assignments</li>
                  <li>• Mentorship from industry experts</li>
                </ul>
              </div>

              {/* Career Guidance & Job Assistance */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Career Guidance & Job Assistance</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Resume building and interview preparation</li>
                  <li>• Job placement assistance with partner companies</li>
                  <li>• Career counseling and guidance sessions</li>
                  <li>• Industry networking opportunities</li>
                  <li>• Internship opportunities with Finonest</li>
                </ul>
              </div>

              {/* Eligibility & Who Can Join */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Eligibility & Who Can Join</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Graduates from any discipline</li>
                  <li>• Working professionals seeking career change</li>
                  <li>• Fresh graduates looking to enter finance</li>
                  <li>• Entrepreneurs and business owners</li>
                  <li>• Anyone interested in financial literacy</li>
                </ul>
              </div>

              {/* Work Model */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Work Model (WFH / Office Based)</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Hybrid Model:</strong> Flexible learning options
                </p>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Online live sessions and recorded lectures</li>
                  <li>• Weekend classroom sessions (optional)</li>
                  <li>• Work-from-home friendly schedule</li>
                  <li>• Mobile app for learning on-the-go</li>
                </ul>
              </div>

              {/* Why Choose Finobizz */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Why Choose Finobizz</h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Industry-recognized certification</li>
                  <li>• Expert faculty with 15+ years experience</li>
                  <li>• 95% job placement rate</li>
                  <li>• Lifetime access to course materials</li>
                  <li>• Strong alumni network</li>
                  <li>• Continuous skill development programs</li>
                </ul>
              </div>

              {/* Program Duration & Structure */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Program Duration & Structure</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Duration:</strong> 6 months (Part-time)
                </p>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Schedule:</strong> Weekends (Sat-Sun) 2-6 PM
                </p>
                <p className="text-muted-foreground text-sm mb-2">
                  <strong>Format:</strong> 70% Online + 30% Practical
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>Modules:</strong> 12 comprehensive modules
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certification & Important Info */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Certification */}
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-semibold text-foreground">Certification / Program Completion</h3>
                </div>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Industry-recognized Finobizz Certificate</li>
                  <li>• Digital badge for LinkedIn profile</li>
                  <li>• Transcript of completed modules</li>
                  <li>• Letter of recommendation (top performers)</li>
                  <li>• Continuing education credits</li>
                </ul>
              </div>

              {/* Important Disclaimer */}
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Important Disclaimer</h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>• Job placement assistance is provided but employment is not guaranteed</p>
                  <p>• Course content may be updated based on industry requirements</p>
                  <p>• Refund policy: 7-day money-back guarantee</p>
                  <p>• Minimum 80% attendance required for certification</p>
                  <p>• All course materials are proprietary to Finonest</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Enquiry */}
        <section className="py-16">
          <div className="container">
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Contact & Enquiry Details
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Phone</h4>
                  <p className="text-primary-foreground/80">+91-98765-43210</p>
                  <p className="text-primary-foreground/80">+91-87654-32109</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Email</h4>
                  <p className="text-primary-foreground/80">learning@finonest.com</p>
                  <p className="text-primary-foreground/80">support@finobizz.com</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Office Hours</h4>
                  <p className="text-primary-foreground/80">Mon-Fri: 9 AM - 6 PM</p>
                  <p className="text-primary-foreground/80">Sat: 10 AM - 4 PM</p>
                </div>
              </div>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Why Learn with Finobizz?
                </h2>
                <p className="text-primary-foreground/80 mb-8">
                  Our platform is designed by financial experts to give you practical knowledge 
                  that you can apply in your daily financial decisions.
                </p>
                <div className="space-y-4">
                  {[
                    "100% Free courses - no hidden charges",
                    "Learn from industry experts with 15+ years experience",
                    "Practical knowledge you can apply immediately",
                    "Get certified and boost your financial literacy",
                    "Access anytime, anywhere on any device",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur p-8 rounded-2xl text-center">
                <div className="text-5xl font-bold mb-2">10,000+</div>
                <div className="text-primary-foreground/80 mb-6">Learners already enrolled</div>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/services/finobizz-learning/apply">
                    Join Now - It's Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Sign up now and get instant access to all our free courses. No credit card required.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/services/finobizz-learning/apply">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
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

export default FinobizzLearning;
