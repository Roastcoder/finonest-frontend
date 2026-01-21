import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseEnrollmentForm } from "@/components/CourseEnrollmentForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const CourseEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`https://api.finonest.com/api/courses`);
      if (response.ok) {
        const data = await response.json();
        const foundCourse = data.courses?.find((c: Course) => c.id === parseInt(id || '0'));
        setCourse(foundCourse || null);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentSuccess = () => {
    navigate(`/services/finobizz-learning/course/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">Loading course...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/services/finobizz-learning')}>
              Back to Courses
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enroll in {course.title} - Finobizz Learning | Finonest</title>
        <meta name="description" content={`Enroll in ${course.title} course for ₹${course.price}`} />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/services/finobizz-learning/course/${id}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course Details
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Enroll in Course
              </h1>
              <p className="text-muted-foreground">
                Complete your enrollment to start learning
              </p>
            </div>

            <CourseEnrollmentForm 
              course={course} 
              onClose={handleEnrollmentSuccess}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CourseEnrollment;