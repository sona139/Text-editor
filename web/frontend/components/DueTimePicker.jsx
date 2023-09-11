import { Button, OptionList, Popover } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { ranges } from "../utils/ranges";
import { ClockMajor } from "@shopify/polaris-icons";

const DueTimePicker = ({ time, handleChangeTime }) => {
	const [isActive, setIsActive] = useState(false);

	// Handle toggle active popover
	const togglePopover = useCallback(() => {
		setIsActive((prev) => !prev);
	}, []);

	// Handle close popover
	const handleClosePopover = useCallback(() => {
		setIsActive(false);
	}, []);

	useEffect(() => {
		handleChangeTime([ranges[0].alias]);
	}, []);

	return (
		<div style={{ padding: "0 4px" }}>
			<Popover
				active={isActive}
				autofocusTarget="none"
				preferredAlignment="left"
				fullWidth
				preferInputActivator={false}
				preferredPosition="below"
				preventCloseOnChildOverlayClick
				onClose={handleClosePopover}
				activator={
					<Button
						icon={ClockMajor}
						fullWidth
						onClick={togglePopover}
						textAlign="left"
					>
						<p style={{ marginLeft: 4 }}>{time.title}</p>
					</Button>
				}
			>
				<OptionList
					options={ranges.map((range) => ({
						label: range.title,
						value: range.alias,
					}))}
					selected={time.alias}
					onChange={(value) => {
						handleChangeTime(value);
						handleClosePopover();
					}}
				/>
			</Popover>
		</div>
	);
};

export default DueTimePicker;
