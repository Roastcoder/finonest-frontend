import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Building2, IndianRupee, Home, Briefcase, Car, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
<<<<<<< HEAD

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order_position: number;
  is_active: boolean;
}


=======
import heroHomeLoan from "@/assets/hero-home-loan.jpg";
import heroCarLoan from "@/assets/hero-car-loan.jpg";
import heroBusinessLoan from "@/assets/hero-business-loan.jpg";
const slides = [{
  id: 1,
  title: "Your Dream Home",
  subtitle: "with Simpler Faster Friendlier Home Loans",
  description: "Get the best home loan rates with 100% paperless processing",
  cta: "Check Now",
  ctaLink: "/services/home-loan",
  image: heroHomeLoan,
  highlight: "Dream Home"
}, {
  id: 2,
  title: "Your Dream Car",
  subtitle: "with Simpler Faster Friendlier Vehicle Loans",
  description: "Get the lowest vehicle loan rates with 100% paperless processing",
  cta: "Check Now",
  ctaLink: "/services/car-loan",
  image: heroCarLoan,
  highlight: "Dream Car"
}, {
  id: 3,
  title: "Business Growth",
  subtitle: "with Simpler Faster Friendlier Business Loans",
  description: "Expand your business with quick disbursal within 48 hours",
  cta: "Check Now",
  ctaLink: "/services/business-loan",
  image: heroBusinessLoan,
  highlight: "Business Growth"
}];
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
const stats = [{
  icon: Users,
  value: "5.8 Lacs",
  suffix: "+",
  label: "Customers Annually"
}, {
  icon: MapPin,
  value: "150",
  suffix: "+",
  label: "Cities Covered"
}, {
  icon: Building2,
  value: "587",
  suffix: "+",
  label: "Branches"
}, {
  icon: IndianRupee,
  value: "61,000",
  suffix: "Cr+",
  label: "Disbursed Annually"
}];
const services = [{
  icon: Home,
  title: "Home Loan",
  badge: "Quick Sanction",
  description: "Instant approval at lowest interest rates",
  href: "/services/home-loan"
}, {
  icon: Briefcase,
  title: "Personal Loan",
  badge: "Quick Disbursal",
  description: "Paperless process at low rate",
  href: "/services/personal-loan"
}, {
  icon: Car,
<<<<<<< HEAD
  title: "Used Car Loan",
  badge: "Lowest EMI Ride",
  description: "Drive away your dream car today.",
  href: "/services/used-car-loan"
=======
  title: "New Car Loan",
  badge: "Lowest EMI Ride",
  description: "Drive away your dream car today.",
  href: "/services/car-loan"
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
}, {
  icon: CreditCard,
  title: "Credit Card",
  badge: "Rewards Unlimited",
  description: "Choose cards from all top banks",
<<<<<<< HEAD
  href: "/credit-cards"
}];
const rotatingWords = ["Credit Card", "Home Loan", "Personal Loan", "Car Loan"];
const HeroSection = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  useEffect(() => {
    const fetchSlides = async () => {
      console.log('Fetching slides from API...');
      try {
        const response = await fetch('https://api.finonest.com/api/slides.php');
        console.log('API response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API data received:', data);
          const activeSlides = data.slides?.filter((slide: Slide) => slide.is_active)
            .sort((a: Slide, b: Slide) => a.order_position - b.order_position);
          console.log('Active slides:', activeSlides);
          console.log('Slide button links:', activeSlides?.map(slide => ({ id: slide.id, title: slide.title, button_link: slide.button_link })));
          if (activeSlides && activeSlides.length > 0) {
            setSlides(activeSlides);
            console.log('Slides set successfully');
          } else {
            console.log('No active slides found');
          }
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };
    
    fetchSlides();
    
    // Listen for slide updates from admin
    const handleSlidesUpdate = () => {
      fetchSlides();
    };
    
    window.addEventListener('slidesUpdated', handleSlidesUpdate);
    
    return () => {
      window.removeEventListener('slidesUpdated', handleSlidesUpdate);
    };
  }, []);
  
  // Reset current slide if it's out of bounds
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);
  
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
=======
  href: "/services/credit-cards"
}];
const rotatingWords = ["Credit Card", "Home Loan", "Personal Loan", "Car Loan"];
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  useEffect(() => {
    if (!isAutoPlaying) return;
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
<<<<<<< HEAD
  }, [isAutoPlaying, slides.length]);
=======
  }, [isAutoPlaying]);
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
<<<<<<< HEAD
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `https://api.finonest.com${imageUrl}`;
    if (imageUrl.startsWith('/')) return `https://api.finonest.com${imageUrl}`;
    return `https://api.finonest.com/uploads/images/${imageUrl}`;
  };
  const getHighlight = (title: string) => {
    if (title.includes('Dream Home')) return 'Dream Home';
    if (title.includes('Dream Car')) return 'Dream Car';
    if (title.includes('Business')) return 'Business Growth';
    return title.split(' ').slice(-2).join(' ');
  };
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-accent/5 overflow-hidden pt-20">
      {slides.length === 0 ? (
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">No slides available</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
=======
  const slide = slides[currentSlide];
  return <section className="relative bg-gradient-to-b from-background via-background to-primary pt-20 md:pt-24 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Tagline, Stats, Services */}
            <div className="space-y-8">
              {/* Tagline */}
              <div>
                <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                  Upgrade the Way
                  <br />
                  You Choose{" "}
                  <span key={currentWord} className="text-primary animate-fade-in inline-block">
                    {rotatingWords[currentWord]}
                  </span>
                </h1>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {stat.value}{" "}
                        <span className="text-primary">{stat.suffix}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>)}
              </div>

              {/* Services Grid - Desktop */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {services.map((service, index) => <div key={index} className="relative bg-card backdrop-blur border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col h-full">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium whitespace-nowrap">
                      {service.badge}
                    </span>
                    <div className="flex flex-col gap-2 mt-2 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <Link to={service.href} className="mt-3">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Apply Now
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>)}
              </div>
            </div>

            {/* Right Side - Banner Carousel */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
<<<<<<< HEAD
                {slides.map((s, index) => (
                  <div key={s.id} className={`transition-opacity duration-700 ${index === currentSlide ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
                    <div className="relative aspect-[5/3]">
                      <img 
                        src={getImageUrl(s.image_url)} 
                        alt={s.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log('Hero image failed to load:', s.image_url);
                          target.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">Image not found</text></svg>');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <h2 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                          <span className="text-yellow-400">{getHighlight(s.title)}</span>
=======
                {slides.map((s, index) => <div key={s.id} className={`transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"}`}>
                    <div className="relative aspect-[4/3]">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <h2 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                          Your{" "}
                          <span className="text-yellow-400">{slide.highlight}</span>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                        </h2>
                        <p className="text-sm text-primary-foreground/90 mb-2">
                          {s.subtitle}
                        </p>
                        <p className="text-xs text-primary-foreground/70 mb-4 max-w-[200px]">
                          {s.description}
                        </p>
<<<<<<< HEAD
                        {(s.button_link && s.button_text) ? (
                          <Button variant="outline" size="sm" className="w-fit bg-foreground text-background hover:bg-foreground/90 border-0" asChild>
                            <Link to={s.button_link} onClick={() => console.log('Desktop slide link clicked:', s.button_link)}>
                              {s.button_text}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        ) : s.button_link ? (
                          <Button variant="outline" size="sm" className="w-fit bg-foreground text-background hover:bg-foreground/90 border-0" asChild>
                            <Link to={s.button_link} onClick={() => console.log('Desktop slide link clicked (fallback):', s.button_link)}>
                              Apply Now
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
=======
                        <Button variant="outline" size="sm" className="w-fit bg-foreground text-background hover:bg-foreground/90 border-0" asChild>
                          <Link to={s.ctaLink}>
                            {s.cta}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>)}
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                
                {/* Navigation Dots */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  {slides.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-accent w-4" : "bg-primary-foreground/40"}`} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Banner only */}
      <div className="lg:hidden">
        <div className="relative">
<<<<<<< HEAD
          {slides.map((s, index) => (
            <div key={s.id} className={`transition-opacity duration-700 ${index === currentSlide ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
              <div className="relative aspect-[16/10]">
                <img 
                  src={getImageUrl(s.image_url)} 
                  alt={s.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log('Mobile hero image failed to load:', s.image_url);
                    target.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">Image not found</text></svg>');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="font-display text-xl font-bold text-primary-foreground mb-1">
                    <span className="text-yellow-400">{getHighlight(s.title)}</span>
=======
          {slides.map((s, index) => <div key={s.id} className={`transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"}`}>
              <div className="relative aspect-[16/10]">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="font-display text-xl font-bold text-primary-foreground mb-1">
                    Your <span className="text-yellow-400">{slide.highlight}</span>
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
                  </h2>
                  <p className="text-xs text-primary-foreground/80 mb-3">
                    {s.description}
                  </p>
<<<<<<< HEAD
                  {(s.button_link && s.button_text) ? (
                    <Button variant="outline" size="sm" className="bg-foreground text-background hover:bg-foreground/90 border-0 text-xs" asChild>
                      <Link to={s.button_link}>
                        {s.button_text}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ) : s.button_link ? (
                    <Button variant="outline" size="sm" className="bg-foreground text-background hover:bg-foreground/90 border-0 text-xs" asChild>
                      <Link to={s.button_link}>
                        Apply Now
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
=======
                  <Button variant="outline" size="sm" className="bg-foreground text-background hover:bg-foreground/90 border-0 text-xs" asChild>
                    <Link to={s.ctaLink}>
                      {s.cta}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>)}
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? "bg-accent w-4" : "bg-primary-foreground/40 w-2"}`} />)}
          </div>
        </div>

        {/* Mobile Tagline */}
        <div className="bg-card py-6 px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Upgrade the Way You Choose
          </h2>
          <p key={currentWord} className="text-2xl font-display font-bold text-accent animate-fade-in">
            {rotatingWords[currentWord]}
          </p>
        </div>

        {/* Mobile Services Grid - 2x2 no scroll */}
        <div className="bg-card px-4 pb-6">
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {services.map((service, index) => <div key={index} className="relative bg-background rounded-xl border border-border p-4 hover:border-primary/50 transition-all group flex flex-col h-full">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium whitespace-nowrap">
                  {service.badge}
                </span>
                <div className="flex flex-col gap-2 mt-1 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <Link to={service.href} className="mt-3">
                  <Button variant="outline" size="sm" className="w-full text-[10px] h-7">
                    Apply Now
                    <ArrowRight className="w-2.5 h-2.5 ml-1" />
                  </Button>
                </Link>
              </div>)}
          </div>
        </div>

        {/* Mobile Stats Bar */}
        
      </div>
<<<<<<< HEAD
        </>
      )}
    </section>
  );
=======
    </section>;
>>>>>>> e6cabab8aaf7d0749e16dfe9d5ed4b6e94f3e258
};
export default HeroSection;