import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts';
import SingleProduct from './components/SingleProduct';
import UserProfile from './components/UserAccount/UserProfile';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Checkout from './components/CheckoutProcess/Checkout';
import Favorite from './components/Favorite';
import Success from './components/CheckoutProcess/stripe/Success';
import Failure from './components/CheckoutProcess/stripe/Failure';
import Recap from './components/CheckoutProcess/Recap';
import AdminDashboard from './components/Admin/AdminDashboard';
import Inventory from './components/Admin/products/Inventory';
import CreateOrEditProduct from './components/Admin/products/CreateOrEditProduct';
import TagInventory from './components/Admin/tags/TagInventory';
import CreateOrEditTag from './components/Admin/tags/CreateOrEditTag';

function App() {
  return (
    <React.Fragment>
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
        <Route path='/admin/inventory' element={<Inventory />} />
        <Route path='/admin/tags' element={<TagInventory />} />
        <Route path='/admin/tags/new' element={<CreateOrEditTag />} />
        <Route path='/admin/tags/:tagId' element={<CreateOrEditTag />} />
        <Route path='/admin/product/new' element={<CreateOrEditProduct />} />
        <Route
          path='/admin/product/:productId'
          element={<CreateOrEditProduct />}
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
