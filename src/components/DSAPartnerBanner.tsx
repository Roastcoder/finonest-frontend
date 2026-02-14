import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DSAPartnerBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="container">
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Business Opportunity</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Start Your <span className="text-primary">Loan Business</span> with Finonest
              </h2>
              <p className="text-muted-foreground mb-6">
                Join as a DSA Partner and earn attractive commissions on every loan disbursement. 
                Zero investment, multiple products, and dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/dsa-registration">
                    Become Partner
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Zero Investment</h3>
                <p className="text-sm text-muted-foreground">Start earning without any upfront costs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Multiple Products</h3>
                <p className="text-sm text-muted-foreground">8+ loan products to offer customers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">High Earnings</h3>
                <p className="text-sm text-muted-foreground">Attractive commissions on disbursals</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Quick Start</h3>
                <p className="text-sm text-muted-foreground">Simple online registration process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DSAPartnerBanner;