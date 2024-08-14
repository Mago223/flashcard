import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { UserButton } from "@clerk/nextjs";
import { Container, Typography, Box } from "@mui/material";

export default function ProductPage() {
  return (
    <Container maxWidth="100vw">
        <Box
            display='flex'
            justifyContent='space-between'
            p={2}
        >
            {/* Company Name */}
            <Typography variant="h6">
                Flashcard SaaS
            </Typography>
            <UserButton showName/>
        </Box>
        
        {/* Rest of content */}
      
    </Container>
  );
}