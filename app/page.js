import Link from 'next/link';
import backgroundImage from './images/study_flashcards_people_cartoon_xl_1024.png';
import { Box, Typography, Container, Button } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to My Page
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
  );
}
