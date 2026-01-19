import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BankerForm = () => {
  const [formData, setFormData] = useState({
    lender_id: "",
    banker_name: "",
    mobile_number: "",
    official_email: "",
    profile: "",
    reporting_to: ""
  });

  const [territories, setTerritories] = useState([{
    id: 1,
    name: "",
    distance: "",
    latitude: "",
    longitude: "",
    address: "",
    caseTypes: []
  }]);

  const lenders = [
    { id: 1, name: 'HDFC Bank', code: 'hdfc', email_domain: '@hdfcbank.com' },
    { id: 2, name: 'ICICI Bank', code: 'icici', email_domain: '@icicibank.com' },
    { id: 3, name: 'State Bank of India', code: 'sbi', email_domain: '@sbi.co.in' },
    { id: 4, name: 'Axis Bank', code: 'axis', email_domain: '@axisbank.com' },
    { id: 5, name: 'Kotak Mahindra Bank', code: 'kotak', email_domain: '@kotak.com' }
  ];

  const profiles = [
    'sales-executive',
    'sales-manager', 
    'cluster-sales-manager',
    'area-sales-manager',
    'zonal-sales-manager',
    'national-sales-manager'
  ];

  const addTerritory = () => {
    const newId = territories.length + 1;
    setTerritories([...territories, {
      id: newId,
      name: "",
      distance: "",
      latitude: "",
      longitude: "",
      address: "",
      caseTypes: []
    }]);
  };

  const removeTerritory = (id: number) => {
    setTerritories(territories.filter(t => t.id !== id));
  };

  const updateTerritory = (id: number, field: string, value: string) => {
    setTerritories(territories.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      territories: territories
    };

    try {
      const response = await fetch('https://api.finonest.com/api/banker-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        alert('Banker information submitted successfully!');
        // Reset form
        setFormData({
          lender_id: "",
          banker_name: "",
          mobile_number: "",
          official_email: "",
          profile: "",
          reporting_to: ""
        });
        setTerritories([{
          id: 1,
          name: "",
          distance: "",
          latitude: "",
          longitude: "",
          address: "",
          caseTypes: []
        }]);
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <header className="bg-blue-600 text-white py-8">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl font-bold">USED CAR LOAN – BANKER INFORMATION FORM</h1>
            <p className="text-blue-100 mt-2 text-lg">Complete banker profile and territory mapping system</p>
          </div>
        </header>

        {/* Main Form */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Lender Information */}
            <Card>
              <CardHeader>
                <CardTitle>SECTION 1 — LENDER INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Lender Name *</label>
                    <Select value={formData.lender_id} onValueChange={(value) => setFormData({...formData, lender_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Lender" />
                      </SelectTrigger>
                      <SelectContent>
                        {lenders.map(lender => (
                          <SelectItem key={lender.id} value={lender.id.toString()}>
                            {lender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Name *</label>
                    <Input
                      value={formData.banker_name}
                      onChange={(e) => setFormData({...formData, banker_name: e.target.value})}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Mobile Number *</label>
                    <Input
                      type="tel"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Official Email ID *</label>
                    <Input
                      type="email"
                      value={formData.official_email}
                      onChange={(e) => setFormData({...formData, official_email: e.target.value})}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle>SECTION 2 — PROFILE DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Profile *</label>
                    <Select value={formData.profile} onValueChange={(value) => setFormData({...formData, profile: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map(profile => (
                          <SelectItem key={profile} value={profile}>
                            {profile.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Territory Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>SECTION 3 — TERRITORY DETAILS</CardTitle>
                  <Button type="button" onClick={addTerritory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Territory
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {territories.map((territory) => (
                    <div key={territory.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Territory {territory.id}</h3>
                        {territories.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeTerritory(territory.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-3">Territory Location Name *</label>
                          <Input
                            value={territory.name}
                            onChange={(e) => updateTerritory(territory.id, 'name', e.target.value)}
                            placeholder="Enter location name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-3">Coverage Distance (km) *</label>
                          <Input
                            type="number"
                            value={territory.distance}
                            onChange={(e) => updateTerritory(territory.id, 'distance', e.target.value)}
                            placeholder="Enter distance"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Territory Location</label>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Latitude</label>
                            <Input
                              value={territory.latitude}
                              onChange={(e) => updateTerritory(territory.id, 'latitude', e.target.value)}
                              placeholder="Latitude"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Longitude</label>
                            <Input
                              value={territory.longitude}
                              onChange={(e) => updateTerritory(territory.id, 'longitude', e.target.value)}
                              placeholder="Longitude"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Full Address</label>
                            <Input
                              value={territory.address}
                              onChange={(e) => updateTerritory(territory.id, 'address', e.target.value)}
                              placeholder="Full Address"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Type of Cases Open</h4>
                        
                        <div className="space-y-4">
                          {['Sale Purchase', 'Normal Refinance', 'Balance Transfer'].map((caseType) => (
                            <div key={caseType} className="border border-gray-200 rounded-lg p-4">
                              <label className="flex items-center mb-3">
                                <input type="checkbox" className="mr-3" />
                                <span className="font-medium">{caseType}</span>
                              </label>
                              <div className="ml-6 space-y-3">
                                <Input placeholder="Remarks" />
                                <Input type="number" placeholder="Loan Amount Capping" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full py-4 text-lg">
                  Submit Banker Information
                </Button>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default BankerForm;