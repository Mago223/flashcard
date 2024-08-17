"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import { LockOutlined, EmailOutlined } from "@mui/icons-material";
import Link from "next/link";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

function Signin() {
  const [error, setError] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Sign-in successful: ", result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
  
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in: ", user);
      })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Error during sign-in: ", errorCode, errorMessage, email, credential);
      });
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(to bottom, #121212, #181818)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "400px",
            border: "1px solid #333",
            borderRadius: "24px",
            p: 4,
            bgcolor: "rgba(24, 24, 24, 0.95)",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Avatar sx={{ bgcolor: "#1DB954", mb: 2 }}>
            <LockOutlined />
          </Avatar>
          <Typography
            variant="h5"
            textAlign="center"
            color="#E0E0E0"
            fontWeight="bold"
          >
            Log In
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <EmailOutlined sx={{ color: "#1DB954", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: "#242424",
                  color: "#E0E0E0",
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bec5",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1DB954",
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <LockOutlined sx={{ color: "#1DB954", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: "#242424",
                  color: "#E0E0E0",
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bec5",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1DB954",
                },
              }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#1DB954",
                "&:hover": {
                  backgroundColor: "#1aa34a",
                },
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                mt: 3,
                mb: 2,
              }}
            >
              Log In
            </Button>
            <Button id="google-signin" onClick={signInWithGoogle}
            type="submit"
            fullWidth
            variant="contained"
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#1DB954",
              "&:hover": {
                backgroundColor: "#1aa34a",
              },
              padding: "12px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              mt: 3,
              mb: 2,
            }}
            >Log in with Google</Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body1" color="#b0bec5">
                  Don&apos;t have an account?{" "}
                  <MuiLink
                    component={Link}
                    href="/signup"
                    sx={{
                      color: "#1DB954",
                      textDecoration: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

export default Signin;
