import React, { useState } from "react";
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputAdornment, Avatar, Button } from "@mui/material"; // Avatar eksikti, eklendi
import { Link } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';


// 'classes' tanımlı değildi, hata veriyordu. Şimdilik className'ler string olarak yazıldı.
function CommentForm(props) {
    const { userId, userName, postId } = props;
    const [text, setText] = useState("");
    const [commentList, setCommentList] = useState([]);
    const token = localStorage.getItem("tokenKey");
    
    const handleSubmit = () => {
        saveComment();
        setText("");
    };
    const handleChange = (value) => {
        setText(value);
    };

    const saveComment = () => {
        fetch("/comments",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ""
                  },
                body: JSON.stringify({
                    postId: postId,
                    userId: userId,
                    text: text,
                }),
            })
            .then((res) => res.json())
            .catch((err) => console.log("error"))
    }

    return (
        <div>
            <CardContent className="comment">
                <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    onChange={ (i) => handleChange(i.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <Link className="link" to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className="avatar">
                                    {userName ? userName.charAt(0).toUpperCase() : ""}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }
                    endAdornment={
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={handleSubmit}
                        >
                            Send
                        </Button>
                    }
                    value = {text}
                >

                </OutlinedInput>
            </CardContent>
            <ul>
                {commentList.map(comment => (
                    <li key={comment.id}>
                        {comment.userId} {comment.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentForm;
