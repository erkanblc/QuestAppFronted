import SendIcon from '@mui/icons-material/Send';
import { Button, InputAdornment } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function PostForm(props) {
    const { userId, userName, refreshPosts } = props;
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [open, setOpen] = React.useState(false);
    const token = localStorage.getItem("tokenKey");

    const handleClick = () => {
        setOpen(true);
    };

    /*const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };*/

    const handleClose = (event, reason) => {  //yeni hali
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const savePost = () => {
        fetch("/posts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || ""
              },
            body: JSON.stringify({
                title: title,
                user_id: userId,
                text: text,
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }
    const handleSubmit = () => {
        //Test
        /*console.log("currentUser:", localStorage.getItem("currentUser"));
        console.log("userName:", localStorage.getItem("userName"));
        console.log("tokenKey:", localStorage.getItem("tokenKey"));*/
        savePost();
        setIsSent(true);
        setText("");
        setTitle("");
        handleClick();
        refreshPosts();
    };

    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);
    };
    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    };

    return (
        <div className='postContainer'>
            <Snackbar open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Beitrag wurde erfolgreich gespeichert.	!
                </Alert>
            </Snackbar>
            <Card sx={{ width: 500 }}>
                <CardHeader
                    avatar={
                        <Link to={`/users/${userId}`} className="navbarLink">
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {userName ? userName.charAt(0).toUpperCase() : ""}
                            </Avatar>
                        </Link>
                    }

                    title={<OutlinedInput
                        id='outlined-adornment-amount'
                        multiline
                        placeholder='Title'
                        inputProps={{ maxLength: 25 }}
                        fullWidth
                        value={title}
                        onChange={(i) => handleTitle(i.target.value)}
                    >

                    </OutlinedInput>}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <OutlinedInput
                            id='outlined-adornment-amount'
                            multiline
                            placeholder='Text'
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            onChange={(i) => handleText(i.target.value)}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <Button
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        onClick={handleSubmit}
                                    >
                                        Send
                                    </Button>
                                </InputAdornment>
                            }
                        >
                        </OutlinedInput>
                    </Typography>
                </CardContent>


            </Card>

            <div style={{ marginTop: "10px" }}>
                <Typography variant="h6">

                </Typography>
                <Typography></Typography>
            </div>
        </div>
    );
}

export default PostForm;
