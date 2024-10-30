import React, { useState, useEffect } from "react";
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
	Snackbar,
	Alert,
	Select,
	MenuItem,
	ListItemText,
	InputLabel,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DropZone from "./DropZone";

const Param = () => {
	const [data, setData] = useState([]);
	const [group, selectGroup] = useState("");
	const [param, selectParam] = useState([]);

	const [groupName, setGroupName] = useState("");
	const [openDialogAddParamToGroup, setOpenDialogAddParamToGroup] =
		useState(false);
	const [openDialogExportJson, setOpenDialogExportJson] = useState(false);

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
			return prevItems.map((group, i) =>
				i === index ? { ...group, [field]: newValue } : group
			);
		});
	};

	const handleImportJson = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const importedData = JSON.parse(e.target.result);
				console.log(importedData);
				setData([importedData]);
			};
			reader.readAsText(file);
		}
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

	const handleSelectParam = (event) => {
		const { value } = event.target;
		const paramObjs = data.map((group) => group.params).flat();
		const foundParam = paramObjs.find((par) => par.name === value);
		if (!foundParam) return;
		if (param.some((item) => item.name === foundParam.name)) {
			selectParam(param.filter((item) => item.name !== foundParam.name));
		} else {
			selectParam([...param, foundParam]);
		}
	};

	const handleRemoveAllSelectParam = () => {
		selectParam([]);
	};

	const handleExportJson = () => {
		setOpenDialogExportJson(true);
	};

	const handleCloseDialogExportJson = () => {
		setOpenDialogExportJson(false);
	};

	const handleOpenDialogParamToGroup = () => {
		setOpenDialogAddParamToGroup((prevState) => !prevState);
	};

	const handleAddParamToGroup = () => {
		setOpenDialogAddParamToGroup((prevState) => !prevState);
		setData((prevItems) =>
			prevItems.map((l_group) =>
				l_group.name === group
					? { ...l_group, params: param }
					: {
							...l_group,
							params: l_group.params.filter((item) => !param.includes(item)),
					  }
			)
		);
		selectParam([]);
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
						<Button variant="contained" component="label">
							Import JSON
							<input
								type="file"
								hidden
								accept=".json"
								onChange={handleImportJson}
							/>
						</Button>
					</Grid>
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
					{param.length > 0 && (
						<>
							<Grid item>
								<Button
									variant="contained"
									color="info"
									onClick={setOpenDialogAddParamToGroup}
								>
									Add to Group
								</Button>
							</Grid>

							<Grid item>
								<Button
									variant="contained"
									color="error"
									onClick={handleRemoveAllSelectParam}
								>
									Unselect All
								</Button>
							</Grid>
							<Grid item>
								<Button variant="contained" color="error">
									Delete
								</Button>
							</Grid>
							<Snackbar
								anchorOrigin={{
									vertical: "top",
									horizontal: "center",
								}}
								open={true}
								sx={{
									marginTop: "-15px",
								}}
							>
								<Alert severity="success" sx={{ width: "300px" }}>
									{param.length} Selected
								</Alert>
							</Snackbar>
						</>
					)}
				</Grid>

				{data.map((group, index) => (
					<Grid item key={group} xs={12} sm={12}>
						<DndProvider backend={HTML5Backend}>
							<Box>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={2}>
												<TextField
													label="Group"
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
											handleSelectParam={handleSelectParam}
										/>
									</AccordionDetails>
								</Accordion>
							</Box>
						</DndProvider>
					</Grid>
				))}
			</Grid>
			{/* Dialog for select group to add  */}
			<Dialog
				open={openDialogAddParamToGroup}
				onClose={handleOpenDialogParamToGroup}
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
					SELECT GROUP TO ADD
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
							{param.length > 0 && (
								<Grid item xs={12} sm={12}>
									<InputLabel htmlFor="provider">Storage</InputLabel>
									<Select
										labelId="provider-label"
										id="group"
										name="group"
										value={group}
										onChange={(e) => selectGroup(e.target.value)}
										fullWidth
									>
										{data.map((prov) => (
											<MenuItem key={prov.name} value={prov.name}>
												<ListItemText primary={prov.name} />
											</MenuItem>
										))}
									</Select>
								</Grid>
							)}
						</Box>
					</Paper>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={handleAddParamToGroup}
						color="primary"
					>
						Add
					</Button>
					<Button
						variant="contained"
						onClick={handleOpenDialogParamToGroup}
						color="error"
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			{/* Dialog for export json */}
			<Dialog
				open={openDialogExportJson}
				onClose={handleCloseDialogExportJson}
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
					<Button onClick={handleCloseDialogExportJson} color="primary">
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
