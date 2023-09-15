import React, { useState,useEffect } from 'react';
import { TextField, Button, Container, Typography,Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { query, where, getDocs ,deleteDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection ,serverTimestamp,orderBy} from 'firebase/firestore';
import { storage, database } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const Blog = () => {
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



  const uploadFile = () => {
    if (!imageUpload || !title || !content || !user) return; 
    const imageRef = ref(storage, `images/${imageUpload.name}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            addDoc(collection(database, 'posts'), {
              userId: user.uid,
              title,
              content,
              imageUrl: url,
              authorEmail: user.email,
              authorName: user.displayName,
              timestamp: serverTimestamp(),
            })
              .then(() => {
                console.log('Data added to Firestore');
                setUploadSuccess(true);
              })
              .catch((error) => {
                console.error('Error adding data to Firestore', error);
                setUploadSuccess(false);
              });
          })
          .catch((error) => {
            console.error(error);
            setUploadSuccess(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setUploadSuccess(false);
      });
  };

  const styles = {
    container: {      
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      marginTop:'80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'red',
      fontSize: '21px',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(database, 'posts'),
          orderBy('timestamp', 'desc') // Sort posts by timestamp in descending order
        );
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  
  return (
    <>
      <Container maxWidth="xl" style={styles.container}>
      <Container maxWidth='sm' style={{ display: 'grid',border:'1px solid blue',gap:10 ,padding:'20px'}}>
        <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
           <TextField
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
      component="label"
      color='success'
      variant="outlined"     
      href="#file-upload"
      startIcon={<AddPhotoAlternateIcon />}
      type="file"
      onChange={(event) => {
        setImageUpload(event.target.files[0]);
      }}
    >
     <Typography textTransform='lowercase'>upload photo </Typography>
      <VisuallyHiddenInput type="file" />
    </Button>
        
          <Button variant="contained" onClick={uploadFile}>
            Upload
          </Button>
        </Container>
        {uploadSuccess && (
          <Typography style={{ color: 'green',position:'absolute' }}>
            posted  successfully!
          </Typography>
        )}
      </Container>
      <Container>
      <Typography variant="h4">Uploaded Data</Typography>
      {data.map((item) => (
        <Card key={item.id} style={{ margin: '10px 0' }}>
          <CardContent>        
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body1">{item.content}</Typography>
            <img src={item.imageUrl}alt='ok' style={{height:'350'}}/>       
            <Typography variant="caption">User Name {item.authorName}</Typography>&nbsp;
            <Typography variant="caption">User Email {item.authorEmail}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>

    </>
  );
};

export default Blog;









/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth, upload } from "../firebase";

const Blog = () => {
const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/img')
      .then((response) => {
        setUsers(response.data);
        console.log(response)
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);
  const handleDeleteUser = (userId) => {    
    axios.delete(`http://localhost:4000/requests/${userId}`)
      .then(() => {        
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }
  return (<>
  
    <div style={{padding:'20%'}}>
   <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
             <strong>Id:</strong> {user._id}<br/><br/>
             <strong>Id:</strong> {user.id}<br/>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            <div>
            <strong>Image:</strong> <img src={user.image.dataUrl} alt={user.name} width="200" />
            </div>
          </li>
        ))}
      </ul>
    </div>  
  </>);
};

export default Blog;*/


/*import { getDatabase ,ref, set } from "firebase/database";

import React, { useEffect, useState } from 'react';
import Scroll from './Scroll';
import axios from 'axios';
import { Container, Typography ,Button,TextField} from '@mui/material';
import { ImageList } from '@mui/material';


const Blog = () => {

  
  const styles = {
    container: {
     
      width: '100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight:'1.7'
      

    },
  };
  const [userData, setUserData] = useState({
    name:'',
    email:'',
    image:'',
  })
let name,value;
const subData = (event) =>{
name = event.target.name;
value = event.target.value;
setUserData({
  ...userData,[name]: value
});

};

const formSub = async (event) =>{
  event.preventDefault();
const{ name,email, image} = userData;
 const res = fetch('https://evolution-x-a2881-default-rtdb.firebaseio.com/formData.json',{
  method:"POST",
  headers:{
    'Containt-Type' : 'application/json',
  },
  body:JSON.stringify({
    name,
    email,
    image,
  }),

 })
 if (res){
  alert("ok done")
 }else{alert("not done")
 }
}
  return (<>
<div style={{padding:'20%',background:'pink',height:'685px'}}>
    <form>
      <TextField
type="text"
label='name'
name="name"
value={userData.name}
onChange={subData}
/><br/> <br/>
<TextField
type="text"
name="email"
label='email'
value={userData.email}
onChange={subData}
/><br/><br/>
<input
type="file"
name="image"
label="image"
value={userData.image}
onChange={subData}
/><br/><br/>
<Button onClick={formSub} variant='contained' type="submit">POST</Button></form> 
<br/><br/>
<div style={{background:'gray',float:'right',width:'400px',height:'400px',marginTop:'-50%'}}>Cool`





</div>
  </div>

   </>);
};

export default Blog; */