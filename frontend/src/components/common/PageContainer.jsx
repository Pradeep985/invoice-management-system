import { Box, Typography } from "@mui/material";

const PageContainer = ({ title, children }) => {
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default PageContainer;