import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)

  const [posts, setposts] = useState([]);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);      {/* this survives refresh.it will use cookie tracking.thats why it is persistent-->continues to exist.state is not*/}
      }else{
        setUser(null)
      }
    })
    return () =>{
      //perform some cleanup actions
      unsubscribe();
    }
  },[user, username])

  useEffect(()=>{
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  })

  const signUp = (e)=>{
    e.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((err) => alert(err.message))

    setOpen(false);
  }

  const signIn = (e)=>{
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
             className="app__headerImage" 
             src="https://getinstantgramfollowers.files.wordpress.com/2013/11/instagram-banner-web.jpg" 
             alt="Instagram Logo" 
             width='100'
             height="100"
            />
          </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
             className="app__headerImage" 
             src="https://getinstantgramfollowers.files.wordpress.com/2013/11/instagram-banner-web.jpg" 
             alt="Instagram Logo" 
             width='100'
             height="100"
            />
          </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
        alt="Instagram" 
        className="app__headerImage"/>
        {
          user?(
            <Button onClick={() => auth.signOut()}>Log Out</Button>
          ): (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          )
        }
      </div>
      <div className="app__posts">
        <div>
          {
            posts.map(({ id, post}) => (
              <Post
                key={id}
                postId={id}
                user={user}
                imageUrl={post.imageUrl}
                username={post.username}
                caption={post.caption} 
              />
            ))
          }
        </div>
      </div>
      {
        user?.displayName ?(
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )
      }
    </div>
  );
}

export default App;
