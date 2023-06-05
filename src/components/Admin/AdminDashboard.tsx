import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <section className='admin-dashboard'>
      <h1>ADMIN DASHBOARD</h1>
      <br />
      <section className='inventory-section'>
        <h1>INVENTORY</h1>
      </section>
      <section className='tag-section'>
        <h1>TAGS</h1>
      </section>
      <section className='user-section'>
        <h1>USERS</h1>
      </section>
      <section className='review-section'>
        <h1>REVIEWS</h1>
      </section>
      <section className='reporting-section'>
        <Link to='/admin/reports'>
          <h2>REPORTS</h2>
        </Link>
      </section>
    </section>
  );
}
