
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { query, orderBy, getDocs } from 'firebase/firestore';
import { addDoc, collection ,serverTimestamp} from 'firebase/firestore';
import { storage, database } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = UserAuth();
  const [data, setData] = useState([]);

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(database, 'posts'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        // Filter the items based on the search query
        const filteredItems = items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setData(filteredItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const uploadFile = () => {
    if (!imageUpload || !title || !content || !user) return;
    // Implement your file upload logic here
    // ...
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Blog
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <div className="App">
        <Button
          component="label"
          color="success"
          variant="outlined"
          href="#file-upload"
          startIcon={<AddPhotoAlternateIcon />}
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        >
          Upload Photo
          <VisuallyHiddenInput type="file" />
        </Button>
        <br />
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <TextField
          label="Content"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <br />
        <Button variant="contained" onClick={uploadFile}>
          Upload
        </Button>
      </div>
      {uploadSuccess && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          Image uploaded successfully!
        </div>
      )}
      <hr />
      <Container>
        <Typography variant="h4">Uploaded Data</Typography>
        {data.map((item) => (
          <Card key={item.id} style={{ margin: '10px 0' }}>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body1">{item.content}</Typography>
              <img src={item.imageUrl}alt='ok' style={{height:'350'}}/>       
            </CardContent>
          </Card>
        ))}
      </Container>
    </Container>
  );
};

export default Blog;



/*
import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !email || !image) {
        console.error('Name, email, and image are required fields');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('image', image);

      // Replace with your backend server URL for handling user uploads
      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('User data uploaded successfully');
    } catch (error) {
      console.error('Error uploading user data:', error);
    }
  };

  return (
    <div style={{padding:'20%'}}>
      <h2>Upload User Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;*/
/*

import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import phw from '../media/backg.jpeg';
import AnimatedLogo from '../pages/Logout';
import { Link } from 'react-router-dom';

import { Container, Typography, CircularProgress } from '@mui/material';
import '../pages/wel.css'; // Import your custom CSS file for styling

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (<> 
 { <AnimatedLogo/>} 
      <Container>
        {loading ? (
          <div>
              <Typography variant="h3" gutterBottom>
              Welcome, Visitor!
            </Typography>
          </div>
         
           
          
        ) : (
          
          <div className="message-container">
          
            <Typography variant="body1">
              Thank you for visiting our website. We're glad you're here!
            </Typography>
          </div>
        )}
      </Container>
    
  </>);
};

export default LandingPage;*/





/*import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !email || !image) {
        console.error('Name, email, and image are required fields');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('image', image);

      // Replace with your backend server URL for handling user uploads
      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('User data uploaded successfully');
    } catch (error) {
      console.error('Error uploading user data:', error);
    }
  };

  return (
    <div style={{padding:'20%'}}>
      <h2>Upload User Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
*/