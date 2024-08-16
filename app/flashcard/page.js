"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import {
  Modal,
  Box,
  Container,
  TextField,
  Typography,
  Button,
  CardActionArea,
  CardContent,
  Grid,
  Card,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner"; // Assuming you have a Spinner component

export default function Flashcard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [frontTextToEdit, setFrontTextToEdit] = useState("");
  const [backTextToEdit, setBackTextToEdit] = useState("");
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [flashcardUpdateTrigger, setFlashcardUpdateTrigger] = useState(0);
  const [regenerateOpen, setRegenerateOpen] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function getFlashcard() {
      try {
        if (!search || !user) return;
        const colRef = collection(doc(db, "users", user.uid), search);
        const docs = await getDocs(colRef);
        const flashcards = [];
        setFrontTextToEdit("");
        setBackTextToEdit("");

        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    if (user) {
      getFlashcard();
    }
  }, [user, search, flashcardUpdateTrigger]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateFlashcard = async (flashcard) => {
    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);
    const docs = await getDocs(colRef);

    docs.forEach((doc) => {
      if (doc.id === flashcard.id) {
        setCurrentFlashcard(flashcard);
        setFrontTextToEdit(flashcard.front);
        setBackTextToEdit(flashcard.back);
        setSnackbarOpen(true);
      }
    });
  };

  const regenerateFlashcard = async (flashcard) => {
    setCurrentFlashcard(flashcard);
    setRegenerateOpen(true);
  };

  const handleRegenerateCloseCancel = () => {
    setRegenerateOpen(false);
  };

  const handleRegenerateCloseSave = async () => {
    setRegenerateOpen(false);

    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);
    const docs = await getDocs(colRef);

    for (const doc of docs.docs) {
      if (doc.id === currentFlashcard.id) {
        const response = await fetch("api/generate_one", {
          method: "POST",
          body: JSON.stringify({ prompt: frontTextToEdit }), // Ensure body is stringified
          headers: { "Content-Type": "application/json" }, // Include headers if needed
        });
        const generatedFlashcard = await response.json();

        await updateDoc(doc.ref, {
          front: generatedFlashcard[0].front,
          back: generatedFlashcard[0].back,
        });

        setFlashcardUpdateTrigger((prev) => prev + 1);
      }
    }
  };

  const handleSnackbarCloseCancel = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbarCloseSave = async () => {
    setSnackbarOpen(false);

    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);
    const docs = await getDocs(colRef);

    for (const doc of docs.docs) {
      if (doc.id === currentFlashcard.id) {
        await updateDoc(doc.ref, {
          front: frontTextToEdit,
          back: backTextToEdit,
        });

        setFlashcardUpdateTrigger((prev) => prev + 1);
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="100vw">
      <Modal
        open={regenerateOpen}
        onClose={handleRegenerateCloseCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            display="flex"
            alignItems={"center"}
            flexDirection={"column"}
            gap={2}
            sx={{ mb: -2 }}
          >
            <Box
              gap={2}
              display="flex"
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <TextField
                value={frontTextToEdit}
                onChange={(e) => setFrontTextToEdit(e.target.value)}
                label="Enter Prompt to Regenerate"
                multiline
              />
            </Box>
            <Box
              gap={2}
              display="flex"
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Button variant="contained" onClick={handleRegenerateCloseCancel}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleRegenerateCloseSave}>
                Regenerate
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={snackbarOpen}
        onClose={handleSnackbarCloseCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            display="flex"
            alignItems={"center"}
            flexDirection={"column"}
            gap={2}
            sx={{ mb: -2 }}
          >
            <Box
              gap={2}
              display="flex"
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <TextField
                value={frontTextToEdit}
                onChange={(e) => setFrontTextToEdit(e.target.value)}
                label="Edit Front"
                multiline
              />
              <TextField
                value={backTextToEdit}
                onChange={(e) => setBackTextToEdit(e.target.value)}
                label="Edit Back"
                multiline
              />
            </Box>
            <Box
              gap={2}
              display="flex"
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Button variant="contained" onClick={handleSnackbarCloseCancel}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSnackbarCloseSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
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
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                gap={2}
              >
                <Button
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={() => updateFlashcard(flashcard)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={() => regenerateFlashcard(flashcard)}
                >
                  Regenerate
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
