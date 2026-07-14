import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './views/Login';
import { Navbar } from './components/Navbar';
import InventoryDashboard from './views/InventoryDashboard';
import MarketplaceDashboard from './views/MarketplaceDashboard';
import LogMaterialForm from './views/LogMaterialView';
import { LayoutDashboard, ShoppingCart, ClipboardList } from 'lucide-react';

function App() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<'inventory' | 'marketplace' | 'logging'>('inventory');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mrf-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => setView('inventory')} />;
  }

  const renderView = () => {
    switch (view) {
      case 'inventory': return <InventoryDashboard />;
      case 'marketplace': return <MarketplaceDashboard />;
      case 'logging': return <LogMaterialForm onSuccess={() => setView('inventory')} />;
      default: return <InventoryDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        user={{ name: user.email || 'User', role: 'MANAGER' }}
        onLogout={signOut}
      />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Mobile-first Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 shadow-lg md:max-w-md md:mx-auto md:bottom-4 md:rounded-full md:shadow-xl">
        <button 
          onClick={() => setView('inventory')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-colors ${view === 'inventory' ? 'text-mrf-primary' : 'text-gray-500'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Inventory</span>
        </button>
        <button 
          onClick={() => setView('logging')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-colors ${view === 'logging' ? 'text-mrf-primary' : 'text-gray-500'}`}
        >
          <ClipboardList size={20} />
          <span className="text-[10px] font-medium">Log</span>
        </button>
        <button 
          onClick={() => setView('marketplace')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-colors ${view === 'marketplace' ? 'text-mrf-primary' : 'text-gray-500'}`}
        >
          <ShoppingCart size={20} />
          <span className="text-[10px] font-medium">Market</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
