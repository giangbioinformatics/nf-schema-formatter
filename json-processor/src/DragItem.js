import React from "react";
import { useDrag } from "react-dnd";
import {
	Paper,
	TextField,
	Grid,
	MenuItem,
	Checkbox,
	FormControlLabel,
} from "@mui/material";

const ItemType = "ITEM";
const typeOptions = ["string", "int", "boolean", "folder", "file"];
const DragItem = ({
	group,
	index,
	param,
	handleParamChange,
	handleSelectParam,
}) => {
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: ItemType,
			item: param,
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[group]
	);

	return (
		<Paper
			ref={drag}
			elevation={2}
			sx={{
				padding: "20px",
				borderRadius: "8px",
				marginTop: "10px",
				backgroundColor: isDragging ? "lightgreen" : "white",
				opacity: isDragging ? 0.5 : 1,
				cursor: "move",
			}}
		>
			<React.Fragment key={param.key}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={1}>
						<TextField
							label="Name"
							variant="outlined"
							fullWidth
							value={param.name}
							onChange={(e) => handleParamChange(index, "name", e)}
							InputProps={{
								style: { fontSize: "12px" },
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={0.5}>
						<Grid item>
							<span
								style={{
									fontSize: "0.75rem",
									color: "gray",
									display: "block",
									marginTop: "-8px",
								}}
							>
								Required
							</span>
							<FormControlLabel
								control={
									<Checkbox
										checked={param.required || false}
										onChange={(e) => handleParamChange(index, "required", e)}
									/>
								}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={1}>
						<TextField
							label="Default"
							variant="outlined"
							fullWidth
							value={param.default || false}
							onChange={(e) => handleParamChange(index, "default", e)}
							InputProps={{
								style: { fontSize: "12px" },
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={1} height="small">
						<TextField
							select
							label="Type"
							variant="outlined"
							fullWidth
							value={param.type}
							onChange={(e) => handleParamChange(index, "type", e)}
							InputProps={{
								style: { fontSize: "12px" },
							}}
						>
							{typeOptions.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField
							label="Description"
							variant="outlined"
							fullWidth
							value={param.help}
							onChange={(e) => handleParamChange(index, "help", e)}
							InputProps={{
								style: { fontSize: "12px" },
							}}
						/>
					</Grid>

					<Grid item xs={12} sm={0.25}>
						<Grid item>
							<span
								style={{
									fontSize: "0.75rem",
									color: "gray",
									marginTop: "-8px",
									display: "block",
								}}
							>
								Select
							</span>
							<FormControlLabel
								control={
									<Checkbox
										value={param.name}
										onChange={(e) => handleSelectParam(e)}
									/>
								}
							/>
						</Grid>
					</Grid>
				</Grid>
			</React.Fragment>
		</Paper>
	);
};

export default DragItem;
