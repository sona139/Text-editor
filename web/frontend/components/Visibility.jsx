import { Button, ChoiceList, LegacyCard } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { getDateVisible } from "../utils/getDateVisible";
import DueDatePicker from "./DueDatePicker";
import DueTimePicker from "./DueTimePicker";

const Visibility = ({
	visibility,
	handleChangeVisibility,
	isSetDate,
	handleChangeIsSetDate,
	dateVisibility,
	handleChangeDateVisibility,
	time,
	handleChangeTime,
}) => {
	return (
		<LegacyCard title="Visibility" sectioned>
			<ChoiceList
				choices={[
					{
						label: "Visible",
						value: "visible",
					},
					{ label: "Hidden", value: "hidden" },
				]}
				selected={visibility}
				onChange={handleChangeVisibility}
			/>
			<div style={{ marginTop: 16 }}>
				{isSetDate && (
					<div>
						<DueDatePicker
							dateVisibility={dateVisibility}
							handleChangeDateVisibility={handleChangeDateVisibility}
						/>
						<DueTimePicker time={time} handleChangeTime={handleChangeTime} />
					</div>
				)}
				<Button
					plain
					onClick={() => {
						handleChangeIsSetDate();
						handleChangeVisibility(["hidden"]);
					}}
				>
					{isSetDate ? "Clear date..." : "Set visibility date"}
				</Button>
			</div>
		</LegacyCard>
	);
};

export default Visibility;
