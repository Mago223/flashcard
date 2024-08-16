"use client";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Icon,
  Link as MuiLink,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LockOutlined,
  EmailOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update the user's display name
        updateProfile(user, { displayName: fullName })
          .then(() => {
            router.push("/generate");
          })
          .catch((error) => {
            setError(error.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "#121212",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Stack
          direction="column"
          width="400px"
          border="1px solid #1DB954"
          borderRadius="24px"
          p={4}
          spacing={4}
          bgcolor="rgba(36, 36, 36, 0.9)"
          sx={{
            boxShadow: "0px 8px 30px rgba(29, 185, 84, 0.2)",
          }}
        >
          <motion.div variants={slideUp}>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                color: "#1DB954",
                fontWeight: 700,

                mb: 2,
              }}
            >
              Sign Up
            </Typography>
          </motion.div>
          <form onSubmit={handleSignup}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                type="text"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Icon sx={{ color: "#1DB954", mr: 1 }}>
                      <PersonOutlined />
                    </Icon>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1DB954",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1DB954",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#888",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#1DB954",
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Icon sx={{ color: "#1DB954", mr: 1 }}>
                      <EmailOutlined />
                    </Icon>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1DB954",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1DB954",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#888",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#1DB954",
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Icon sx={{ color: "#1DB954", mr: 1 }}>
                      <LockOutlined />
                    </Icon>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    color: "white",
                    "& fieldset": {
                      borderColor: "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1DB954",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1DB954",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#888",
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
                variant="contained"
                fullWidth
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
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body1" color="#b0bec5">
              Already have an account?{" "}
              <MuiLink
                component={Link}
                href="/signin"
                sx={{
                  color: "#1DB954",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Log in
              </MuiLink>
            </Typography>
          </Box>
        </Stack>
      </motion.div>
    </Box>
  );
}

export default Signup;
