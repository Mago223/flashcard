"use client";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProductPage() {
  const [currentPlan, setCurrentPlan] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFullName(user.displayName || "User");
        // Fetch user's plan from Firestore
        const userDoc = await getDoc(doc(db, "userPlans", user.uid));
        if (userDoc.exists()) {
          setCurrentPlan(userDoc.data().plan);
        } else {
          setCurrentPlan("No Plan");
        }
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePlanChange = async (newPlan) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Update plan in Firestore
        await setDoc(doc(db, "userPlans", user.uid), { plan: newPlan });
        setCurrentPlan(newPlan);
        alert("Plan updated successfully");
      } else {
        throw new Error("User not logged in");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Failed to update plan");
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/signin");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
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
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Welcome to Memora
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: "#b0bec5" }}
          >
            Manage and create your flashcards with ease.
          </Typography>
        </motion.div>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1DB954",
                "&:hover": { backgroundColor: "#1aa34a" },
                px: 4,
                py: 1.5,
              }}
              onClick={() => handleNavigation("/flashcards")}
            >
              My Flashcards
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1DB954",
                "&:hover": { backgroundColor: "#1aa34a" },
                px: 4,
                py: 1.5,
              }}
              onClick={() => handleNavigation("/generate")}
            >
              Generate Flashcards
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Your Current Plan: {currentPlan || "None"}
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 4, color: "#b0bec5" }}
          >
            Choose a new plan:
          </Typography>
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          {["Basic", "Pro"].map((plan) => (
            <Grid item key={plan}>
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
                  <CardActionArea onClick={() => handlePlanChange(plan)}>
                    <CardContent>
                      <Typography variant="h5" color="#E0E0E0" gutterBottom>
                        {plan} Plan
                      </Typography>
                      <Typography variant="h6" color="#1DB954" gutterBottom>
                        ${plan === "Basic" ? "5" : "10"} / month
                      </Typography>
                      <Typography variant="body2" color="#b0bec5">
                        {plan === "Basic"
                          ? "Access to basic features"
                          : "Unlimited features with priority support"}
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
