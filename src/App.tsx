import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts';
import SingleProduct from './components/singleProduct/SingleProduct';
import UserProfile from './components/UserAccount/UserProfile';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Checkout from './components/CheckoutProcess/Checkout';
import Favorite from './components/Favorite';
import Success from './components/CheckoutProcess/stripe/Success';
import Failure from './components/CheckoutProcess/stripe/Failure';
import Recap from './components/CheckoutProcess/Recap';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminReports from './components/Admin/Reports/AdminReports';
import AdminReviews from './components/Admin/AdminReviews';
import Inventory from './components/Admin/products/Inventory';
import CreateOrEditProduct from './components/Admin/products/CreateOrEditProduct';
import AdminUsers from './components/Admin/users/AdminUsers';
import AdminUserOrderHistory from './components/Admin/users/AdminUserOrderHistory';
import AdminOrderDetails from './components/Admin/users/AdminOrderDetails';
import TagInventory from './components/Admin/tags/TagInventory';
import CreateOrEditTag from './components/Admin/tags/CreateOrEditTag';
import PromoInventory from './components/Admin/promos/PromoInventory';
import CreateOrEditPromo from './components/Admin/promos/CreateOrEditPromo';

function App() {
  return (
    <div className='text-charcoal'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/shop-all' element={<AllProducts />} />
        <Route
          path='/shop-all/bestsellers'
          element={<AllProducts sortKey='saleCount' />}
        />
        <Route path='/product/:productId' element={<SingleProduct />} />
        <Route path='/user/:userId' element={<UserProfile />} />
        <Route path='/user/:userId/cart' element={<Cart />} />
        <Route path='/user/:userId/favorites' element={<Favorite />} />
        <Route path='/checkout' element={<Recap />} />
        <Route path='/checkout/success' element={<Success />} />
        <Route path='/checkout/failure' element={<Failure />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/reports' element={<AdminReports />} />
        <Route path='/admin/reviews' element={<AdminReviews />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route
          path='/admin/users/:userId/orders'
          element={<AdminUserOrderHistory />}
        />
        <Route
          path='/admin/users/:userId/order/:orderId/details'
          element={<AdminOrderDetails />}
        />
        <Route path='/admin/inventory' element={<Inventory />} />
        <Route path='/admin/tags' element={<TagInventory />} />
        <Route path='/admin/tags/new' element={<CreateOrEditTag />} />
        <Route path='/admin/tags/:tagId' element={<CreateOrEditTag />} />
        <Route path='/admin/product/new' element={<CreateOrEditProduct />} />
        <Route
          path='/admin/product/:productId'
          element={<CreateOrEditProduct />}
        />
        <Route path='/admin/promos' element={<PromoInventory />} />
        <Route path='/admin/promos/new' element={<CreateOrEditPromo />} />
        <Route path='/admin/promos/:promoId' element={<CreateOrEditPromo />} />
      </Routes>
    </div>
  );
}

export default App;
