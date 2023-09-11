import { LegacyCard, Text, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { parserHTML } from "../utils/parserHTML";
import { getUrlFromTitle } from "../utils/getUrlFromTitle";

const SearchEngine = ({
	title,
	content,
	titleSEO,
	handleChangeTitleSEO,
	contentSEO,
	handleChangeContentSEO,
	urlSEO,
	handleChangeUrlSEO,
}) => {
	const [isEditSEO, setIsEditSEO] = useState(false);

	const handleChangeEditSEO = useCallback((value) => setIsEditSEO(value));
	return (
		<LegacyCard
			sectioned
			title="Search engine listing preview"
			actions={[
				!isEditSEO && {
					content: "Edit website SEO",
					onAction: () => handleChangeEditSEO(true),
				},
			]}
		>
			<div style={{ paddingBottom: 12 }}>
				{(!title.trim() && !titleSEO.trim()) ||
				(!parserHTML(content).trim() && !contentSEO.trim()) ? (
					`Add
				${
					!title.trim() && !titleSEO.trim()
						? " title "
						: !parserHTML(content).trim() &&
						  !contentSEO.trim() &&
						  " description "
				}
				to see how this Page might appear in a search engine listing`
				) : (
					<div>
						<p style={{ fontSize: "16px", color: "#1a0dab" }}>
							{titleSEO || title}
						</p>
						<Text color="success" as="h6">
							{"https://sona139.myshopify.com/pages/" +
								(urlSEO || getUrlFromTitle(title))}
						</Text>
						<p style={{ fontSize: "13px" }}>
							{contentSEO || parserHTML(content)}
						</p>
					</div>
				)}
			</div>

			{isEditSEO && (
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					<TextField
						label="Page title"
						value={titleSEO}
						onChange={handleChangeTitleSEO}
						placeholder={title}
						helpText={titleSEO.length + " of 70 characters used"}
					/>
					<TextField
						label="Description"
						value={contentSEO || content}
						onChange={handleChangeContentSEO}
						helpText={contentSEO.length + " of 320 characters used"}
					/>
					<div style={{ fontSize: "12px" }}>
						<TextField
							label="URL and handle"
							prefix="https://sona139.myshopify.com/pages/"
							value={urlSEO}
							onChange={handleChangeUrlSEO}
							placeholder={getUrlFromTitle(title)}
						/>
					</div>
				</div>
			)}
		</LegacyCard>
	);
};

export default SearchEngine;
