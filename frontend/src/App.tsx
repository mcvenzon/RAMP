import { useState } from 'react';
import {
  Activity, BadgeCheck, Bell, ChevronDown, HelpCircle, Command, LayoutDashboard, LogOut,
  Menu, Package, Recycle, Search, ShoppingBag, Truck, Users, X,
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import type { UserRole } from './contexts/AuthContext';
import Login from './views/Login';
import InventoryDashboard from './views/InventoryDashboard';
import MarketplaceDashboard from './views/MarketplaceDashboard';
import LogMaterialForm from './views/LogMaterialView';
import Overview from './views/Overview';
import TeamManagement from './views/TeamManagement';

export type AppView = 'overview' | 'inventory' | 'marketplace' | 'intake' | 'analytics' | 'team';
type NavigationItem = { id: AppView; label: string; icon: typeof LayoutDashboard; group?: string };

const roleNavigation: Record<UserRole, NavigationItem[]> = {
  MANAGER: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'intake', label: 'Waste intake', icon: Recycle, group: 'Operations' },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'team', label: 'Collectors', icon: Users, group: 'Administration' },
  ],
  BUYER: [{ id: 'marketplace', label: 'Marketplace', icon: ShoppingBag }],
  COLLECTOR: [{ id: 'intake', label: 'Log intake', icon: Recycle }],
};

const roleTitles: Record<UserRole, string> = {
  MANAGER: 'Facility manager',
  BUYER: 'Materials buyer',
  COLLECTOR: 'Field collector',
};

const roleDescriptions: Record<UserRole, string> = {
  MANAGER: 'Monitor facility operations, inventory, and sales.',
  BUYER: 'Find verified materials and manage your purchasing activity.',
  COLLECTOR: 'Record incoming materials from the field.',
};

function App() {
  const { user, role: authenticatedRole, loading, signOut } = useAuth();
  const [view, setView] = useState<AppView>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (loading) {
    return <div className="startup-screen"><span className="brand-mark"><Recycle size={22} /></span><span className="startup-loader" />Loading RAMP</div>;
  }

  if (!user && !(import.meta.env.DEV && previewMode)) return <Login onPreviewDemo={() => setPreviewMode(true)} />;

  const role: UserRole = previewMode ? 'MANAGER' : authenticatedRole ?? 'BUYER';

  const navigation = roleNavigation[role];
  const defaultView = navigation[0].id;
  const activeView = navigation.some((item) => item.id === view) ? view : defaultView;
  const pageTitle = navigation.find((item) => item.id === activeView)?.label ?? navigation[0].label;
  const email = user?.email ?? 'preview@ramp.local';
  const initials = email.slice(0, 1).toUpperCase();
  const facilityName = String(user?.app_metadata?.facility_name ?? user?.user_metadata?.facility_name ?? 'San Mateo MRF');
  const handleSignOut = async () => { if (previewMode) { setPreviewMode(false); return; } await signOut(); };
  const goTo = (nextView: AppView) => {
    if (navigation.some((item) => item.id === nextView)) setView(nextView);
  };
  const content = () => {
    switch (activeView) {
      case 'inventory': return <InventoryDashboard onNavigate={goTo} />;
      case 'marketplace': return <MarketplaceDashboard />;
      case 'intake': return <LogMaterialForm collectorOnly={role === 'COLLECTOR'} onSuccess={() => goTo(role === 'MANAGER' ? 'inventory' : 'intake')} />;
      case 'analytics': return <Overview analyticsOnly onNavigate={goTo} />;
      case 'team': return <TeamManagement />;
      default: return <Overview onNavigate={goTo} />;
    }
  };

  const renderNavigation = (mobile = false) => (
    <nav className={mobile ? 'mobile-nav-list' : 'sidebar-nav'} aria-label={`${roleTitles[role]} navigation`}>
      {navigation.map(({ id, label, icon: Icon, group }, index) => (
        <div key={id}>
          {group && (!mobile || index > 0) && <p className="nav-group-label">{group}</p>}
          <button type="button" className={`nav-link ${activeView === id ? 'active' : ''}`} aria-label={label} aria-current={activeView === id ? 'page' : undefined} onClick={() => { goTo(id); setMobileMenuOpen(false); }}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {id === 'intake' && role === 'MANAGER' && <span className="nav-link-dot" aria-label="New" />}
          </button>
        </div>
      ))}
    </nav>
  );

  return (
    <div className={`app-shell role-${role.toLowerCase()}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="sidebar">
        <button className="brand-lockup" type="button" onClick={() => goTo(defaultView)} aria-label="RAMP home">
          <span className="brand-mark"><Recycle size={21} strokeWidth={2.4} /></span>
          <span><strong>RAMP</strong><small>Resource Asset Management</small></span>
        </button>
        {role !== 'BUYER' && <div className="facility-switcher"><span className="facility-avatar">{facilityName.slice(0, 2).toUpperCase()}</span><span className="facility-copy"><strong>{facilityName}</strong><small>{roleTitles[role]} workspace</small></span>{role === 'MANAGER' && <ChevronDown size={15} />}</div>}
        {role === 'BUYER' && <div className="role-sidebar-card"><span className="role-card-icon"><ShoppingBag size={17} /></span><strong>Buyer workspace</strong><small>Verified materials from recovery facilities</small></div>}
        {renderNavigation()}
        <div className="sidebar-bottom">
          {role === 'MANAGER' && <><div className="sidebar-help"><span className="help-icon"><HelpCircle size={17} /></span><span><strong>Need a hand?</strong><small>Visit the help center</small></span></div><button className="sidebar-cta" type="button" onClick={() => goTo('marketplace')}><ShoppingBag size={17} /> Explore marketplace</button></>}
          {role === 'BUYER' && <div className="sidebar-help"><span className="help-icon"><BadgeCheck size={17} /></span><span><strong>Verified network</strong><small>Facility listings are reviewed</small></span></div>}
          {role === 'COLLECTOR' && <div className="sidebar-help"><span className="help-icon"><Truck size={17} /></span><span><strong>Field operations</strong><small>Intake entry syncs to your facility</small></span></div>}
          <div className="sidebar-user"><span className="user-avatar">{initials}</span><span className="user-copy"><strong>{email.split('@')[0] || 'RAMP User'}</strong><small>{previewMode ? 'Preview workspace' : roleTitles[role]}</small></span><button type="button" className="icon-button user-menu-button" onClick={() => void handleSignOut()} aria-label="Sign out"><LogOut size={17} /></button></div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>{role === 'MANAGER' ? facilityName : roleTitles[role]}</span><span className="breadcrumb-divider">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={17} /><input aria-label="Search RAMP" placeholder={role === 'COLLECTOR' ? 'Search materials' : 'Search anything'} /><kbd><Command size={11} /> K</kbd></label>
            <button type="button" className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <div className="topbar-divider" />
            <button type="button" className="topbar-profile" onClick={() => setAccountMenuOpen(!accountMenuOpen)} aria-expanded={accountMenuOpen} aria-haspopup="menu"><span className="user-avatar">{initials}</span><span className="profile-label">{previewMode ? 'Preview mode' : email.split('@')[0]}</span><ChevronDown size={15} /></button>
            {accountMenuOpen && <div className="account-menu" role="menu"><div className="account-menu-info"><strong>{email.split('@')[0] || 'RAMP User'}</strong><small>{previewMode ? 'Local preview · no account signed in' : `${roleTitles[role]} · ${email}`}</small></div><button type="button" role="menuitem" onClick={() => void handleSignOut()}><LogOut size={15} /> {previewMode ? 'Exit preview' : 'Sign out'}</button></div>}
          </div>
        </header>
        <main className="page-content" id="main-content">
          <div className="role-context"><span className="role-context-mark">{role === 'BUYER' ? <ShoppingBag size={17} /> : role === 'COLLECTOR' ? <Truck size={17} /> : <LayoutDashboard size={17} />}</span><div><strong>{roleTitles[role]} workspace</strong><span>{roleDescriptions[role]}</span></div><span className="role-context-tag">{role}</span></div>
          {content()}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Quick navigation">{navigation.slice(0, 4).map(({ id, label, icon: Icon }) => <button key={id} type="button" className={activeView === id ? 'active' : ''} onClick={() => goTo(id)} aria-current={activeView === id ? 'page' : undefined}><Icon size={19} /><span>{role === 'BUYER' ? 'Market' : role === 'COLLECTOR' ? 'Intake' : id === 'marketplace' ? 'Market' : id === 'intake' ? 'Intake' : label}</span></button>)}</nav>

      {mobileMenuOpen && <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} role="presentation"><aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><strong>{roleTitles[role]} menu</strong><button type="button" className="icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={19} /></button></div>{renderNavigation(true)}{role !== 'BUYER' && <div className="drawer-facility"><Truck size={17} /> {facilityName}</div>}</aside></div>}
    </div>
  );
}

export default App;
