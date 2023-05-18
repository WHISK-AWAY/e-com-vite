import {Route, Routes} from 'react-router-dom';
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';
import Homepage from'./components/Homepage'
import AllProducts from './components/AllProducts';

function App() {
  return (
    <Routes>
      

    <Route path='/' element={<Homepage/>}/>
    <Route path='/sign_in' element={<SignIn/>}/>
    <Route path='/sign_up' element={<SignUp/>}/>
    <Route path='/shop-all' element={<AllProducts/>}/>
    </Routes>
  );
}

export default App;
