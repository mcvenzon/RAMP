import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  ShoppingBag, 
  Search,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MarketplaceDashboardProps {
  onRefresh?: () => void;
}

const MarketplaceDashboard = ({ onRefresh }: MarketplaceDashboardProps) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [marketStats, setMarketStats] = useState({
    avgPrice: 0,
    demandIndex: 0,
    activeListings: 0
  });

  useEffect(() => {
    fetchMarketStats();
  }, []);

  const fetchMarketStats = async () => {
    setLoading(true);
    try {
      // In a real app, we'd call a stats endpoint
      // Mocking for now as we haven't implemented a dedicated stats service
      setMarketStats({
        avgPrice: 15.85,
        demandIndex: 0.62,
        activeListings: 24
      });
    } catch (err) {
      setError('Failed to load market stats.');
    } finally {
      setLoading(false);
    }
  };

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
    <Page title="Marketplace Insights" subtitle="Analyze price trends and demand indicators">
      <div className="space-y-6">
        {/* Market Pulse Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={TrendingUp} 
            label="Avg. Price (7d)" 
            value={`$${marketStats.avgPrice.toFixed(2)}`} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            icon={Activity} 
            label="Market Demand" 
            value={marketStats.demandIndex.toFixed(2)} 
            colorClass="bg-purple-500" 
          />
          <StatCard 
            icon={ShoppingBag} 
            label="Active Listings" 
            value={marketStats.activeListings.toString()} 
            colorClass="bg-green-500" 
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mrf-secondary focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Filter Results
          </Button>
        </div>

        {/* Error State */}
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        {/* Chart Section */}
        <Card title="Price & Demand Correlation" subtitle="7-day trend analysis">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                <Tooltip />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  name="Price ($)"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#8b5cf6" 
                  fill="transparent" 
                  name="Demand Index"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Transactions">
             <div className="space-y-4 py-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                        M
                      </div>
                      <div>
                        <p className="text-sm font-medium">Aluminum (100kg)</p>
                        <p className="text-xs text-gray-500">Sold to City MRF • 2h ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">+$1,550.00</p>
                      <p className="text-xs text-gray-400">Completed</p>
                    </div>
                  </div>
                ))}
             </div>
          </Card>
          <Card title="Upcoming Bids">
             <div className="space-y-4 py-2">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        B
                      </div>
                      <div>
                        <p className="text-sm font-medium">PET (50kg)</p>
                        <p className="text-xs text-gray-500">Bid by User_942</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">$825.00</p>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default MarketplaceDashboard;
