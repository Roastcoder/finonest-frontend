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
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
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
                Learn <span className="text-gradient">Finance</span> with Expert Courses
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Master financial concepts through our comprehensive course library. From basic personal finance 
                to advanced investment strategies, learn at your own pace with industry experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="#courses">
                    Browse Courses
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

        {/* Available Courses */}
        <section id="courses" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Our Course Library
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive collection of finance courses designed for all skill levels
              </p>
            </div>

            {courses.length > 0 ? (
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
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/services/finobizz-learning/course/${course.id}`}>
                          Start Course
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
                <p className="text-muted-foreground">New courses are being added regularly. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Learn with Us */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Why Choose Our Courses?
                </h2>
                <p className="text-primary-foreground/80 mb-8">
                  Our courses are designed by financial experts to give you practical knowledge 
                  that you can apply in real-world scenarios.
                </p>
                <div className="space-y-4">
                  {[
                    "Expert-led content from industry professionals",
                    "Practical knowledge you can apply immediately",
                    "Self-paced learning with lifetime access",
                    "Interactive content and real-world examples",
                    "Certificate of completion for each course",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur p-8 rounded-2xl text-center">
                <div className="text-5xl font-bold mb-2">{courses.length}+</div>
                <div className="text-primary-foreground/80 mb-6">Courses Available</div>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="#courses">
                    Explore Courses
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
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Browse our course library and start your financial education journey today.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="#courses">
                  View All Courses
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
