import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				backgroundColor: "#f8f8f8",
				textAlign: "center",
			}}
		>
			<Typography variant="body2" color="textSecondary">
				&copy; {new Date().getFullYear()} All rights reserved.
			</Typography>
		</Box>
	);
};

export default Footer;
