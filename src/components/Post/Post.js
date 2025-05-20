import React, { useState, useRef, useEffect } from 'react';
import './Post.css';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';




const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({

    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function Post(props) {
    const { title, text, userId, userName, postId, likes } = props;
    const [expanded, setExpanded] = useState(false);
    const isInitialMount = useRef(true);
    const [commentList, setCommentList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    //const likeCount = likes ? likes.length : 0;
    const [likeCount, setLikeCount] = useState(likes ? likes.length : 0);
    const [likeId, setLikeId] = useState(null);
    const token = localStorage.getItem("tokenKey");
    const currentUser = parseInt(localStorage.getItem("currentUser"));
    const isLoggedIn = localStorage.getItem("currentUser") !== null;


    const refreshComments = () => {
        fetch("/comments?postId=" + postId)
            .then((res) => res.json())
            .then((data) => {
                setIsLoaded(true);
                setCommentList(data); // burada `res.data` değil `data` kullanılmalı
            })
            .catch((error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error);
            });
    };

    const saveLike = () => {
        fetch("/likes",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? token : ""
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: parseInt(localStorage.getItem("currentUser")),
                }),
            })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }

    const deleteLike = () => {
        fetch("/likes/" + likeId, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? token : ""
            },
        })
            .catch((err) => console.log("error"))
    }

    /*const checkLikes = () => {
        //console.log("Likes güncellendi:", likes);
        var likeControl = likes.find((like => like.userId === currentUser));
        //console.log("burasi " + likeControl);
        if (likeControl != null) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    }*/

    const checkLikes = () => {
        const likeControl = likes.find((like) => parseInt(like.userId) === currentUser);

        if (likeControl) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        } else {
            setLikeId(null);
            setIsLiked(false);
        }
    };

    useEffect(() => {
        if (isInitialMount.current)
            isInitialMount.current = false;
        else
            refreshComments();
    }, [commentList]);

    useEffect(() => {
        checkLikes();
        console.log("Likes güncellendi:", likes);
    }, []);



    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
        console.log(commentList);
    };

    /*const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            saveLike();
            setLikeCount(likeCount + 1)
        }
        else {
            deleteLike();
            setLikeCount(likeCount - 1)
        }
    }*/

    const handleLike = () => {
        setIsLiked(!isLiked);

        if (!isLiked) {
            saveLike();
            setLikeCount(likeCount + 1);
        } else {
            if (likeId !== null) {
                deleteLike();
                setLikeCount(likeCount - 1);
            } else {
                console.warn("Silinmeye çalisilan likeId null!");
            }
        }
    };
    return (
        <div className='postContainer'>
            <Card sx={{ width: 500 }}>
                <CardHeader
                    avatar={
                        <Link to={`/users/${userId}`} className="navbarLink">
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {userName?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Link>
                    }

                    title={title}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        onClick={handleLike}
                        aria-label="add to favorites"
                        disabled={!isLoggedIn}>
                        <FavoriteIcon style={isLiked ? { color: "red" } : null} />
                    </IconButton>
                    {likeCount}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >

                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed className="myContainer">
                        {error ? "error" :
                            isLoaded ? commentList.map(comment => (
                                <Comment
                                    userId={comment.userId}
                                    userName={comment.userName}
                                    text={comment.text}
                                />
                            )) : "loading"}
                        {localStorage.getItem("currentUser") == null ? "" :
                            <CommentForm
                                userId={localStorage.getItem("currentUser")}
                                userName={localStorage.getItem("userName")}
                                postId={postId}
                            ></CommentForm>
                        }
                    </Container>
                </Collapse>
            </Card>

            <div style={{ marginTop: "10px" }}>
                <Typography variant="h6">

                </Typography>
                <Typography></Typography>
            </div>
        </div>
    );
}

export default Post;
