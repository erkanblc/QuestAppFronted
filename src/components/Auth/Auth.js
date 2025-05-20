import React, { useState } from "react";
import { FormControl, InputLabel, Input, Box, FormHelperText, Button } from "@mui/material";
import { useHistory } from "react-router";
//import { PostWithoutAuth } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function Auth() {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const handleUsername = (value) => {
        setUserName(value);
    }
    const handlePassword = (value) => {
        setPassword(value);
    }
    const handleButton = (path) => {
        sendRequest(path)
        setUserName("")
        setPassword("")
        navigate("/");
    }
    const handleRegister = (path) => {
        sendRequest(path)
        setUserName("")
        setPassword("")
        //navigate("/" + "auth");
        window.location.reload();
    }
    const sendRequest = (path) => {
        fetch("/auth/" + path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: userName,
            password: password,
          }),
        })
          .then((res) => res.json())
          .then((result) => {   localStorage.setItem("tokenKey",result.message);
                                localStorage.setItem("currentUser",result.userId);
                                localStorage.setItem("userName",userName);
                            })
          .catch((err) => console.log(err));
      };

    return (
        <Box
            display="flex"
            justifyContent="center"
            sx={{ marginTop: "50px" }} // üstten 50px boşluk
        >
            <FormControl>
                <InputLabel >Username</InputLabel>
                <Input sx={{ border: "1px solid #90caf9", borderRadius: "4px", padding: "6px" }}
                    onChange={(i) => handleUsername(i.target.value)}></Input>
                <InputLabel style={{ marginTop: 80 }}>Password</InputLabel>
                <Input sx={{ border: "1px solid #90caf9", borderRadius: "4px", padding: "6px", marginTop: "50px" }}
                    onChange={(i) => handlePassword(i.target.value)}></Input>
                <Button variant="contained"
                    style={{
                        marginTop: 30,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick= {() => handleRegister("register")}
                >Register</Button>
                <FormHelperText style={{ margin: 20 }}>Are you already registered?</FormHelperText>
                <Button variant="contained"
                    style={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick={() => handleButton("login")}
                >Login</Button>
            </FormControl></Box>
    )
}

export default Auth;