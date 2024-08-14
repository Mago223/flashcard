'use client';
import Link from 'next/link';
import getStripe from "@/utils/get-stripe";
import backgroundImage from './../images/study_flashcards_people_cartoon_xl_1024.png';
import { Box, Typography, Container, Button, Grid } from '@mui/material';

export default function LandingPage() {
    const handleSubmit = async () => {
        const checkoutSession = await fetch("/api/checkout_session",{
            method: "POST",
            headers: {
                origin: 'http://localhost:3000',
            },
        });

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
        <Box>
            {/* Background Image Container */}
            <Box
                sx={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                }}
            >
                {/* Gradient Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))',
                        zIndex: 1,
                    }}
                />

                {/* Centered Content */}
                <Container
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        color: 'white',
                        padding: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                        Welcome to AI Generated Flashcards!
                    </Typography>
                    <Typography variant='h6' component='h1' sx={{ mb: 4 }}>
                        The easiest way to make flashcards from scratch!
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Link href="/sign-up" passHref>
                            <Button variant="contained" sx={{ mx: 1 }}>
                                Sign Up
                            </Button>
                        </Link>
                        <Link href="/sign-in" passHref>
                            <Button variant="contained" sx={{ mx: 1 }}>
                                Sign In
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Box>

            {/* Additional Content */}
            <Box
                sx={{
                    padding: 4,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                {/* <Container> */}
                <Box sx={{ my: 6 }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Easy text input</Typography>
                            <Typography>Just type in your text and we&apos;ll do the rest</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Smart Flashcards</Typography>
                            <Typography>Our AI intelligently breaks down your text into concise flashcards,
                            perfect for studying
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Accessible Anywhere</Typography>
                            <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
                        </Grid>
                    </Grid>
                </Box>
                {/* </Container> */}
                <Box sx={{ my: 6, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>Pricing</Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box 
                                sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2 }}>Basic</Typography>
                                <Typography variant="h6" sx={{ mb: 2 }}>$5 / month</Typography>
                                <Typography>Access to basic flashcard features and limited storage</Typography>
                                <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box 
                                sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2 }}>Pro</Typography>
                                <Typography variant="h6" sx={{ mb: 2 }}>$10 / month</Typography>
                                <Typography>Unlimited flashcards and storage with priority support</Typography>
                                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}