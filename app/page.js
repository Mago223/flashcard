'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session",{
      method: "POST",
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJSON = await checkoutSession.json();

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSessionJSON.message);
    }

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id,
    });

    if (error){
      console.warn(error.message);
    }
  }
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign: "center",
        my: 4,
      }}>
        <Typography variant="h2" gutterbottom>Welcome to Flashcards!</Typography>
        <Typography variant="h5" gutterbottom>The easiest way to make flashcards from scratch</Typography>
        <Button variant="contained" color="primary" sx={{mt: 2}}>Get Started</Button>
      </Box>
      <Box sx={{my: 6}}>
        <Typography variant="h4" gutterbottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterbottom>Easy text input</Typography>
            <Typography>Just type in your text and we'll do the rest</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterbottom>Smart Flashcards</Typography>
            <Typography>Our AI intelligently breaks down your text into concise flashcards,
              perfect for studying
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} gutterbottom>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterbottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5" gutterbottom>Basic</Typography>
              <Typography variant="h6" gutterbottom>$5 / month</Typography>
              <Typography>Access to basic flashcard features and limited storage</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5" gutterbottom>Pro</Typography>
              <Typography variant="h6" gutterbottom>$10 / month</Typography>
              <Typography>Unlimited flashcards and storage with priority support</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
