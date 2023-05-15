import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { LocationOn } from "@mui/icons-material";
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { login, isAuthenticated } from "@/utils/auth";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);

      if (data) {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        // handle errors thrown from frontend
        setError(err.message);
      } else {
        // handle errors thrown from backend
        setError(String(err));
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LocationOn />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
      </div>
      <form className="mt-1" onSubmit={handleLogin}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          //label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          //label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="outlined" type="submit" fullWidth>Log in</Button>
      </form>
    </div>
  );
}
