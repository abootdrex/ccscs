import { TextField, Button, Container, Typography , CssBaseline} from '@mui/material';
import { createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import { UserAuth } from '../context/AuthContext';

import React, { useState ,useEffect} from "react";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';

const styles = {
  container: {
    display: 'flex',
    background: 'url(https://c4.wallpaperflare.com/wallpaper/450/780/877/pattern-rectangular-cube-digital-art-wallpaper-preview.jpg)',
    backgroundSize: 'cover',
    flexDirection: 'column',
    alignItems: 'center',    
    justifyContent: 'center',
    minHeight: '100vh',
  },
  formContainer: {
    
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  googleButton: {
    marginTop: '1rem',
   
    border:'1px solid blue'
  },
};

const SignUp = () => {
  const { googleSignIn, signInWithEmailAndPassword, user } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhonNumber] = useState(''); // Add mobile number state
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);

  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, {
        displayName: username,
        phoneNumber: phoneNumber, 
      });

      console.log(newUser);

      
      setEmail('');
      setPassword('');
      setUsername('');
      setPhonNumber('');
    

      navigate('/Profile');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/Signup');


    }
  }, [user]);
  

  return (
    <Container maxWidth="xl" style={styles.container}>
      <CssBaseline />
      <Container maxWidth="sm" style={styles.formContainer}>
        <form onSubmit={signUp}>
        <Typography variant="h5" style={{display:'flex'}}>
      Join us &nbsp;<Typography variant="overline">here</Typography>
    </Typography>
          <TextField
            type="text"
            label="User Name"
            margin="normal"
            variant="outlined"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /><br />
          <TextField
            type="email"
            label="Email"
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <TextField
            type="password"
            label="Password"
            margin="normal"
            variant="outlined"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <TextField
            type="tel"
            label="Mobile Number"
            margin="normal"
            variant="outlined"
            placeholder="Enter your mobile number"
            value={phoneNumber}
            onChange={(e) => setPhonNumber(e.target.value)}
          /><br />
          {/* Add profile photo upload input */}
          <br />
          <Button style={styles.googleButton} variant="contained" type="submit">
            Sign Up
          </Button>
        </form>
      </Container>
    </Container>
  );
};

export default SignUp;

/*
const Signup = () => {

  const { googleSignIn, signInWithEmailAndPassword, user } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Set the username as the display name
      await user.updateProfile({
        displayName: username,
      });

      // User signed up successfully
      console.log('User signed up successfully with display name:', user.displayName);

      // Clear the form fields
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      // Handle signup error
      console.error('Signup error:', error.message);
    }
  };

  return (
    <div style={{marginTop:'10%',padding:'26%'}}>
      <h2>Sign Up</h2>
      <Container>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form></Container>
    </div>
  );
};

export default Signup;*/
/*
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    float:'left',
  },
  formContainer: {
    
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  googleButton: {
    marginTop: '1rem',
   
    border:'1px solid blue'
  },
};

const SignUp = () => {
  const { googleSignIn, signInWithEmailAndPassword, user } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;

        user.updateProfile({
          displayName: username});
        
        console.log(userCredential);


      })
      
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (user != null) {
      navigate('/account');
    }
  }, [user]);
  return (
    <Container maxWidth="xl" style={styles.container}>
      <CssBaseline/>
      <Container maxWidth="sm" style={styles.formContainer}>
      <form onSubmit={signUp}>
        <Typography variant='h3'>Create Account</Typography>
        <TextField
          type="text"
          label="User Name"
            margin="normal"
            variant="outlined"
          placeholder="Enter your name"
          value={user}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <TextField
          type="email"
          label="Email"
            margin="normal"
            variant="outlined"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <TextField
          type="password"
          label="Password"
            margin="normal"
            variant="outlined"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <Button style={styles.googleButton} variant='contained' type="submit">Sign Up</Button>
      </form>
      </Container>
    </Container>
  );
};

export default SignUp;*/