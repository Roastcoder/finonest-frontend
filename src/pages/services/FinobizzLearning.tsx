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
  price: number;
  original_price?: number;
  image_path?: string;
  video_path?: string;
}

const FinobizzLearning = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const renderFormattedText = (text: string) => {
    return text
      .replace(/#{6}\s*(.*?)$/gm, '<h6>$1</h6>')
      .replace(/#{5}\s*(.*?)$/gm, '<h5>$1</h5>')
      .replace(/#{4}\s*(.*?)$/gm, '<h4>$1</h4>')
      .replace(/#{3}\s*(.*?)$/gm, '<h3>$1</h3>')
      .replace(/#{2}\s*(.*?)$/gm, '<h2>$1</h2>')
      .replace(/#{1}\s*(.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*{4,}(.*?)\*{4,}/g, '<strong>$1</strong>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
      .replace(/•/g, '&bull;')
      .replace(/\n/g, '<br />');
  };

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
        {/* Available Courses */}
        <section className="pt-24 pb-16">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                Learn <span className="text-gradient">Finance</span> with Expert Courses
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Master financial concepts through our comprehensive course library. From basic personal finance 
                to advanced investment strategies, learn at your own pace with industry experts. 
                <span className="font-semibold text-primary">Affordable pricing for quality education.</span>
              </p>
            </div>

            {courses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link 
                    key={course.id} 
                    to={`/services/finobizz-learning/course/${course.id}`}
                    className="bg-card rounded-xl border border-border hover:shadow-lg transition-shadow overflow-hidden block group"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {course.image_path ? (
                        <img 
                          src={`https://api.finonest.com/${course.image_path}`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`flex flex-col items-center justify-center text-gray-400 ${course.image_path ? 'hidden' : ''}`}>
                        <BookOpen className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">Course Image</span>
                        <span className="text-xs">16:9 Ratio Recommended</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                      <div 
                        className="text-muted-foreground text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(course.description) }}
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <BookOpen className="w-4 h-4" />
                          {course.lessons} lessons
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-lg font-bold text-primary">
                            ₹{course.price}
                            {course.original_price && course.original_price > course.price && (
                              <span className="ml-2 text-sm line-through text-muted-foreground">
                                ₹{course.original_price}
                              </span>
                            )}
                          </div>
                          {course.price === 0 ? (
                            <div className="px-3 py-1 bg-green-500 text-white rounded-md text-sm font-medium group-hover:bg-green-600 transition-colors">
                              Free Course
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium group-hover:bg-primary/90 transition-colors">
                              Enroll Now
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
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
                    "Affordable pricing with occasional discounts",
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
