"use client";
import Link from "next/link";
import getStripe from "@/utils/get-stripe";
import { Box, Typography, Container, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";

export default function LandingPage() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJSON = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSessionJSON.message);
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id,
    });

    if (error) {
      console.warn(error.message);
    }
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
      sx={{
        background: "linear-gradient(to bottom, #121212, #181818)",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <Container
        sx={{
          textAlign: "center",
          padding: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Welcome to Memora!
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, color: "#b0bec5" }}
          >
            The easiest way to make flashcards from scratch!
          </Typography>
        </motion.div>
        <Box sx={{ mb: 2 }}>
          <Link href="/signup" passHref>
            <Button
              variant="contained"
              sx={{
                mx: 1,
                backgroundColor: "#1DB954",
                "&:hover": { backgroundColor: "#1aa34a" },
                px: 4,
                py: 1,
                borderRadius: "20px",
              }}
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/signin" passHref>
            <Button
              variant="contained"
              sx={{
                mx: 1,
                backgroundColor: "#1DB954",
                "&:hover": { backgroundColor: "#1aa34a" },
                px: 4,
                py: 1,
                borderRadius: "20px",
              }}
            >
              Sign In
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          padding: 8,
          backgroundColor: "rgba(24, 24, 24, 0.95)",
        }}
      >
        <Container maxWidth="md">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
              Features
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {[
              {
                title: "Easy text input",
                description: "Just type in your text and we'll do the rest.",
              },
              {
                title: "Smart Flashcards",
                description:
                  "Our AI intelligently breaks down your text into concise flashcards.",
              },
              {
                title: "Accessible Anywhere",
                description: "Access your flashcards from any device, anytime.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: "#1DB954" }}>
                    {feature.title}
                  </Typography>
                  <Typography color="#b0bec5">{feature.description}</Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ padding: 8, backgroundColor: "rgba(18, 18, 18, 0.95)" }}>
        <Container maxWidth="md">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
              Pricing
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {[
              {
                title: "Basic",
                price: "$5 / month",
                description:
                  "Access to basic flashcard features and limited storage.",
                buttonText: "Choose Basic",
                variant: "outlined",
              },
              {
                title: "Pro",
                price: "$10 / month",
                description:
                  "Unlimited flashcards and storage with priority support.",
                buttonText: "Choose Pro",
                variant: "contained",
              },
            ].map((plan, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                >
                  <Box
                    sx={{
                      p: 4,
                      border: "1px solid #333",
                      borderRadius: "24px",
                      backgroundColor: "rgba(36, 36, 36, 0.95)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography variant="h5" sx={{ mb: 2, color: "#1DB954" }}>
                        {plan.title}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        {plan.price}
                      </Typography>
                      <Typography color="#b0bec5" sx={{ mb: 3 }}>
                        {plan.description}
                      </Typography>
                    </div>
                    <Button
                      variant={plan.variant}
                      sx={{
                        mt: 2,
                        backgroundColor:
                          plan.variant === "contained"
                            ? "#1DB954"
                            : "transparent",
                        color:
                          plan.variant === "contained" ? "white" : "#1DB954",
                        borderColor: "#1DB954",
                        "&:hover": {
                          backgroundColor:
                            plan.variant === "contained"
                              ? "#1aa34a"
                              : "rgba(29, 185, 84, 0.1)",
                          borderColor: "#1aa34a",
                        },
                        borderRadius: "20px",
                      }}
                      onClick={plan.title === "Pro" ? handleSubmit : undefined}
                    >
                      {plan.buttonText}
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
