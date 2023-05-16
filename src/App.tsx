import {Route, Routes} from 'react-router-dom';
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';

function App() {
  return (
    <Routes>
      

    <Route path='/sign_in' element={<SignIn/>}/>
    <Route path='/sign_up' element={<SignUp/>}/>
    </Routes>
  );
}

export default App;
