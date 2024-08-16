"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Spinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#121212", // Dark background to match the theme
        color: "white",
      }}
    >
      <Box
        bgcolor="#242424" // Dark background for the spinner container
        borderRadius="24px"
        p={4}
        sx={{
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.5)", // Darker shadow
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#1DB954", // Use the primary color from the theme
          }}
        />
      </Box>
    </Box>
  );
};

export default Spinner;
