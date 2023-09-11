import { Page } from "@shopify/polaris";
import Pages from "../components/Pages";

const Home = () => {
	return (
		<Page
			fullWidth
			title="Pages"
			primaryAction={{ content: "Add page", url: "/new" }}
		>
			<Pages />
		</Page>
	);
};

export default Home;
