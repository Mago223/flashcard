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
        background:
          "linear-gradient(179.4deg, rgb(253, 240, 233) 2.2%, rgb(255, 194, 203) 96.2%)",
      }}
    >
      <Box
        bgcolor="rgba(255, 255, 255, 0.9)"
        borderRadius="24px"
        p={4}
        sx={{
          boxShadow: "0px 8px 30px rgba(244, 141, 180, 0.2)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#f48db4",
          }}
        />
      </Box>
    </Box>
  );
};

export default Spinner;
