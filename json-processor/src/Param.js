import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
	Button,
	Box,
	TextField,
	Grid,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DropZone from "./DropZone";

const Param = () => {
	const [data, setData] = useState([
		{
			name: "common",
			help: "Common parameters",
			params: [
				{
					name: "name",
					default: "John Doe",
					optional: true,
					type: "string",
					help: "The full name of the person.",
				},
				{
					name: "age",
					default: "30",
					optional: false,
					type: "int",
					help: "The age of the person in years.",
				},
				{
					name: "city",
					default: "New York",
					optional: true,
					type: "string",
					help: "The city where the person resides.",
				},
			],
		},
	]);

	const [groupName, setGroupName] = useState("");
	const [openDialog, setOpenDialog] = useState(false);

	const handleAddBox = () => {
		const newGroupName = groupName || `New Group ${data.length + 1}`;
		const isGroupNameExists = data.some((group) => group.name === newGroupName);

		if (!isGroupNameExists) {
			setData((prevItems) => [
				...prevItems,
				{ name: newGroupName, help: "", params: [] },
			]);
			setGroupName("");
		} else {
			alert("Box name already exists.");
		}
	};

	const handleGroupChange = (event, field, index) => {
		const newValue = event.target.value;
		setData((prevItems) => {
			if (field === "name") {
				const nameExists = prevItems.some(
					(group, i) => group.name === newValue && i !== index
				);
				if (nameExists) {
					alert("Name already exists. Please choose a different name.");
					return prevItems;
				}
			}
			return prevItems.map((group, i) =>
				i === index ? { ...group, [field]: newValue } : group
			);
		});
	};

	const handleDropToZone = (item, zone) => {
		setData((prevItems) => {
			const updatedItems = prevItems.map((group) => {
				if (group.name === zone.name) {
					return {
						...group,
						params: [...group.params, item],
					};
				}
				return {
					...group,
					params: group.params.filter((param) => param.name !== item.name),
				};
			});
			return updatedItems;
		});
	};

	const handleParamChange = (groupName, index, field, event) => {
		const { value, checked, type } = event.target;

		setData((prevItems) =>
			prevItems.map((group) =>
				group.name === groupName
					? {
							...group,
							params: group.params.map((param, i) =>
								i === index
									? { ...param, [field]: type === "checkbox" ? checked : value }
									: param
							),
					  }
					: group
			)
		);
	};

	const handleExportJson = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleCopyToClipboard = () => {
		const json = JSON.stringify(
			data.filter((group) => group.params.length > 0),
			null,
			2
		);
		navigator.clipboard.writeText(json).then(() => {
			alert("JSON copied to clipboard!");
		});
	};

	const handleDownloadJson = () => {
		const json = JSON.stringify(
			data.filter((group) => group.params.length > 0),
			null,
			2
		);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "data.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<>
			<Grid
				container
				spacing={2}
				direction="column"
				justifyContent="center"
				alignItems="center"
			>
				<Grid
					container
					item
					spacing={2}
					justifyContent="center"
					alignItems="center"
				>
					<Grid item>
						<Button variant="contained" onClick={handleAddBox}>
							Add Group
						</Button>
					</Grid>
					<Grid item>
						<Button variant="contained" onClick={handleExportJson}>
							Export JSON
						</Button>
					</Grid>
				</Grid>

				{data.map((group, index) => (
					<Grid item key={group.name} xs={12} sm={12}>
						<DndProvider backend={HTML5Backend}>
							<Box>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={2}>
												<TextField
													label="Group name"
													variant="outlined"
													fullWidth
													value={group.name}
													InputProps={{
														style: { fontSize: "12px" },
													}}
													onChange={(event) =>
														handleGroupChange(event, "name", index)
													}
												/>
											</Grid>
											<Grid item xs={12} sm={10}>
												<TextField
													label="Description"
													variant="outlined"
													fullWidth
													value={group.help}
													InputProps={{
														style: { fontSize: "12px" },
													}}
													onChange={(event) =>
														handleGroupChange(event, "help", index)
													}
												/>
											</Grid>
										</Grid>
									</AccordionSummary>
									<AccordionDetails>
										<DropZone
											data={data}
											group={group}
											onDrop={(item) => handleDropToZone(item, group)}
											handleParamChange={(index, field, event) =>
												handleParamChange(group.name, index, field, event)
											}
										/>
									</AccordionDetails>
								</Accordion>
							</Box>
						</DndProvider>
					</Grid>
				))}
			</Grid>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle
					sx={{
						backgroundColor: "info.main",
						color: "white",
						textAlign: "center",
						marginBottom: 2,
					}}
				>
					FINAL JSON
				</DialogTitle>
				<DialogContent>
					<Paper
						elevation={3}
						sx={{ padding: "10px", maxHeight: "60vh", overflow: "auto" }}
					>
						<Box
							component="pre"
							sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
						>
							{JSON.stringify(
								data.filter((group) => group.params.length > 0),
								null,
								2
							)}
						</Box>
					</Paper>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Close
					</Button>
					<Button onClick={handleCopyToClipboard} color="secondary">
						Copy to Clipboard
					</Button>
					<Button onClick={handleDownloadJson} color="secondary">
						Download JSON
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Param;
