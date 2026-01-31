import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoanProduct {
  id?: number;
  lender_name: string;
  product_name: string;
  roi_min: number;
  roi_max: number;
  max_ltv_purchase: number;
  status: 'active' | 'inactive';
  state: string;
  purchase_allowed: boolean;
  refinance_allowed: boolean;
  balance_transfer_allowed: boolean;
  min_cibil_score: number;
  max_dpd_allowed: number;
  min_tenure_months: number;
  max_tenure_months: number;
  petrol_allowed: boolean;
  diesel_allowed: boolean;
  cng_allowed: boolean;
  electric_allowed: boolean;
  income_proof_required: boolean;
  salaried_allowed: boolean;
  self_employed_allowed: boolean;
  min_age: number;
  max_age: number;
  min_income: number;
}

const AdminLoanProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoanProduct>({
    lender_name: '',
    product_name: '',
    roi_min: 0,
    roi_max: 0,
    max_ltv_purchase: 0,
    status: 'active',
    state: 'ALL',
    purchase_allowed: true,
    refinance_allowed: false,
    balance_transfer_allowed: false,
    min_cibil_score: 650,
    max_dpd_allowed: 0,
    min_tenure_months: 12,
    max_tenure_months: 84,
    petrol_allowed: true,
    diesel_allowed: true,
    cng_allowed: false,
    electric_allowed: false,
    income_proof_required: true,
    salaried_allowed: true,
    self_employed_allowed: true,
    min_age: 21,
    max_age: 65,
    min_income: 25000
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.finonest.com/api/policy-engine.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_all_products' })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.eligible_products) {
          setProducts(data.eligible_products);
          localStorage.setItem('loanProducts', JSON.stringify(data.eligible_products));
        }
      }
    } catch (error) {
      console.error('Failed to fetch from API, using localStorage');
      const saved = localStorage.getItem('loanProducts');
      if (saved) setProducts(JSON.parse(saved));
    }
    setLoading(false);
  };

  const saveProduct = async (product: LoanProduct) => {
    try {
      const response = await fetch('https://api.finonest.com/api/policy-engine.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: product.id ? 'update_product' : 'add_product',
          ...product
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchProducts(); // Refresh from API
          return true;
        }
      }
    } catch (error) {
      console.error('API save failed:', error);
    }
    return false;
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch('https://api.finonest.com/api/policy-engine.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', id })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchProducts();
          return true;
        }
      }
    } catch (error) {
      console.error('API delete failed:', error);
    }
    return false;
  };

  const handleInputChange = (field: keyof LoanProduct, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      lender_name: '',
      product_name: '',
      roi_min: 0,
      roi_max: 0,
      max_ltv_purchase: 0,
      status: 'active',
      state: 'ALL',
      purchase_allowed: true,
      refinance_allowed: false,
      balance_transfer_allowed: false,
      min_cibil_score: 650,
      max_dpd_allowed: 0,
      min_tenure_months: 12,
      max_tenure_months: 84,
      petrol_allowed: true,
      diesel_allowed: true,
      cng_allowed: false,
      electric_allowed: false,
      income_proof_required: true,
      salaried_allowed: true,
      self_employed_allowed: true,
      min_age: 21,
      max_age: 65,
      min_income: 25000
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await saveProduct(formData);
    if (success) {
      setIsAddingNew(false);
      setEditingId(null);
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      setLoading(true);
      await deleteProduct(id);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loan Products Management</h1>
        {user?.role !== 'ADVISOR' && (
          <Button onClick={() => { setIsAddingNew(true); resetForm(); }} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {(isAddingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isAddingNew ? 'Add Product' : 'Edit Product'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Lender Name</Label>
                <Input
                  value={formData.lender_name}
                  onChange={(e) => handleInputChange('lender_name', e.target.value)}
                  placeholder="HDFC Bank"
                />
              </div>
              <div>
                <Label>Product Name</Label>
                <Input
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  placeholder="Car Loan"
                />
              </div>
              <div>
                <Label>Min ROI (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.roi_min}
                  onChange={(e) => handleInputChange('roi_min', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Max ROI (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.roi_max}
                  onChange={(e) => handleInputChange('roi_max', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Max LTV (%)</Label>
                <Input
                  type="number"
                  value={formData.max_ltv_purchase}
                  onChange={(e) => handleInputChange('max_ltv_purchase', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Min CIBIL Score</Label>
                <Input
                  type="number"
                  value={formData.min_cibil_score}
                  onChange={(e) => handleInputChange('min_cibil_score', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Min Income (₹)</Label>
                <Input
                  type="number"
                  value={formData.min_income}
                  onChange={(e) => handleInputChange('min_income', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Min Age</Label>
                <Input
                  type="number"
                  value={formData.min_age}
                  onChange={(e) => handleInputChange('min_age', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Loan Types</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.purchase_allowed}
                      onChange={(e) => handleInputChange('purchase_allowed', e.target.checked)}
                    />
                    Purchase
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.refinance_allowed}
                      onChange={(e) => handleInputChange('refinance_allowed', e.target.checked)}
                    />
                    Refinance
                  </label>
                </div>
              </div>
              
              <div>
                <Label>Fuel Types</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.petrol_allowed}
                      onChange={(e) => handleInputChange('petrol_allowed', e.target.checked)}
                    />
                    Petrol
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.diesel_allowed}
                      onChange={(e) => handleInputChange('diesel_allowed', e.target.checked)}
                    />
                    Diesel
                  </label>
                </div>
              </div>
              
              <div>
                <Label>Customer Types</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.salaried_allowed}
                      onChange={(e) => handleInputChange('salaried_allowed', e.target.checked)}
                    />
                    Salaried
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.self_employed_allowed}
                      onChange={(e) => handleInputChange('self_employed_allowed', e.target.checked)}
                    />
                    Self Employed
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
              <Button variant="outline" onClick={() => { setIsAddingNew(false); setEditingId(null); }}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading && products.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading products...</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{product.lender_name}</h3>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{product.product_name}</p>
                    <div className="flex gap-4 text-sm">
                      <span>ROI: {product.roi_min}%-{product.roi_max}%</span>
                      <span>LTV: {product.max_ltv_purchase}%</span>
                      <span>Min CIBIL: {product.min_cibil_score}</span>
                      <span>Min Income: ₹{product.min_income?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditingId(product.id!); setFormData(product); }}
                      disabled={loading}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id!)}
                      disabled={loading}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLoanProducts;