import { useState, useEffect } from 'react';
import api from '../services/api';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  Package, 
  TrendingUp, 
  AlertCircle, 
  Search 
} from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Stable' | 'Low' | 'Critical';
}

const InventoryDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/inventory/materials');
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load inventory data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) => (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );

  return (
    <Page title="Inventory Overview" subtitle="Real-time stock levels across all facilities">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={Package} 
            label="Total Materials" 
            value={materials.length.toString()} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Total Weight" 
            value="507.7 kg" 
            colorClass="bg-green-500" 
          />
          <StatCard 
            icon={AlertCircle} 
            label="Low Stock Alerts" 
            value="2" 
            colorClass="bg-amber-500" 
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mrf-secondary focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Export Report
          </Button>
        </div>

        {/* Error State */}
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        {/* Materials List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Material</th>
                <th className="px-6 py-4 font-semibold text-right">Quantity</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading inventory...</td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{material.name}</td>
                    <td className="px-6 py-4 text-right">{material.quantity} {material.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        material.status === 'Stable' ? 'bg-green-100 text-green-700' :
                        material.status === 'Low' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">Details</Button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No materials found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
};

export default InventoryDashboard;
