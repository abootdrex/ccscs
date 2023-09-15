import React, { useState,useEffect } from 'react';
import { TextField, Button, Container, Typography,Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { query, where, getDocs ,deleteDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection ,serverTimestamp,orderBy} from 'firebase/firestore';
import { storage, database } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const Home = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


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



const uploadFile = async () => {
  if (!imageUpload || !title || !content || !user) return;
  setIsLoading(true);

  const imageRef = ref(storage, `images/${imageUpload.name}`);

  try {
    await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(imageRef);

    await addDoc(collection(database, 'posts'), {
      userId: user.uid,
      title,
      content,
      imageUrl: url,
      authorEmail: user.email,
      authorName: user.displayName,
      timestamp: serverTimestamp(),
    });

    setUploadSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('Error:', error);
    setUploadSuccess(false);
  } finally {
    setIsLoading(false);
  }
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
      <Container maxWidth="md" style={styles.container}>
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
        
    <Button variant="contained" onClick={uploadFile} disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Container>


        
        {uploadSuccess && (
          <Typography style={{ color: 'green',position:'absolute' }}>
            posted  successfully!
          </Typography>
        )}
      </Container>
      <Container maxWidth='md' >
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

export default Home;