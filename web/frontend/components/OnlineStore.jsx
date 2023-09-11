import { LegacyCard, Select } from "@shopify/polaris";

const options = [
	{ label: "Default page", value: "default" },
	{ label: "contact", value: "contact" },
];

const OnlineStore = ({ theme, handelChangeTheme }) => {
	return (
		<LegacyCard sectioned title="Online store">
			<Select
				label="Theme template"
				options={options}
				value={theme}
				onChange={handelChangeTheme}
			/>
			<p style={{ marginTop: 16 }}>
				Assign a template from your current theme to define how the page is
				displayed.
			</p>
		</LegacyCard>
	);
};

export default OnlineStore;
