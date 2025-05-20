import React, { useState} from "react";
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputAdornment, Avatar } from "@mui/material"; // Avatar eksikti, eklendi
import { Link } from "react-router-dom";

// 'classes' tanımlı değildi, hata veriyordu. Şimdilik className'ler string olarak yazıldı.
function Comment(props) {
    const { text, userId, userName } = props;
    const [commentList, setCommentList] = useState([]);

    return (
        <div>
            <CardContent className="comment">
                <OutlinedInput
                    disabled
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 25 }}
                    fullWidth
                    value={text}
                    startAdornment={
                        <InputAdornment position="start">
                            <Link className="link" to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className="avatar">
                                    {userName ? userName.charAt(0).toUpperCase() : ""}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }
                />
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

export default Comment;
