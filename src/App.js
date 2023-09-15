import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Protected from './components/Protected';
import { AuthContextProvider } from './context/AuthContext';

import Home from './pages/Home';
import Form from './pages/Form'
import Signin from './components/Signin';
import SignUp from './components/SignUp';
import Blog from './pages/Blog';
import ImageA from './pages/Images';
import PasswordReset from './components/RestPassword';
import ProfileUpdate from './pages/ProfileUpdate';
import AnimatedLogo from './pages/Animaton';
function App() {
  return (
    <div>   
      <AuthContextProvider>
        
        <Navbar/>
        <Routes>
          <Route path='/' element={<AnimatedLogo />}/>
          <Route path='/Home' element={<Home/>}/>
          <Route path='/Login' element={<Signin/>}/>
          <Route path='/Signup' element={<SignUp/>}/>
          <Route path='/PasswordReset' element={<PasswordReset/>}/>
          <Route path='/Form' element={<Protected><Form/></Protected>}/>
          <Route path='/Blog' element={<Protected><Blog/></Protected>}/>
          <Route path='/Image' element={<Protected><ImageA/></Protected>}/>
          <Route path='/Update' element={<Protected><ProfileUpdate/></Protected>}/>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
