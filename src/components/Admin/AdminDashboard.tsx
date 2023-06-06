import Inventory from './products/Inventory';
import { Link } from 'react-router-dom';
import CreateOrEditProduct from './products/CreateOrEditProduct';

export default function AdminDashboard() {
  return (
    <section className='admin-dashboard'>
      <h1>ADMIN DASHBOARD</h1>
      <br />
      <section className='inventory-section'>
        <Link to={'/admin/inventory'} >
          INVENTORY
       
        </Link>
        <br/>
        <Link to={'/admin/product/new'}>CREATE NEW PRODUCT</Link>
        {/* <Link to={'/admin/product/:productId'}>EDIT PRODUCT</Link> */}
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
        <h1>REPORTS</h1>
      </section>
    </section>
  );
}
