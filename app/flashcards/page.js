"use client";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  CardActionArea,
  CardContent,
  Typography,
  Container,
  Card,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";

export default function Flashcards() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
      }
      setUser(user);
      setFullName(user?.displayName || "User");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    if (user) {
      getFlashcards();
    }
  }, [user]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/signin");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{ borderBottom: "1px solid #333" }}
      >
        <Typography variant="h6" fontWeight="bold">
          Memora
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" fontWeight="bold">
            {fullName}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{
              color: "#1DB954",
              borderColor: "#1DB954",
              "&:hover": { borderColor: "#1aa34a", color: "#1aa34a" },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 4, fontWeight: 700 }}
          >
            My Flashcards
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: "#b0bec5" }}
          >
            Click on a collection to view its flashcards.
          </Typography>
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div initial="hidden" animate="visible" variants={slideUp}>
                <Card
                  sx={{
                    width: 280,
                    borderRadius: 2,
                    bgcolor: "rgba(40, 40, 40, 0.95)",
                    border: "1px solid #333",
                    "&:hover": { transform: "scale(1.05)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCardClick(flashcard.name)}
                  >
                    <CardContent>
                      <Typography variant="h5" color="#E0E0E0" gutterBottom>
                        {flashcard.name}
                      </Typography>
                      <Typography variant="body2" color="#b0bec5">
                        Click to view flashcards
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}
