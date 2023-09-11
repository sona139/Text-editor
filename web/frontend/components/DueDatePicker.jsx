import { useCallback, useEffect, useState } from "react";
import {
	Box,
	Card,
	DatePicker,
	Icon,
	LegacyCard,
	Popover,
	TextField,
	VerticalStack,
} from "@shopify/polaris";
import { CalendarMinor } from "@shopify/polaris-icons";

const DueDatePicker = ({ dateVisibility, handleChangeDateVisibility }) => {
	const [isActive, setIsActive] = useState(false);

	const [{ month, year }, setDate] = useState({
		month: dateVisibility.getMonth(),
		year: dateVisibility.getFullYear(),
	});
	const formattedValue = dateVisibility.toISOString().slice(0, 10);

	// Handle close popover
	const handleClosePopover = useCallback(() => {
		setIsActive(false);
	}, []);

	// Handle change month of date hidden
	const handleChangeDate = useCallback((month, year) => {
		setDate({ month, year });
	}, []);

	// Handle selection date hidden
	const handleSelectionDate = useCallback(({ end: newDate }) => {
		handleChangeDateVisibility(newDate);
		setIsActive(false);
	}, []);

	useEffect(() => {
		handleChangeDateVisibility(new Date());
	}, []);

	useEffect(() => {
		if (dateVisibility) {
			setDate({
				month: dateVisibility.getMonth(),
				year: dateVisibility.getFullYear(),
			});
		}
	}, [dateVisibility]);

	return (
		<VerticalStack inlineAlign="center" gap={4}>
			<Box minWidth="276px" padding={{ xs: 2 }}>
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
						<TextField
							role="combobox"
							label={"Visibility date"}
							prefix={<Icon source={CalendarMinor} />}
							value={formattedValue}
							onFocus={() => setIsActive(true)}
							onChange={handleChangeDateVisibility}
							autoComplete="off"
						/>
					}
				>
					<LegacyCard>
						<DatePicker
							month={month}
							year={year}
							selected={dateVisibility}
							onMonthChange={handleChangeDate}
							onChange={handleSelectionDate}
						/>
					</LegacyCard>
				</Popover>
			</Box>
		</VerticalStack>
	);
};

export default DueDatePicker;
