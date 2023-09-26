import React, { useEffect, useState, Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import Homepage from './components/Homepage';
import AllProducts from './components/AllProducts/AllProducts.tsx';
import SingleProduct from './components/singleProduct/SingleProduct';
import Navbar from './components/navbar/Navbar.tsx';
import NewIn from './components/NewIn/NewIn';
import Footer from './components/Footer';

const AdminDashboard = React.lazy(
  () => import('./components/Admin/AdminDashboard')
);
const AdminReports = React.lazy(
  () => import('./components/Admin/Reports/AdminReports')
);
const AdminReviews = React.lazy(
  () => import('./components/Admin/AdminReviews')
);
const Inventory = React.lazy(
  () => import('./components/Admin/products/Inventory')
);
const CreateOrEditProduct = React.lazy(
  () => import('./components/Admin/products/CreateOrEditProduct')
);
const AdminUsers = React.lazy(
  () => import('./components/Admin/users/AdminUsers')
);
const AdminUserOrderHistory = React.lazy(
  () => import('./components/Admin/users/AdminUserOrderHistory')
);
const AdminOrderDetails = React.lazy(
  () => import('./components/Admin/users/AdminOrderDetails')
);
const TagInventory = React.lazy(
  () => import('./components/Admin/tags/TagInventory')
);
const CreateOrEditTag = React.lazy(
  () => import('./components/Admin/tags/CreateOrEditTag')
);
const PromoInventory = React.lazy(
  () => import('./components/Admin/promos/PromoInventory')
);
const CreateOrEditPromo = React.lazy(
  () => import('./components/Admin/promos/CreateOrEditPromo')
);
const Success = React.lazy(
  () => import('./components/CheckoutProcess/stripe/Success')
);
const Recap = React.lazy(() => import('./components/CheckoutProcess/Recap'));
const UserProfile = React.lazy(
  () => import('./components/UserAccount/UserProfile')
);

import '../src/index.css';
import TransitionScreen from './components/UI/TransitionScreen.tsx';

function App() {
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isSignFormHidden, setIsSignFormHidden] = useState(true);
  const [isCartFavWrapperHidden, setIsCartFavWrapperHidden] = useState(true);
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const [isSearchHidden, setIsSearchHidden] = useState(true);

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

  useEffect(() => {
    const checkDimensions = () => {
      // const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      if (window.innerWidth < 650 || window.innerHeight < 450) {
        setMobileMenu(true);
      } else {
        setMobileMenu(false);
      }
    };

    window.addEventListener('resize', checkDimensions);
    checkDimensions();

    return () => {
      window.removeEventListener('resize', checkDimensions);
    };
  }, []);

  const element = useRoutes([
    {
      path: '/',
      element: <Homepage mobileMenu={mobileMenu} />,
    },
    {
      path: '/shop-all',
      element: <AllProducts mobileMenu={mobileMenu} />,
    },
    {
      path: '/shop-all/bestsellers',
      element: (
        <AllProducts
          mobileMenu={mobileMenu}
          sortKey="saleCount"
        />
      ),
    },
    {
      path: '/new-in',
      element: <NewIn />,
    },
    {
      path: 'product/:productId',
      element: (
        <SingleProduct
          mobileMenu={mobileMenu}
          isCartFavWrapperHidden={isCartFavWrapperHidden}
          isSearchHidden={isSearchHidden}
          isMenuHidden={isMenuHidden}
          isSignFormHidden={isSignFormHidden}
        />
      ),
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
      element: <Success mobileMenu={mobileMenu} />,
    },
    {
      path: '/admin',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: '/admin/reports',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminReports />
        </Suspense>
      ),
    },
    {
      path: '/admin/reviews',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminReviews />
        </Suspense>
      ),
    },
    {
      path: '/admin/users',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminUsers />
        </Suspense>
      ),
    },
    {
      path: '/admin/users/:userId/orders',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminUserOrderHistory />
        </Suspense>
      ),
    },
    {
      path: '/admin/users/:userId/order/:orderId/details',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <AdminOrderDetails />
        </Suspense>
      ),
    },
    {
      path: '/admin/inventory',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <Inventory />
        </Suspense>
      ),
    },
    {
      path: '/admin/tags',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <TagInventory />
        </Suspense>
      ),
    },
    {
      path: '/admin/tags/new',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditTag />
        </Suspense>
      ),
    },
    {
      path: '/admin/tags/:tagId',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditTag />
        </Suspense>
      ),
    },
    {
      path: '/admin/product/new',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditProduct />
        </Suspense>
      ),
    },
    {
      path: '/admin/product/:productId',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditProduct />
        </Suspense>
      ),
    },
    {
      path: '/admin/promos',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <PromoInventory />
        </Suspense>
      ),
    },
    {
      path: '/admin/promos/new',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditPromo />
        </Suspense>
      ),
    },
    {
      path: '/admin/promos/:promoId',
      element: (
        <Suspense fallback={<h1>Loading...</h1>}>
          <CreateOrEditPromo />
        </Suspense>
      ),
    },
  ]);

  if (!element) return <main>Route location not found...</main>;

  return (
    <div
      data-lenis-prevent
      className="data-scroll-container mx-auto min-h-screen text-charcoal"
    >
      <Navbar
        key="navbar"
        setIsSearchHidden={setIsSearchHidden}
        isSearchHidden={isSearchHidden}
        setIsCartFavWrapperHidden={setIsCartFavWrapperHidden}
        isCartFavWrapperHidden={isCartFavWrapperHidden}
        setIsSignFormHidden={setIsSignFormHidden}
        isSignFormHidden={isSignFormHidden}
        setIsMenuHidden={setIsMenuHidden}
        isMenuHidden={isMenuHidden}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />
      <AnimatePresence
        mode="wait"
        initial={true}
      >
        <div key={location.pathname}>
          <TransitionScreen />
          {element}
        </div>
      </AnimatePresence>
      <Footer
        key="footer"
        mobileMenu={mobileMenu}
      />
    </div>
  );
}

export default App;
