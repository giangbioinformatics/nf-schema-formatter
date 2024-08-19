import { Typography } from "@mui/material";
import React from "react";

const XTypography = () => {
	return (
		<Typography
			variant="h4"
			style={{
				fontFamily: "Pacifico",
				textTransform: "uppercase",
				display: "flex",
				justifyContent: "center",
				marginTop: "20px",
			}}
		>
			RIVER
			<span
				style={{
					marginLeft: "5px",
					marginRight: "20px",
					borderBottom: "2px solid #fff",
					paddingBottom: "2px",
				}}
			></span>
		</Typography>
	);
};

export default XTypography;
