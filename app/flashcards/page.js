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
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import Spinner from "../components/Spinner";

export default function Flashcards() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin");
      }
      setUser(user);
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

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h6">{flashcard.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
