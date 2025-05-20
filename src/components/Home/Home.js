import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import './Home.css';
import Container from '@mui/material/Container';
import PostForm from '../Post/PostForm';


function Home() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("/posts")
            .then((res) => res.json())
            .then((data) => {
                setIsLoaded(true);
                setPostList(data); // burada `res.data` değil `data` kullanılmalı
            })
            .catch((error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error);
            });
    };

    useEffect(() => {
        refreshPosts()
    }, [postList]);

    if (error) {
        return <div>Error!</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <Container fixed className="container">
                {localStorage.getItem("currentUser") == null? "":
                <PostForm userId={localStorage.getItem("currentUser")}
                    userName={localStorage.getItem("userName")}
                    refreshPosts={refreshPosts}
                />
                }
                {postList.map(post => (
                    <Post
                        postId={post.id}
                        userId={post.userId}
                        userName={post.userName}
                        title={post.title}
                        text={post.text}
                        likes={post.postLikes}
                    />
                ))}
            </Container>
        );
    }
};
export default Home;