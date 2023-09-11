import {
	ActionList,
	Button,
	ButtonGroup,
	ColorPicker,
	LegacyCard,
	Popover,
	Tabs,
	Text,
	TextField,
	Tooltip,
} from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";
import { TypeMinor } from "@shopify/polaris-icons";
import {
	FaAlignLeft,
	FaBold,
	FaIndent,
	FaItalic,
	FaListOl,
	FaListUl,
	FaOutdent,
	FaUnderline,
} from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";
import { tabColors } from "../utils/tabsColor";
import convertHSL from "../utils/convertHSL";

const ContentFormater = ({ content = "", handleChangeContent }) => {
	const textEditorRef = useRef();

	const [isActiveHeading, setIsActiveHeading] = useState(false);
	const [isActiveAlign, setIsActiveAlign] = useState(false);

	const [isActivePickColor, setIsActivePickColor] = useState(false);
	const [tabColor, setTabColor] = useState(0);

	const [color, setColor] = useState({
		hue: 120,
		brightness: 1,
		saturation: 1,
	});

	const [bgColor, setBgColor] = useState({
		hue: 120,
		brightness: 1,
		saturation: 1,
	});

	useEffect(() => {
		if (!textEditorRef.current.innerHTML) {
			textEditorRef.current.innerHTML = content;
		}
	}, [content]);

	const handleEditor = (tag) => {
		const range = getSelection().getRangeAt(0).cloneRange();

		const element = document.createElement("customize-tag");

		element.appendChild(range.extractContents());
		range.insertNode(element);

		let text = textEditorRef.current.innerHTML;
		let contentElement = element.outerHTML;

		const customizeTagRegex = /<(\/?)customize-tag>/g;
		const tagRegex = new RegExp(`<(\/?)${tag}>`, "g");
		const duplicateTagRegex = /<(\/?)(strong|i|u)><(\/?)\2>/g;

		// Find parent element with simalar tag
		let parentSelectedElement = element.parentElement;

		while (
			parentSelectedElement?.tagName !== "DIV" &&
			parentSelectedElement?.tagName !== tag.toUpperCase()
		) {
			parentSelectedElement = parentSelectedElement.parentElement;
		}

		// console.log(parentSelectedElement?.outerHTML);

		if (parentSelectedElement?.tagName === tag.toUpperCase()) {
			// Remove tag content
			text = text.replace(contentElement, `</${tag}>${contentElement}<${tag}>`);
		} else {
			// Remove all ${tag} tag in selected text
			const newContentElement = contentElement.replace(tagRegex, "");
			text = text.replace(
				contentElement,
				`<${tag}>${newContentElement}</${tag}>`
			);
		}

		// Remove tag customize
		text = text.replace(customizeTagRegex, "");

		// Remove duplicate tag
		text = text.replace(duplicateTagRegex, "");

		textEditorRef.current.innerHTML = text;
		handleChangeContent(text);
	};

	const handleCommand = useCallback((command, value = null) => {
		document.execCommand(command, false, value);

		setTimeout(() => {
			handleChangeContent(textEditorRef.current.innerHTML);
		}, 0);
	}, []);

	const toggleHeading = useCallback(() => {
		setIsActiveHeading((prev) => !prev);
	}, []);

	const toggleAlign = useCallback(() => {
		setIsActiveAlign((prev) => !prev);
	}, []);

	const togglePickColor = useCallback(() => {
		setIsActivePickColor((prev) => !prev);
	}, []);

	const handleChangeTab = useCallback((value) => {
		setTabColor(value);
	}, []);

	const activatorHeading = (
		<Tooltip content="Formatting" dismissOnMouseOut>
			<Button icon={TypeMinor} onClick={toggleHeading} disclosure />
		</Tooltip>
	);

	const activatorAlign = (
		<Tooltip content="Alignment" dismissOnMouseOut>
			<Button icon={<FaAlignLeft />} onClick={toggleAlign} disclosure />
		</Tooltip>
	);

	const activatorPickColor = (
		<Tooltip content="Color" dismissOnMouseOut>
			<Button
				icon={<MdFormatColorText />}
				onClick={togglePickColor}
				disclosure
			/>
		</Tooltip>
	);

	return (
		<div style={{ marginTop: 16 }}>
			<Text>Content</Text>
			<LegacyCard>
				<div
					style={{
						marginTop: 5,
						padding: 8,
						backgroundColor: "#f7f7f7",
						border: "1px solid #ccc",
						borderTopLeftRadius: 5,
						borderTopRightRadius: 5,
						borderBottomWidth: 0,
						display: "flex",
						gap: 5,
					}}
				>
					<ButtonGroup segmented>
						<div>
							<Popover
								active={isActiveHeading}
								activator={activatorHeading}
								autofocusTarget="first-node"
								onClose={toggleHeading}
							>
								<ActionList
									actionRole="menuitem"
									items={[
										{
											content: "Paragraph",
											onAction: () => {
												handleCommand("formatBlock", "p");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 1",
											onAction: () => {
												handleCommand("formatBlock", "h1");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 2",
											onAction: () => {
												handleCommand("formatBlock", "h2");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 3",
											onAction: () => {
												handleCommand("formatBlock", "h3");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 4",
											onAction: () => {
												handleCommand("formatBlock", "h4");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 5",
											onAction: () => {
												handleCommand("formatBlock", "h5");
												toggleHeading(false);
											},
										},
										{
											content: "Heading 6",
											onAction: () => {
												handleCommand("formatBlock", "h6");
												toggleHeading(false);
											},
										},
									]}
								/>
							</Popover>
						</div>
						<Tooltip content="Bold">
							<Button
								icon={FaBold}
								onClick={() => handleEditor("strong")}
							></Button>
						</Tooltip>
						<Tooltip content="Italic">
							<Button
								icon={FaItalic}
								onClick={() => handleEditor("i")}
							></Button>
						</Tooltip>
						<Tooltip content="Underline">
							<Button
								icon={FaUnderline}
								onClick={() => handleEditor("u")}
							></Button>
						</Tooltip>
					</ButtonGroup>

					<ButtonGroup segmented>
						<Tooltip content="Bulleted list" dismissOnMouseOut>
							<Button
								icon={<FaListUl />}
								onClick={() => handleCommand("insertOrderedList")}
							/>
						</Tooltip>

						<Tooltip content="Numbered list" dismissOnMouseOut>
							<Button
								icon={<FaListOl />}
								onClick={() => handleCommand("insertUnorderedList")}
							/>
						</Tooltip>

						<Tooltip content="Outdent" dismissOnMouseOut>
							<Button
								icon={<FaOutdent />}
								onClick={() => handleCommand("outdent")}
							/>
						</Tooltip>

						<Tooltip content="Indent" dismissOnMouseOut>
							<Button
								icon={<FaIndent />}
								onClick={() => handleCommand("indent")}
							/>
						</Tooltip>
					</ButtonGroup>

					<ButtonGroup segmented>
						<div>
							<Popover
								active={isActiveAlign}
								activator={activatorAlign}
								autofocusTarget="first-node"
								onClose={toggleAlign}
							>
								<ActionList
									actionRole="menuitem"
									items={[
										{
											content: "Left align",
											onAction: () => handleCommand("justifyLeft"),
										},
										{
											content: "Center align",
											onAction: () => handleCommand("justifyCenter"),
										},
										{
											content: "Right align",
											onAction: () => handleCommand("justifyRight"),
										},
									]}
								/>
							</Popover>
						</div>
						<div>
							<Popover
								active={isActivePickColor}
								activator={activatorPickColor}
								autofocusTarget="first-node"
								onClose={togglePickColor}
							>
								<div
									style={{
										width: "220px",
									}}
								>
									<Tabs
										tabs={tabColors}
										selected={tabColor}
										onSelect={handleChangeTab}
										fitted
									></Tabs>
								</div>
								<div style={{ padding: "10px" }}>
									<ColorPicker
										onChange={(value) => {
											if (tabColor === 0) {
												setColor(value);
												console.log(value);
												handleCommand("foreColor", convertHSL(color));
											} else {
												setBgColor(value);
												console.log(value);
												handleCommand("backColor", convertHSL(color));
											}
										}}
										color={tabColor === 0 ? color : bgColor}
									/>
								</div>
								<div style={{ width: "80%", padding: "0px 10px 20px 10px" }}>
									<TextField
										value={
											tabColor === 0 ? convertHSL(color) : convertHSL(bgColor)
										}
										prefix={
											<div
												style={{
													width: "20px",
													height: "20px",
													background: `${
														tabColor === 0
															? convertHSL(color)
															: convertHSL(bgColor)
													}`,
													borderRadius: "10px",
												}}
											></div>
										}
									/>
								</div>
							</Popover>
						</div>
					</ButtonGroup>
				</div>
				<LegacyCard.Subsection>
					<div
						ref={textEditorRef}
						className="text-editor"
						contentEditable
						style={{
							fontSize: "17px",
							border: "1px solid #ccc",
							padding: "8px",
							paddingBottom: "30px",
							lineHeight: "22px",
							outline: "none",
							borderBottomLeftRadius: 5,
							borderBottomRightRadius: 5,
							minHeight: "150px",
							width: "100%",
						}}
						onFocus={(e) => {
							e.target.style.borderColor = "#005bd3";
						}}
						onBlur={(e) => {
							e.target.style.borderColor = "#ccc";
						}}
						onKeyDown={(e) => handleChangeContent(e.target.innerHTML)}
					></div>
				</LegacyCard.Subsection>
			</LegacyCard>
		</div>
	);
};

export default ContentFormater;
