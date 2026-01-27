import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface LoanProduct {
  id?: number;
  lender_name: string;
  product_name: string;
  roi_min: number;
  roi_max: number;
  max_ltv_purchase: number;
  status: 'active' | 'inactive';
}

const AdminLoanProducts: React.FC = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<LoanProduct>({
    lender_name: '',
    product_name: '',
    roi_min: 0,
    roi_max: 0,
    max_ltv_purchase: 0,
    status: 'active'
  });

  // Default products
  const defaultProducts: LoanProduct[] = [
    {
      id: 1,
      lender_name: 'HDFC Bank',
      product_name: 'Car Loan',
      roi_min: 8.5,
      roi_max: 9.5,
      max_ltv_purchase: 85,
      status: 'active'
    },
    {
      id: 2,
      lender_name: 'ICICI Bank',
      product_name: 'Auto Loan',
      roi_min: 8.75,
      roi_max: 10,
      max_ltv_purchase: 80,
      status: 'active'
    },
    {
      id: 3,
      lender_name: 'Axis Bank',
      product_name: 'Vehicle Loan',
      roi_min: 9,
      roi_max: 11,
      max_ltv_purchase: 90,
      status: 'active'
    }
  ];

  useEffect(() => {
    // Load products from localStorage or use defaults
    const savedProducts = localStorage.getItem('loanProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('loanProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: LoanProduct[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('loanProducts', JSON.stringify(updatedProducts));
  };

  const handleInputChange = (field: keyof LoanProduct, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      lender_name: '',
      product_name: '',
      roi_min: 0,
      roi_max: 0,
      max_ltv_purchase: 0,
      status: 'active'
    });
  };

  const handleEdit = (product: LoanProduct) => {
    setEditingId(product.id || null);
    setFormData(product);
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newProduct = {
        ...formData,
        id: Math.max(...products.map(p => p.id || 0)) + 1
      };
      const updatedProducts = [...products, newProduct];
      saveProducts(updatedProducts);
      setIsAddingNew(false);
    } else if (editingId) {
      const updatedProducts = products.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveProducts(updatedProducts);
      setEditingId(null);
    }
    
    setFormData({
      lender_name: '',
      product_name: '',
      roi_min: 0,
      roi_max: 0,
      max_ltv_purchase: 0,
      status: 'active'
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      lender_name: '',
      product_name: '',
      roi_min: 0,
      roi_max: 0,
      max_ltv_purchase: 0,
      status: 'active'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  const toggleStatus = (id: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    );
    saveProducts(updatedProducts);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loan Products Management</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isAddingNew ? 'Add New Product' : 'Edit Product'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lender_name">Lender Name</Label>
                <Input
                  id="lender_name"
                  value={formData.lender_name}
                  onChange={(e) => handleInputChange('lender_name', e.target.value)}
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              <div>
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  placeholder="e.g., Car Loan"
                />
              </div>
              <div>
                <Label htmlFor="roi_min">Min Interest Rate (%)</Label>
                <Input
                  id="roi_min"
                  type="number"
                  step="0.01"
                  value={formData.roi_min}
                  onChange={(e) => handleInputChange('roi_min', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="roi_max">Max Interest Rate (%)</Label>
                <Input
                  id="roi_max"
                  type="number"
                  step="0.01"
                  value={formData.roi_max}
                  onChange={(e) => handleInputChange('roi_max', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="max_ltv_purchase">Max LTV (%)</Label>
                <Input
                  id="max_ltv_purchase"
                  type="number"
                  value={formData.max_ltv_purchase}
                  onChange={(e) => handleInputChange('max_ltv_purchase', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product) => (
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
                    <span>Interest: {product.roi_min}% - {product.roi_max}%</span>
                    <span>Max LTV: {product.max_ltv_purchase}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(product.id!)}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id!)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No loan products found. Add your first product to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLoanProducts;