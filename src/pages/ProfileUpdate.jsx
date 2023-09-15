import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography,Card, CardContent ,CssBaseline } from '@mui/material';
import { UserAuth } from '../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Avatar from '@mui/material/Avatar';
import { useAuth, upload } from "../firebase";
import { CircularProgress } from '@mui/material'; // Import CircularProgress from Material-UI
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Import CloudUploadIcon from Material-UI
import { query, where, getDocs ,doc,deleteDoc} from 'firebase/firestore';
import { addDoc, collection ,serverTimestamp} from 'firebase/firestore';
import { storage, database } from '../firebase';



const styles = {


  Avatarcontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  Avatar: {
    width: '100px',
    height: '100px',
    marginBottom: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
  }

}



const ProfileUpdate = () => {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://i.postimg.cc/t4yQKtGb/wall.png");
  const { user } = UserAuth();
  const [data, setData] = useState([]);


  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  async function handleClick() {
    setLoading(true);
    await upload(photo, currentUser, setLoading);
    setLoading(false);
  }

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleDeletePost = async (postId) => {
    try {
      const postRef = doc(database, 'posts', postId);  
      await deleteDoc(postRef);
      setData((prevData) => prevData.filter((item) => item.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          // No user is logged in, do not fetch any data
          return;
        }

        const q = query(
          collection(database, 'posts'),
          where('userId', '==', user.uid) // Only fetch posts created by the current user
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
  }, [user]); // Trigger the fetch whenever the user object changes

  return (<>     
    <Container maxWidth="xl"style={{ padding:'10vh', }}>
      <Container maxWidth="xs"style={{ cursor: 'pointer',float:'left' }} >         
      <div style={{position:'static', width:'200px',padding:'10px'}}>     
            <label htmlFor="fileInput" >
              <Avatar src={photoURL} alt="Profile" style={styles.Avatar} />
             <Typography>{currentUser?.displayName}</Typography>
              <input type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} id="fileInput" />
            </label>
            <Button variant="contained" disabled={loading || !photo} onClick={handleClick}>
          {loading ? (
            <CircularProgress size={24} color="inherit" /> // Display CircularProgress while uploading
          ) : (
            <>
              <CloudUploadIcon style={{ marginRight: '5px' }} />
              Update 
            </>
          )}
        </Button></div> 
          </Container>       
      </Container>   <p>Welcome, {user?.displayName}</p>
        <p>{user?.email}</p>
    <p>{user?.emailVerified}</p>
<Container maxWidth='md' style={{borderTop:'1px solid black',borderBottom:'1px solid black',marginTop:'122px',display:'-ms-inline-flexbox'}}>
<Typography variant='overline'>Posts</Typography>
</Container>
<Container>
  {data && data.length > 0 ? (
    data.map((item) => (
      <Card key={item.id} style={{ margin: '10px', maxWidth: '450px' }}>
        <CardContent>
          <Typography variant="h6">{item.title}</Typography>
          <Typography variant="body1">{item.content}</Typography>
          <img src={item.imageUrl} alt="ok" style={{ width: '200px', height: '200px' }} />
          <Typography variant="caption">User Name {item.authorName}</Typography>&nbsp;
          <Typography variant="caption">User Email {item.authorEmail}</Typography><br />
          <Typography variant="caption">Likes {item.likes}</Typography>
          {user && user.uid === item.userId && (
            <Button
              variant="contained"
              onClick={() => handleDeletePost(item.id)}
              style={{ marginTop: '10px' }}
            >
              Delete
            </Button>
          )}
        </CardContent>
      </Card>
    ))
  ) : (
    <p>Nothing here.</p>
  )}
</Container>

  
      
  </>);
};

export default ProfileUpdate;
