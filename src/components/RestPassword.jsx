/*import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { TextField, Button, Container, Typography, CssBaseline } from '@mui/material';


const styles = {
  container: {
    display: 'flex',
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
  button: {
    marginTop: '1rem',
  },
};


const auth = getAuth();

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
  };

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage('Password reset email sent! Check your inbox.');
        
        setError('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`Password reset failed: ${errorMessage}`);
        setMessage('');
      });
       if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }
  };

  return (
    <Container maxWidth="xl" style={styles.container}>
    <CssBaseline />
    <Container maxWidth="sm" style={styles.formContainer}>

        <Typography variant="h2">Password Reset</Typography>
        <Typography variant="h6">Please enter your valid email address</Typography>
        
          <TextField
            type="email"
            label="Email"
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
      
          <Button variant="contained" onClick={handleResetPassword} style={styles.button}>
            Reset Password
          </Button>
        
        {message && <Typography color="textSecondary">{message}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
     
    </Container>
  </Container>
  );
}

export default PasswordReset;
*/

import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { TextField, Button, Container, Typography, CssBaseline } from '@mui/material';

const styles = {
    container: {
      background: 'url(https://c4.wallpaperflare.com/wallpaper/450/780/877/pattern-rectangular-cube-digital-art-wallpaper-preview.jpg)',
      backgroundSize: 'cover',
    display: 'flex',
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
  button: {
    marginTop: '1rem',
    
  },
};

const auth = getAuth();

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(''); // Clear email error when user starts typing
  };

  const handleResetPassword = () => {
    setEmailError(''); // Clear any previous email error
    setError('');

    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage('Password reset email sent! Check your inbox.');
        setError('');
        setEmail(''); // Clear the email field
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(`Password reset failed: ${errorMessage}`);
        setMessage('');
      });
  };

  return (
    <Container maxWidth="xl" style={styles.container}>
      <CssBaseline />
      <Container maxWidth="sm" style={styles.formContainer}>
        <Typography variant="h2">Password Reset</Typography>
        <Typography variant="h6">Please enter your valid email address</Typography>
        <TextField
          type="email"
          label="Email"
          margin="normal"
          variant="outlined"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
        />
        <Button variant="outlined" color='info' onClick={handleResetPassword} style={styles.button}>
          Reset Password
        </Button> <br/><br/>
        {message && <Typography color="green">{message}</Typography>}
       
        {error && <Typography color="error">{error}</Typography>}
      </Container>
    </Container>
  );
}

export default PasswordReset;
