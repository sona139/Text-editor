import { Button, LegacyCard, Tag, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";

const TextFilter = ({ tagName, toggleIsShowPopoverSave, handleChangeTabs }) => {
	const [value, setValue] = useState("");

	const handleChangeValue = useCallback((value) => {
		setValue(value);
	}, []);

	return (
		<LegacyCard sectioned>
			{tagName.trim() && (
				<div style={{ marginBottom: 10 }}>
					<Tag>Visibility is {tagName}</Tag>
				</div>
			)}

			<TextField
				label="Save as"
				value={value}
				onChange={handleChangeValue}
				placeholder="Ready to publish, work in progess"
				helpText="Filters are saved as a new tab at the top of this list."
			/>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					gap: 8,
					marginTop: 12,
				}}
			>
				<Button onClick={toggleIsShowPopoverSave}>Cancel</Button>
				<Button
					primary
					disabled={!value.trim()}
					// onClick={() => handleChangeTabs({ id: value, content: value })}
				>
					Save filters
				</Button>
			</div>
		</LegacyCard>
	);
};

export default TextFilter;
