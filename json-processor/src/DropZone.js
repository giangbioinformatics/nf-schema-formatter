import React from "react";
import { useDrop } from "react-dnd";
import { Paper, Typography } from "@mui/material";
import DragItem from "./DragItem";

const ItemType = "ITEM";

const DropZone = ({ group, onDrop, handleParamChange, handleSelectParam }) => {
	const [, drop] = useDrop(
		() => ({
			accept: ItemType,
			drop: (draggedItem) => onDrop(draggedItem),
		}),
		[group]
	);

	return (
		<Paper
			ref={drop}
			elevation={2}
			sx={{
				width: "95vw",
				padding: "10px",
				borderRadius: "8px",
				backgroundColor: "lightgrey",
			}}
		>
			{group.params && group.params.length > 0 ? (
				group.params.map((param, index) => (
					<DragItem
						group={group}
						index={index}
						param={param}
						handleParamChange={(index, field, event) =>
							handleParamChange(index, field, event)
						}
						handleSelectParam={handleSelectParam}
					/>
				))
			) : (
				<Typography variant="body1" color="textSecondary">
					No items available. Drag and drop items here.
				</Typography>
			)}
		</Paper>
	);
};

export default DropZone;
