import { Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts';
import SingleProduct from './components/SingleProduct';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/shop-all" element={<AllProducts />} />
      <Route path="/product/:productId" element={<SingleProduct />} />
      <Route path="/user/:userId" element={<UserProfile/>} />
      <Route path="/user/:userId/cart" element={<Cart/>} />

    </Routes>
  );
}

export default App;
