import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, database } from '../firebase';
import { UserAuth } from '../context/AuthContext';

const Form = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      fontSize: '20px',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(database, 'posts'),
          where('userId', '!=', '')
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
        <div className="App">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <br />
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
          <Button variant="contained" onClick={uploadFile} disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {uploadSuccess && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Image uploaded successfully!
          </div>
        )}
      </Container>
      <hr />
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

export default Form;



/*import React, { useState,useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Card, CardContent} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import Image from '../media/backg.jpeg'
import { query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection ,serverTimestamp} from 'firebase/firestore';
import { storage, database } from '../firebase';
import { UserAuth } from '../context/AuthContext';

const Form = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
 
  const { user } = UserAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadFile = () => {
    if (!imageUpload || !title || !content || !user) return;
    setIsLoading(true);
 
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
      backgroundImage: `url('${Image}')`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '130vh', // Set a suitable height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10%',
      color: 'red',
      fontSize: '21px',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(database, 'posts'),
          where('userId', '!=', '') 
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
        <div className="App">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <br />
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
      </Container>
      <hr/>

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

export default Form;
*/


















/*import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';

function UploadImage() {
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);
  };

  const uploadFile = () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${imageUpload.name}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url); // This is the URL of the uploaded image
            setUploadSuccess(true);
            setPhotoURL(url); // Store the URL in state
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
  

  return (
    <div style={{padding:'20%'}}>
      <input type="file" onChange={handleImageChange} />
      <button onClick={uploadFile}>Upload Image</button>

      {uploadSuccess && (
        <div>
          <p>Image Uploaded Successfully!</p>
          {photoURL && <img src={photoURL} alt="Uploaded" />}
        </div>
      )}
    </div>
  );
}

export default UploadImage;*/


/*
const Display =()=>{

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
return(
    <>
    
<div style={{padding:'10%'}}>
    HIII
<ul>
        {users.map((user) => (
          <li key={user._id}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
            <strong>Image:</strong>
            <img src={user.image.dataUrl} alt={user.name} style={{width:'370px',height:'400px', border:'9px solid pink',borderRadius:'20px'}}/>
            </div>
          </li>
        ))}
      </ul>
</div>
    
    </>
)
}
export default Display;


*/
/*import React, { useState } from 'react';
import axios from 'axios';
function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Create a FormData object to send the file
      //https://evolution-x-a2881-default-rtdb.firebaseio.com/formData.json
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Make a POST request to your API endpoint
      axios.post('https://evolution-x-a2881-default-rtdb.firebaseio.com/formData.json',formData,{
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      })
      .then((response) => {
        // Handle the response from the API here
        console.log('Upload response:', response.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Upload error:', error);
      });
    } else {
      alert('Please select a file.');
    }
  };

  return (
    <div style={{padding:'20%'}}>
      <h1>Image Upload</h1>
      <input type="file" name="image" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUpload;*/

/*import React, { useState } from 'react';
import Axios from 'axios'
import { TextField, Button, Container, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import Image from '../media/backg.jpeg'

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';



const Form = () => {
  const [imageUpload, setImageUpload] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadFile = () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${imageUpload.name}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
        setUploadSuccess(true);
      });
    })
    .catch((error) => {
      console.error(error);
      setUploadSuccess(false); // Set success state to false on error
    });
  };

  const styles = {
      container: {
      backgroundImage: `url('${Image}')`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '130vh', // Set a suitable height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding:'10%',
      color:'red',
      fontSize:'21px'
        
    },
  };

  return (<>
    <Container maxWidth="xl" style={styles.container} >        
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      /><br/>
      <br/>
      <Button variant='contained' onClick={uploadFile}>Upload</Button>
    </div>
    {uploadSuccess && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              Image uploaded successfully!
            </div>
          )}
    </Container>
    
  </>);
};

export default Form;*/