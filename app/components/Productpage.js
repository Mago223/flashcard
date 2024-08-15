'use client';
import { UserButton } from "@clerk/nextjs";
import { Container, Typography, Box, Button, Card, CardActionArea, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProductPage() {
  const [currentPlan, setCurrentPlan] = useState('');
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    // TODO:
    // Fetch current plan in async function
    const plan = '';
    setCurrentPlan(plan)

    // TODO:
    // Call async function
  }, []);

  const handlePlanChange = async (newPlan) => {
    try {
      // TODO:
      // update plan via API
      setCurrentPlan(newPlan);
      alert('Plan updated successfully');
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    }
  };

  return (
    <Container 
      maxWidth="100vw"
      sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', p: 2 }}
    >
        <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            p={2}
            sx={{ boxShadow: 1, borderRadius: 1 }}
        >
            {/* Company Name */}
            <Typography variant="h6" fontWeight='bold'>
                Flashcard SaaS
            </Typography>
            <UserButton showName/>
        </Box>
        
        {/* Navigation content */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome to the Flashcard SaaS Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Manage and create your flashcards with ease.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 1, px: 3, py: 1.5 }}
              onClick={() => handleNavigation('/flashcards')}
            >
              My Flashcards
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 1, px: 3, py: 1.5 }}
              onClick={() => handleNavigation('/generate')}
            >
              Generate Flashcards
            </Button>
          </Box>
        </Box>

        {/* Plan Management */}
        <Box
          sx={{ mt: 4, textAlign: 'center' }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your Current Plan: {currentPlan}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Choose a new plan:
          </Typography>
          <Box
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2
            }}
          >
            <Card 
              sx={{ 
                maxWidth: 345, 
                borderRadius: 2, 
                boxShadow: 3,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              <CardActionArea onClick={() => handlePlanChange('Basic')}>
                <CardContent>
                  <Typography variant="h6">Basic Plan</Typography>
                  <Typography variant="body2">$5 / month</Typography>
                  <Typography variant="body2">Access to basic features</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card 
              sx={{ 
                maxWidth: 345, 
                borderRadius: 2, 
                boxShadow: 3,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              <CardActionArea>
                <CardContent onClick={() => handlePlanChange('Pro')}>
                  <Typography variant="h6">Pro Plan</Typography>
                  <Typography variant="body2">$10 / month</Typography>
                  <Typography variant="body2">Unlimited features with priority support</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      
    </Container>
  );
}