"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Button,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { PDFDocument } from "pdf-lib";
import pdfToText from "react-pdftotext";
import { motion } from "framer-motion";

export default function Generate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleFileUpload = async () => {
    const file = document.querySelector("input[type=file]").files[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileType = file.type;
      let content;

      if (fileType.startsWith("text/")) {
        content = e.target.result;
        console.log("Text file content:", content);
      } else if (fileType === "application/pdf") {
        content = await pdfToText(file);
        console.log("Extracted text from PDF:", content);
      } else if (fileType.startsWith("image/")) {
        alert("Cannot upload images at this time");
        return;
      } else {
        alert("Unsupported file type");
        return;
      }

      fetch("api/generate_many", {
        method: "POST",
        body: content,
      })
        .then((res) => res.json())
        .then((data) => setFlashcards(data));
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    fetch("api/generate_many", {
      method: "POST",
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Name already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDockRef = doc(colRef);
      batch.set(cardDockRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

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
      sx={{
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography
            variant="h3"
            sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}
          >
            Generate Flashcards
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Paper
            sx={{
              p: 4,
              width: "100%",
              backgroundColor: "#242424",
              color: "white",
            }}
          >
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#777",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              sx={{
                backgroundColor: "#1DB954",
                "&:hover": { backgroundColor: "#1aa34a" },
                mb: 2,
              }}
            >
              Generate
            </Button>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              onClick={() => document.getElementById("fileInput").click()}
              fullWidth
              sx={{
                color: "#1DB954",
                borderColor: "#1DB954",
                "&:hover": {
                  borderColor: "#1aa34a",
                  backgroundColor: "rgba(29, 185, 84, 0.1)",
                },
              }}
            >
              Upload File
            </Button>
          </Paper>
        </motion.div>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Flashcards Preview
            </Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: "#242424", color: "white" }}>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: "1000px",
                            "& > div": {
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              position: "relative",
                              width: "100%",
                              height: "200px",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                            },
                            "& > div > div": {
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 2,
                              boxSizing: "border-box",
                            },
                            "& > div > div:nth-of-type(2)": {
                              transform: "rotateY(180deg)",
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography variant="h6" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h6" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                  backgroundColor: "#1DB954",
                  "&:hover": { backgroundColor: "#1aa34a" },
                }}
              >
                Save Flashcards
              </Button>
            </Box>
          </Box>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "#242424", color: "white" } }}
        >
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#b0bec5" }}>
              Please enter a name for your flashcards collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#777",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#888",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#b0bec5" }}>
              Cancel
            </Button>
            <Button onClick={saveFlashcards} sx={{ color: "#1DB954" }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
