import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, CheckCircle } from "lucide-react";
import creditScoreBanner from "@/assets/credit-score-banner.jpg";

const CreditScoreSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>100% Secure & Free</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Get your CIBIL Credit Report
            </h2>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-500 line-through">₹500</span>
              <span className="text-3xl font-bold text-green-600">FREE</span>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-gray-700 font-medium">
                <span className="text-blue-600 font-bold">5 Lac+</span> people have got their Credit Scores for FREE!
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Instant Credit Score & Report</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">No Hidden Charges</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Safe & Secure Process</span>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Get Free Credit Score
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Right Content - Credit Score Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={creditScoreBanner} 
                alt="Credit Score 732 - Excellent" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Score Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">732</div>
                <div className="text-sm font-semibold text-green-600">Excellent</div>
                <div className="text-xs text-gray-500 mt-1">Credit Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditScoreSection;