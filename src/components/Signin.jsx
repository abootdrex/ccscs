import React, { useEffect, useState } from 'react';
import { GoogleButton } from 'react-google-button';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, CssBaseline ,InputAdornment, InputLabel, OutlinedInput,IconButton, } from '@mui/material';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';


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
    borderRadius: '1vh',
    border: '1px solid blue'
  },
};


const Signin = () => {
  const { signInWithEmailAndPassword, auth, error } = UserAuth();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingForgotPassword, setIsLoadingForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    try {
      await signInWithEmailAndPassword(email, password);

      if (!email.trim()) {
        setEmailError('Please enter your email.');
        return;
      }

      if (!password.trim()) {
        setPasswordError('Please enter your password.');
        return;
      }

    } catch (error) {
      console.error('Login error:', error.message);

      if (error.code === 'auth/user-not-found') {
        setLoginError('Email not registered.');
      } else if (error === 'auth/wrong-password') {
        setLoginError('Incorrect password.');
      } else {
        setLoginError('Login failed. Please try again later.');
      }
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate('/');
    }
  }, [user]);

  const handleForgotPasswordClick = () => {
    setIsLoadingForgotPassword(true);

    setTimeout(() => {
      setIsLoadingForgotPassword(false);
     navigate('/PasswordReset');
     window.location.reload();
    }, 3000); 
  };

  const handleSignupL = () => {
    setIsLoadingForgotPassword(true);

    setTimeout(() => {
       
      setIsLoadingForgotPassword(false);
     navigate('/Signup');
  
    }, 3000); 
    
  };




  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('Password did not match');
    }
  };


  return (<>
    <Container maxWidth="xl" style={styles.container}>
      <CssBaseline />
      <Container maxWidth="sm" style={styles.formContainer}>
        <form onSubmit={handleLogin}>
          <Typography variant='h3' alignSelf="center">Sign in</Typography>
          <Typography>Sign in using your Yahoo account</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            type="email"
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          /><br /><InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput 
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChangePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            error={!!passwordError}
            helperText={passwordError}
          />
         {/*  <TextField
            type="password"
            label="Password"
            margin="normal"
            variant="outlined"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />*/}<br /><br/>
          <Button variant='contained' type="submit">Log in</Button>
          &nbsp; &nbsp;
          <Link to ="" onClick={handleForgotPasswordClick}
            style={{ cursor: 'pointer', color: 'blue' }}
            disabled={isLoadingForgotPassword}
          >
            {isLoadingForgotPassword ? '' : 'Forgot Password?'}
          </Link>

          <Typography style={{ padding: '20px', textAlign: 'center' }}>OR</Typography>
          &nbsp; &nbsp;
          <Link to ="" onClick={handleSignupL}
            style={{ cursor: 'pointer', color: 'blue' }}
            disabled={isLoadingForgotPassword} 
          >
            {isLoadingForgotPassword ? '' : 'Sign Up?'}
          </Link>
          <GoogleButton style={styles.googleButton} onClick={handleGoogleSignIn} />

        </form>
      </Container>
    </Container>
  </>);
};

export default Signin;



