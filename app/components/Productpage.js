"use client";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion } from "framer-motion";

export default function ProductPage() {
  const [currentPlan, setCurrentPlan] = useState("");
  const [fullName, setFullName] = useState(""); // Store the full name
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // TODO:
        // Fetch current plan in async function
        const plan = "";
        setCurrentPlan(plan);
        setFullName(user.displayName || "User");
      } else {
        router.push("/signin");
      }
    });

    // TODO:
    // Call async function

    return () => unsubscribe();
  }, [router]);

  const handlePlanChange = async (newPlan) => {
    try {
      // TODO:
      // update plan via API
      setCurrentPlan(newPlan);
      alert("Plan updated successfully");
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
      maxWidth="100vw"
      sx={{
        backgroundColor: "#121212",
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
        sx={{ boxShadow: 1, borderRadius: 1 }}
      >
        {/* Company Name */}
        <Typography variant="h6" fontWeight="bold">
          Flashcard SaaS
        </Typography>

        {/* Firebase-based Auth User */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" fontWeight="bold">
            {fullName}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { borderColor: "#1DB954", color: "#1DB954" },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Navigation content */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome to the Flashcard SaaS Platform
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Manage and create your flashcards with ease.
          </Typography>
        </motion.div>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1DB954",
              "&:hover": { backgroundColor: "#1aa34a" },
              mx: 1,
              px: 3,
              py: 1.5,
            }}
            onClick={() => handleNavigation("/flashcards")}
          >
            My Flashcards
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1DB954",
              "&:hover": { backgroundColor: "#1aa34a" },
              mx: 1,
              px: 3,
              py: 1.5,
            }}
            onClick={() => handleNavigation("/generate")}
          >
            Generate Flashcards
          </Button>
        </Box>
      </Box>

      {/* Plan Management */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your Current Plan: {currentPlan}
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Choose a new plan:
          </Typography>
        </motion.div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <motion.div initial="hidden" animate="visible" variants={slideUp}>
            <Card
              sx={{
                maxWidth: 345,
                borderRadius: 2,
                boxShadow: 3,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { transform: "scale(1.05)" },
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <CardActionArea onClick={() => handlePlanChange("Basic")}>
                <CardContent>
                  <Typography variant="h6">Basic Plan</Typography>
                  <Typography variant="body2" color="gray">
                    $5 / month
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Access to basic features
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={slideUp}>
            <Card
              sx={{
                maxWidth: 345,
                borderRadius: 2,
                boxShadow: 3,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { transform: "scale(1.05)" },
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <CardActionArea onClick={() => handlePlanChange("Pro")}>
                <CardContent>
                  <Typography variant="h6">Pro Plan</Typography>
                  <Typography variant="body2" color="gray">
                    $10 / month
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Unlimited features with priority support
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
}
