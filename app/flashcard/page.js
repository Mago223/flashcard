"use client";

import { useEffect, useState, Suspense } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import {
  Modal,
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
} from "@mui/material";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Spinner from "../components/Spinner";

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

  const [addFlashcardOpen, setAddFlashcardOpen] = useState(false);

  const [testOpen, setTestOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswer, setSelectedAnswer] = useState("");
  const [uiScore, setuiScore] = useState(0);
  const [uiLength, setuiLength] = useState(0);
  const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const [userPlan, setUserPlan] = useState("Basic");


  const goHome = () => {
    router.push("/");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }
      setUser(user);
      
      // Fetch user's plan
      const userPlanDoc = await getDoc(doc(db, "userPlans", user.uid));
      if (userPlanDoc.exists()) {
        setUserPlan(userPlanDoc.data().plan);
      } else {
        setUserPlan("Basic");
      }
      
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
    if (userPlan !== "Pro") {
      alert("Regenerating flashcards is a Pro-only feature. Please upgrade your plan to access this functionality.");
      return;
    }
    setCurrentFlashcard(flashcard);
    setRegenerateOpen(true);
  };

  const deleteFlashCard = async (flashcard) => {
    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);
    const docs = await getDocs(colRef);

    docs.forEach((doc) => {
      if (doc.id === flashcard.id) {
        deleteDoc(doc.ref);
        setFlashcardUpdateTrigger((prev) => prev + 1);
      }
    });
  };

  const addFlashcard = async () => {
    setAddFlashcardOpen(true);
  };

  const handleRegenerateCloseCancel = () => {
    setRegenerateOpen(false);
  };

  const handleRegenerateCloseSave = async () => {
    setRegenerateOpen(false);
    setAddFlashcardOpen(false);

    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);
    const docs = await getDocs(colRef);

    for (const doc of docs.docs) {
      if (currentFlashcard == null) {
        const generatedFlashcard = await fetch("api/generate_one", {
          method: "POST",
          body: frontTextToEdit,
        }).then((res) => res.json());

        await addDoc(colRef, {
          front: generatedFlashcard[0].front,
          back: generatedFlashcard[0].back,
        });

        setFlashcardUpdateTrigger((prev) => prev + 1);
        return;
      } else if (doc.id === currentFlashcard.id) {
        const generatedFlashcard = await fetch("api/generate_one", {
          method: "POST",
          body: frontTextToEdit,
        }).then((res) => res.json());

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

  const handleAddFlashcardCloseCancel = () => {
    setAddFlashcardOpen(false);
  };

  const handleAddFlashcardCloseSave = async () => {
    setAddFlashcardOpen(false);

    if (!search || !user) return;
    const colRef = collection(doc(db, "users", user.uid), search);

    await addDoc(colRef, {
      front: frontTextToEdit,
      back: backTextToEdit,
    });

    setFlashcardUpdateTrigger((prev) => prev + 1);
  };

  const startTest = () => {
    if (flashcards.length < 1) {
      alert("No flashcards available for testing.");
      return;
    }
    // Prepare questions for the test
    const preparedQuestions = flashcards.map((card) => {
      const allOptions = [...flashcards.map((f) => f.back), card.back];
      const shuffleOptions = allOptions
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      return {
        question: card.front,
        options: shuffleOptions,
        correctAnswer: card.back,
      };
    });
    setQuestions(preparedQuestions);
    setTestOpen(true);
    setTestCompleted(false);
    setuiLength(preparedQuestions.length);
  };

  const handleTestClose = () => {
    setTestOpen(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTestCompleted(false);
  };

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
      setuiScore((prev) => prev + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setTestCompleted(true);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          background: "linear-gradient(to bottom, #121212, #181818)",
          color: "white",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Modal
          open={addFlashcardOpen}
          onClose={handleAddFlashcardCloseCancel}
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
              bgcolor: "#282828",
              border: "1px solid #333",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{ mb: -2 }}
            >
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <TextField
                  value={frontTextToEdit}
                  onChange={(e) => setFrontTextToEdit(e.target.value)}
                  label="Edit Front"
                  multiline
                  sx={{
                    input: { color: "white" },
                    label: { color: "#b0bec5" },
                  }}
                  InputProps={{
                    style: { color: "white" }, // Text color inside the input field
                  }}
                />
                <TextField
                  value={backTextToEdit}
                  onChange={(e) => setBackTextToEdit(e.target.value)}
                  label="Edit Back"
                  multiline
                  sx={{
                    input: { color: "white" },
                    label: { color: "#b0bec5" },
                  }}
                  InputProps={{
                    style: { color: "white" }, // Text color inside the input field
                  }}
                />
              </Box>
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={handleAddFlashcardCloseCancel}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddFlashcardCloseSave}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (userPlan !== "Pro") {
                      alert("Generating flashcards is a Pro-only feature. Please upgrade your plan to access this functionality.");
                    } else {
                      regenerateFlashcard(null);
                    }
                  }}
                  sx={{ 
                    bgcolor: "#1DB954", 
                    "&:hover": { bgcolor: "#1aa34a" },
                    opacity: userPlan === "Pro" ? 1 : 0.2,
                  }}
                >
                  Generate
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
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
              bgcolor: "#282828",
              border: "1px solid #333",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{ mb: -2 }}
            >
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <TextField
                  value={frontTextToEdit}
                  onChange={(e) => setFrontTextToEdit(e.target.value)}
                  label="Enter Prompt to Regenerate"
                  multiline
                  sx={{
                    input: { color: "white" },
                    label: { color: "#b0bec5" },
                  }}
                  InputProps={{
                    style: { color: "white" }, // Text color inside the input field
                  }}
                />
              </Box>
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={handleRegenerateCloseCancel}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleRegenerateCloseSave}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
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
              bgcolor: "#282828",
              border: "1px solid #333",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{ mb: -2 }}
            >
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <TextField
                  value={frontTextToEdit}
                  onChange={(e) => setFrontTextToEdit(e.target.value)}
                  label="Edit Front"
                  multiline
                  sx={{
                    input: { color: "white" },
                    label: { color: "#b0bec5" },
                  }}
                  InputProps={{
                    style: { color: "white" }, // Text color inside the input field
                  }}
                />
                <TextField
                  value={backTextToEdit}
                  onChange={(e) => setBackTextToEdit(e.target.value)}
                  label="Edit Back"
                  multiline
                  sx={{
                    input: { color: "white" },
                    label: { color: "#b0bec5" },
                  }}
                  InputProps={{
                    style: { color: "white" }, // Text color inside the input field
                  }}
                />
              </Box>
              <Box
                gap={2}
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={handleSnackbarCloseCancel}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSnackbarCloseSave}
                  sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={testOpen}
          onClose={handleTestClose}
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
              bgcolor: "#282828",
              border: "1px solid #333",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              {testCompleted ? (
                <Typography variant="h6">
                  Test Completed! Your score: {score} / {questions.length}
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: "#E0E0E0" }}>
                    {questions[currentQuestionIndex]?.question}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {questions[currentQuestionIndex]?.options.map(
                      (option, idx) => (
                        <Button
                          key={idx}
                          variant="outlined"
                          onClick={() => handleAnswerClick(option)}
                          sx={{
                            display: "block",
                            mb: 1,
                            color: "#1DB954",
                            borderColor: "#1DB954",
                            "&:hover": {
                              borderColor: "#1aa34a",
                              color: "#1aa34a",
                            },
                          }}
                        >
                          {option}
                        </Button>
                      )
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Modal>

        <Button onClick={goHome} style={{ textTransform: 'none', padding: 0 }} sx={{ color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">
            Memora
          </Typography>
        </Button>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          pt={2}
          gap={2}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={addFlashcard}
            sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
          >
            Add Flashcard
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={startTest}
            sx={{ bgcolor: "#1DB954", "&:hover": { bgcolor: "#1aa34a" } }}
          >
            Test Yourself
          </Button>

          <Typography variant="h6" sx={{ mt: 2, color: "#E0E0E0" }}>
            Your last test score: {uiScore} / {uiLength}
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
                key={index}
              >
                <Card
                  sx={{
                    bgcolor: "rgba(40, 40, 40, 0.95)",
                    border: "1px solid #333",
                  }}
                >
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
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ color: "#E0E0E0" }}
                            >
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ color: "#E0E0E0" }}
                            >
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
                      justifyContent: "center",
                    }}
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        bgcolor: "#1DB954",
                        "&:hover": { bgcolor: "#1aa34a" },
                      }}
                      onClick={() => updateFlashcard(flashcard)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        bgcolor: "#1DB954",
                        "&:hover": { bgcolor: "#1aa34a" },
                        opacity: userPlan === "Pro" ? 1 : 0.2,
                      }}
                      onClick={() => regenerateFlashcard(flashcard)}
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        bgcolor: "#1DB954",
                        "&:hover": { bgcolor: "#1aa34a" },
                      }}
                      onClick={() => deleteFlashCard(flashcard)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
