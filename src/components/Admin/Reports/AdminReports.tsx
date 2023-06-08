import { useState } from 'react';
import SalesByProduct from './SalesByProduct';

export type AdminReports = 'salesByProduct' | null;

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState<AdminReports>(null);

  return (
    <div className='admin-reports-page flex h-screen'>
      <nav className='admin-reports-nav h-screen bg-slate-500'>
        <h1>ADMIN REPORTS</h1>
        <button onClick={() => setActiveReport('salesByProduct')}>Sales</button>
        <h2>Inventory</h2>
      </nav>
      <main className='admin-reports-main'>
        {!activeReport && <h1>Please select a report from the menu...</h1>}
        {activeReport === 'salesByProduct' && <SalesByProduct />}
      </main>
    </div>
  );
}
