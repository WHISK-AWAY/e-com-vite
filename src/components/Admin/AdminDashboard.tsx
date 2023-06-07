import { Link } from 'react-router-dom';


export default function AdminDashboard() {
  return (
    <section className='admin-dashboard'>
      <h1>ADMIN DASHBOARD</h1>
      <br />
      <section className='inventory-section'>
        <Link to={'/admin/inventory'} className='text-blue-300'>
          INVENTORY
        </Link>
        <br />
        <Link to={'/admin/product/new'} className='text-blue-600'>
          CREATE NEW PRODUCT
        </Link>
        {/* <Link to={'/admin/product/:productId'}>EDIT PRODUCT</Link> */}
      </section>
      <section className='tag-section'>
        <Link to={'/admin/tags'} className='text-blue-300'>
          <h1>TAGS</h1>
          <Link to={'/admin/tags/new'} className='text-blue-600'>
            CREATE NEW TAG
          </Link>
        </Link>
      </section>
      <section className='user-section'>
        <h1>USERS</h1>
      </section>
      <section className='review-section'>
        <h1>REVIEWS</h1>
      </section>
      <section className='reporting-section'>
        <h1>REPORTS</h1>
      </section>
    </section>
  );
}
