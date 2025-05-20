/*import React from "react";
import { useParams } from "react-router-dom";


function User() {
    const { userId } = useParams();
    return (
        <div>
            User!!! {userId}
        </div>
    )
}
export default User;*/

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";

function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("tokenKey");

  useEffect(() => {
    const headers = {
      Authorization: token ? token : "",
    };

    // Kullanıcı bilgisi
    fetch(`/users/${userId}`, { headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kullanıcı bulunamadı");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
        navigate("/"); // kullanıcı yoksa yönlendir
      });

    // Post, yorum ve beğeni sayısı yüklemesi paralel devam etsin
    Promise.all([
      fetch(`/posts?userId=${userId}`, { headers }).then((res) => res.json()),
      fetch(`/comments?userId=${userId}`, { headers }).then((res) => res.json()),
      fetch(`/likes?userId=${userId}`, { headers }).then((res) => res.json())
    ])
      .then(([posts, comments, likes]) => {
        setPostCount(posts.length);
        setCommentCount(comments.length);
        setLikeCount(likes.length);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [userId, token, navigate]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5">Kullanıcı Bilgileri</Typography>
          <Typography variant="body1">Username: {user?.userName}</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Post Sayısı: {postCount}
          </Typography>
          <Typography variant="body2">
            Comment Sayısı: {commentCount}
          </Typography>
          <Typography variant="body2">
            Like Sayısı: {likeCount}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default User;