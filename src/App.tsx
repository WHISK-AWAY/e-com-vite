import React from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts/AllProducts';
import SingleProduct from './components/singleProduct/SingleProduct';
import UserProfile from './components/UserAccount/UserProfile';
import Navbar from './components/navbar/Navbar';
import Success from './components/CheckoutProcess/stripe/Success';
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
import Featured from './components/Featured/Featured';
import NewIn from './components/NewIn/NewIn';
import Footer from './components/Footer';
import Lenis from '@studio-freight/lenis';
import '../src/index.css';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const lenis = new Lenis({
    duration: 2.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    lerp: 0,
  });

  lenis.on('scroll', ScrollTrigger.update);

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  requestAnimationFrame(raf);

  const element = useRoutes([
    {
      path: '/',
      element: <Homepage />,
    },
    {
      path: '/shop-all',
      element: <AllProducts />,
    },
    {
      path: '/shop-all/bestsellers',
      element: <AllProducts sortKey='saleCount' />,
    },
    {
      path: '/featured',
      element: <Featured />,
    },
    {
      path: '/new-in',
      element: <NewIn />,
    },
    {
      path: 'product/:productId',
      element: <SingleProduct />,
    },
    {
      path: 'user/:userId',
      element: <UserProfile />,
    },
    {
      path: 'checkout',
      element: <Recap />,
    },
    {
      path: '/checkout/success',
      element: <Success />,
    },
    {
      path: '/admin',
      element: <AdminDashboard />,
    },
    {
      path: '/admin/reports',
      element: <AdminReports />,
    },
    {
      path: '/admin/reviews',
      element: <AdminReviews />,
    },
    {
      path: '/admin/users',
      element: <AdminUsers />,
    },
    {
      path: '/admin/users/:userId/orders',
      element: <AdminUserOrderHistory />,
    },
    {
      path: '/admin/users/:userId/order/:orderId/details',
      element: <AdminOrderDetails />,
    },
    {
      path: '/admin/inventory',
      element: <Inventory />,
    },
    {
      path: '/admin/tags',
      element: <TagInventory />,
    },
    {
      path: '/admin/tags/new',
      element: <CreateOrEditTag />,
    },
    {
      path: '/admin/tags/:tagId',
      element: <CreateOrEditTag />,
    },
    {
      path: '/admin/product/new',
      element: <CreateOrEditProduct />,
    },
    {
      path: '/admin/product/:productId',
      element: <CreateOrEditProduct />,
    },
    {
      path: '/admin/promos',
      element: <PromoInventory />,
    },
    {
      path: '/admin/promos/new',
      element: <CreateOrEditPromo />,
    },
    {
      path: '/admin/promos/:promoId',
      element: <CreateOrEditPromo />,
    },
  ]);

  if (!element) return <main>Route location not found...</main>;

  return (
    <div
      data-lenis-prevent
      className='data-scroll-container mx-auto min-h-screen text-charcoal'
    >
      <AnimatePresence mode='wait' initial={false}>
        <Navbar key='navbar' />
        {React.cloneElement(element, { key: location.pathname }, element)}
        <Footer key='footer' />
      </AnimatePresence>
    </div>
  );
}

export default App;
