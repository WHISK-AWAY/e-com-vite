import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts';
import SingleProduct from './components/SingleProduct';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Checkout from './components/Checkout';


function App() {
  return (
    <React.Fragment>

      <Navbar/>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/shop-all" element={<AllProducts />} />
      <Route path="/product/:productId" element={<SingleProduct />} />
      <Route path="/user/:userId" element={<UserProfile/>} />
      <Route path="/user/:userId/cart" element={<Cart/>} />
      <Route path="/checkout" element={<Checkout/>} />

    </Routes>
    </React.Fragment>
  );
}

export default App;
