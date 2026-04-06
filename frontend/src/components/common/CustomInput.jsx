import { TextField } from "@mui/material";

const CustomInput = ({ label, ...props }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      variant="outlined"
      {...props}
    />
  );
};

export default CustomInput;