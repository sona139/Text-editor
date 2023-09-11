import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import {
	Banner,
	Button,
	ButtonGroup,
	Form,
	Grid,
	LegacyCard,
	Page,
	TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import ContentFormater from "../components/ContentFormater";
import Visibility from "../components/Visibility";
import SearchEngine from "../components/SearchEngine";
import OnlineStore from "../components/OnlineStore";
import { ranges } from "../utils/ranges";
import ModalConfirm from "../components/ModalConfirm";
import { getUrlFromTitle } from "../utils/getUrlFromTitle";
import SkeletonLoading from "../components/SkeletonLoading";
import ToastDetail from "../components/ToastDetail";

const NewPage = () => {
	const navigate = useNavigate();
	const fetch = useAuthenticatedFetch();

	// Page detail
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [titleSEO, setTitleSEO] = useState("");
	const [contentSEO, setContenSEO] = useState("");
	const [urlSEO, setUrlSEO] = useState("");

	// Visibility
	const [visibility, setVisibility] = useState("visible");
	const [isSetDate, setIsSetDate] = useState(false);
	const [dateVisibility, setDateVisibility] = useState(new Date());
	const [time, setTime] = useState(ranges[0]);

	// Theme template
	const [theme, setTheme] = useState("default");

	// Confrim modal
	const [confirmModal, setConfirmModal] = useState({
		isOpen: false,
		title: "",
		subTitle: "",
		contentAction: "",
		onConfirm: () => {},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [toast, setToast] = useState({ isOpen: false, message: "" });

	// Handle change title
	const handleChangeTitle = useCallback((value) => {
		setTitle(value);
	}, []);

	// Handle change title SEO
	const handleChangeTitleSEO = useCallback((value) => {
		setTitleSEO(value);
	}, []);

	// Handle change url SEO
	const handleChangeUrlSEO = useCallback((value) => {
		setUrlSEO(value);
	});

	// Handle change content
	const handleChangeContent = useCallback((value) => {
		setContent(value);
	}, []);

	// Handle change contentSEO
	const handleChangeContentSEO = useCallback((value) => {
		setContenSEO(value);
	}, []);

	// Handle change visibility
	const handleChangeVisibility = useCallback((value) => {
		if (value[0] === "visible") {
			handleChangeSetDate(false);
		}
		setVisibility(value[0]);
	}, []);

	// Handle change isSetDate
	const handleChangeSetDate = useCallback((value) => {
		if (value !== undefined) setIsSetDate(value);
		else setIsSetDate((prev) => !prev);
	}, []);

	// Handle change date hidden
	const handleChangeDateVisibility = useCallback((value) => {
		setDateVisibility(value);
	}, []);

	// Handle change time hidden
	const handleChangeTime = useCallback((value) => {
		const range = ranges.find((range) => range.alias === value[0]);
		setTime(range);
	}, []);

	// Handle change theme template
	const handelChangeTheme = useCallback((value) => {
		setTheme(value);
	});

	// Handle change confirm modal
	const handleChangeConfirmModal = useCallback((value) => {
		setConfirmModal((prev) => ({
			...prev,
			...value,
		}));
	});

	// Handle change toast
	const handleChangeToast = useCallback((value) => {
		setToast((prev) => ({ ...prev, ...value }));
	});

	// Handle create page
	const handleCreatePage = () => {
		if (!title.trim()) {
			setIsError(true);
		} else {
			setIsError(false);
			setIsLoading(true);
			const newPage = {
				title: title.trim(),
				body_html: content,
				published: visibility === "visible",
			};

			if (urlSEO) newPage.handle = getUrlFromTitle(urlSEO);

			fetch("/api/pages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ page: newPage }),
			})
				.then(() => {
					handleChangeToast({ isOpen: true, message: "Page was created" });
					setTimeout(() => {
						navigate("/");
					}, 1000);
				})
				.catch((e) => console.log(e))
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<>
			{isLoading ? (
				<SkeletonLoading />
			) : (
				<div style={{ fontSize: 13 }}>
					<Page
						title="Add page"
						backAction={{
							onAction: () => {
								if (!title.trim() && !content.trim()) {
									navigate("/");
								} else {
									handleChangeConfirmModal({
										isOpen: true,
										title: "You have unsaved changes",
										subTitle:
											"If you leave this page, all unsaved changes will be lost.",
										contentAction: "Leave page",
										onConfirm: () => navigate("/"),
									});
								}
							},
						}}
					>
						{isError && (
							<div style={{ marginBottom: "16px" }}>
								<Banner title="There is 1 error:" status="critical">
									<li>Title can't be blank</li>
								</Banner>
							</div>
						)}
						<Form>
							<Grid>
								<Grid.Cell columnSpan={{ lg: 8 }}>
									<LegacyCard sectioned>
										<TextField
											label="Title"
											value={title}
											onChange={handleChangeTitle}
											placeholder="e.g. Contact us, Sizing chart, FAQs"
											error={isError ? "Store name is required" : ""}
										/>

										<ContentFormater
											content={content}
											handleChangeContent={handleChangeContent}
										/>
									</LegacyCard>

									<SearchEngine
										title={title}
										content={content}
										titleSEO={titleSEO}
										handleChangeTitleSEO={handleChangeTitleSEO}
										contentSEO={contentSEO}
										handleChangeContentSEO={handleChangeContentSEO}
										urlSEO={urlSEO}
										handleChangeUrlSEO={handleChangeUrlSEO}
									/>
								</Grid.Cell>
								<Grid.Cell columnSpan={{ lg: 4 }}>
									<Visibility
										visibility={visibility}
										handleChangeVisibility={handleChangeVisibility}
										isSetDate={isSetDate}
										handleChangeIsSetDate={handleChangeSetDate}
										dateVisibility={dateVisibility}
										handleChangeDateVisibility={handleChangeDateVisibility}
										time={time}
										handleChangeTime={handleChangeTime}
									/>

									<OnlineStore
										theme={theme}
										handelChangeTheme={handelChangeTheme}
									/>
								</Grid.Cell>
							</Grid>
						</Form>
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<ButtonGroup>
								<Button
									onClick={() => {
										if (title.trim() || content.trim()) {
											handleChangeConfirmModal({
												isOpen: true,
												title: "You have unsaved changes",
												subTitle:
													"If you leave this page, all unsaved changes will be lost.",
												contentAction: "Leave page",
												onConfirm: () => navigate("/"),
											});
										} else {
											navigate("/");
										}
									}}
								>
									Cancel
								</Button>
								<Button
									primary
									onClick={handleCreatePage}
									disabled={!title.trim()}
								>
									Save
								</Button>
							</ButtonGroup>
						</div>

						{confirmModal.isOpen && (
							<ModalConfirm
								confirmModal={confirmModal}
								handleChangeConfirmModal={handleChangeConfirmModal}
							/>
						)}

						{toast.isOpen && (
							<ToastDetail
								toast={toast}
								handleChangeToast={handleChangeToast}
							/>
						)}
					</Page>
				</div>
			)}
		</>
	);
};

export default NewPage;
