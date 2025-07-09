import React, { useState, useEffect } from 'react';
import { 
  getPlans, 
  createPlan, 
  updatePlan, 
  deletePlan 
} from '../services/firestore';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  Zap,
  Shield,
  Crown,
  RefreshCw,
  Info
} from 'lucide-react';

interface PlanFormData {
  name: string;
  price: number;
  recommendations_per_day: number;
  features: string[];
  paypal_plan_id: string;
  popular: boolean;
}

const PlanManager: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    price: 0,
    recommendations_per_day: 0,
    features: [''],
    paypal_plan_id: '',
    popular: false
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await getPlans();
      setPlans(plansData);
    } catch (error: any) {
      setError(error.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      recommendations_per_day: 0,
      features: [''],
      paypal_plan_id: '',
      popular: false
    });
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Plan name is required');
      }
      
      if (formData.price < 0) {
        throw new Error('Price cannot be negative');
      }
      
      if (formData.recommendations_per_day < 0) {
        throw new Error('Recommendations per day cannot be negative');
      }
      
      // Filter out empty features
      const features = formData.features.filter(f => f.trim() !== '');
      if (features.length === 0) {
        throw new Error('At least one feature is required');
      }

      // Create plan
      await createPlan({
        name: formData.name,
        price: formData.price,
        recommendations_per_day: formData.recommendations_per_day,
        features,
        paypal_plan_id: formData.paypal_plan_id,
        popular: formData.popular
      });

      setSuccess('Plan created successfully!');
      resetForm();
      setIsCreating(false);
      await loadPlans();
    } catch (error: any) {
      setError(error.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Plan name is required');
      }
      
      if (formData.price < 0) {
        throw new Error('Price cannot be negative');
      }
      
      if (formData.recommendations_per_day < 0) {
        throw new Error('Recommendations per day cannot be negative');
      }
      
      // Filter out empty features
      const features = formData.features.filter(f => f.trim() !== '');
      if (features.length === 0) {
        throw new Error('At least one feature is required');
      }

      // Update plan
      await updatePlan(isEditing, {
        name: formData.name,
        price: formData.price,
        recommendations_per_day: formData.recommendations_per_day,
        features,
        paypal_plan_id: formData.paypal_plan_id,
        popular: formData.popular
      });

      setSuccess('Plan updated successfully!');
      resetForm();
      setIsEditing(null);
      await loadPlans();
    } catch (error: any) {
      setError(error.message || 'Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await deletePlan(planId);
      setSuccess('Plan deleted successfully!');
      await loadPlans();
    } catch (error: any) {
      setError(error.message || 'Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (plan: any) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      recommendations_per_day: plan.recommendations_per_day,
      features: [...plan.features],
      paypal_plan_id: plan.paypal_plan_id || '',
      popular: plan.popular || false
    });
    setIsEditing(plan.id);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    resetForm();
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    resetForm();
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-5 w-5 text-gray-400" />;
      case 'basic': return <Zap className="h-5 w-5 text-green-400" />;
      case 'pro': return <Zap className="h-5 w-5 text-blue-400" />;
      case 'elite': return <Crown className="h-5 w-5 text-purple-400" />;
      default: return <Layers className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Layers className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Subscription Plans</h3>
        </div>
        
        <button
          onClick={startCreating}
          disabled={isCreating || isEditing !== null}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
          <button 
            onClick={() => setSuccess('')}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="mb-8 bg-black/20 rounded-lg p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Plan' : 'Edit Plan'}
          </h4>
          
          <form onSubmit={isCreating ? handleCreatePlan : handleUpdatePlan} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Pro Plan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)*
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="pl-10 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="29.99"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Analyses Per Month*
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.recommendations_per_day}
                    onChange={(e) => setFormData({ ...formData, recommendations_per_day: parseInt(e.target.value) })}
                    className="pl-10 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PayPal Plan ID
                </label>
                <input
                  type="text"
                  value={formData.paypal_plan_id}
                  onChange={(e) => setFormData({ ...formData, paypal_plan_id: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="P-5ML4271244454362WXNWU5NQ"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get this from your PayPal Developer Dashboard
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Features*
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Feature</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length <= 1}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="popularPlan"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label htmlFor="popularPlan" className="text-gray-300">
                Mark as popular (highlighted in UI)
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isCreating ? 'Creating...' : 'Updating...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{isCreating ? 'Create Plan' : 'Update Plan'}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={isCreating ? cancelCreating : cancelEditing}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left text-white font-semibold py-3">Plan</th>
              <th className="text-left text-white font-semibold py-3">Price</th>
              <th className="text-left text-white font-semibold py-3">Analyses/Month</th>
              <th className="text-left text-white font-semibold py-3">Features</th>
              <th className="text-left text-white font-semibold py-3">PayPal ID</th>
              <th className="text-left text-white font-semibold py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && plans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading plans...</p>
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  <p>No plans found. Create your first plan.</p>
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="border-b border-white/10">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(plan.id)}
                      <div>
                        <p className="text-white font-medium">{plan.name}</p>
                        <p className="text-xs text-gray-400">ID: {plan.id}</p>
                      </div>
                      {plan.popular && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-white font-medium">${plan.price}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-white">{plan.recommendations_per_day}</span>
                  </td>
                  <td className="py-4">
                    <div className="max-w-xs">
                      <p className="text-gray-300 truncate">
                        {plan.features.slice(0, 2).join(', ')}
                        {plan.features.length > 2 && '...'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {plan.features.length} features
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="max-w-xs">
                      {plan.paypal_plan_id ? (
                        <p className="text-gray-300 font-mono text-xs truncate">
                          {plan.paypal_plan_id}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-xs italic">Not set</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(plan)}
                        disabled={isCreating || isEditing !== null}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={loading || plan.id === 'free'}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                        title={plan.id === 'free' ? 'Free plan cannot be deleted' : 'Delete plan'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Information */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-2">Plan Management</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Create and manage subscription plans for your users</li>
              <li>• Set prices, features, and PayPal integration</li>
              <li>• Mark plans as "popular" to highlight them in the UI</li>
              <li>• The Free plan is required and cannot be deleted</li>
              <li>• Changes to plans will affect new subscriptions only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanManager;