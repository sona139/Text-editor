import { useCallback, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";
import {
	Badge,
	Button,
	ChoiceList,
	Filters,
	LegacyCard,
	Popover,
	ResourceItem,
	ResourceList,
	Tabs,
	Text,
} from "@shopify/polaris";
import {
	SortMinor,
	StarOutlineMinor,
	FavoriteMajor,
} from "@shopify/polaris-icons";
import TextFilter from "./TextFilter";
import { parserHTML } from "../utils/parserHTML";
import { validDate } from "../utils/validDate";
import ModalConfirm from "./ModalConfirm";
import { sortPages } from "../utils/sortPages";
import ToastDetail from "./ToastDetail";

const Pages = () => {
	// Pages
	const [pages, setPages] = useState([]);
	const [pagesSelected, setPagesSelected] = useState([]);

	// Filter
	const [query, setQuery] = useState("");
	const [isFocus, setIsFocus] = useState(false);

	// Visibility filter
	const [visibility, setVisibility] = useState("");

	// Sort filter
	const [isShowPopoverSort, setIsShowPopoverSort] = useState(false);
	const [sortList, setSortList] = useState("");

	// Save filter
	const [isShowPopoverSave, setIsShowPopoverSave] = useState(false);

	// Confirm modal
	const [confirmModal, setConfirmModal] = useState({
		isOpen: false,
		title: "",
		subTitle: "",
		contentAction: () => {},
	});

	// Toast
	const [isLoading, setIsLoading] = useState(true);
	const [toast, setToast] = useState({ isOpen: false, message: "" });

	// Tabs
	const [tabs, setTabs] = useState([{ id: "all", content: "All" }]);
	const [tabSelected, setTabSelected] = useState(0);

	// Fetch
	const fetch = useAuthenticatedFetch();
	const { refetch } = useAppQuery({
		url: `/api/pages?published_status=${visibility === "visible"}`,
		reactQueryOptions: {
			onSuccess: (res) => {
				console.log("re-fetch");
				let newPages = res.data;

				// Filter search
				newPages = newPages.filter((page) =>
					page.title.trim().toLowerCase().includes(query.trim().toLowerCase())
				);

				// Filter visibility
				if (visibility)
					newPages = newPages.filter((page) => {
						return visibility === "visible"
							? page.published_at
							: !page.published_at;
					});

				// Filter sort
				newPages = sortPages(newPages, sortList);
				setPages(newPages);
				setIsLoading(false);
			},
			onError: (error) => {
				console.log(error);
			},
		},
	});

	// Handle change visibility pages
	const handleChangeVisibilityPages = async (value) => {
		setIsLoading(true);
		const { visibility } = value;
		const res = await fetch(`/api/pages?id=${pagesSelected.toString()}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				published: visibility,
			}),
		});

		if (res.ok) {
			setPagesSelected([]);
			setToast({
				isOpen: true,
				message: ` ${visibility === "visible" ? "Visible" : "Hidden"} ${
					pagesSelected.length
				} ${pagesSelected.length === 1 ? "page" : "pages"}`,
			});
			refetch();
		} else {
			console.log(res);
		}
	};

	// Handle delete pages selected
	const handleDeletepagesSelected = async () => {
		if (!pagesSelected || pagesSelected.length === 0) {
			return;
		}
		setIsLoading(true);

		const res = await fetch(`/api/pages?id=${pagesSelected.toString()}`, {
			method: "DELETE",
		});

		if (res.ok) {
			setPagesSelected([]);

			setConfirmModal({ isOpen: false });
			setToast({
				isOpen: true,
				message: `Deleted ${pagesSelected.length} ${
					pagesSelected.length === 1 ? "page" : "pages"
				}`,
			});

			refetch();
		} else {
			console.log("Something is wrong");
		}
	};

	// Handle change selected pages
	const handlChangepagesSelected = useCallback((value) => {
		setPagesSelected(value);
	}, []);

	// Handle change tab selected
	const handleChangeTab = useCallback((value) => {
		if (value === 0) {
			setIsLoading(true);
			refetch();
			setQuery("");
			setTabs((prev) => prev.slice(0, -1));
			setVisibility("");
		}
		setTabSelected(value);
	}, []);

	// Handle change tabs
	const handleChangeTabs = useCallback((value) => {
		setTabs((prev) => [...prev, value]);
	}, []);

	// Handle change query value
	const handleChangeQuery = useCallback(
		(value) => {
			setQuery(value);
		},
		[tabs]
	);

	// Fecth api after 500ms when query value change
	useEffect(() => {
		const id = setTimeout(() => {
			setIsLoading(true);

			if (tabs.length === 1) {
				const newTab = { id: "custom-search", content: "Custom search" };
				setTabs((prev) => [...prev, newTab]);
				setTabSelected(1);
				setIsFocus(true);
			} else if (!query.trim()) {
				if (tabs.length !== 1) {
					setTabs((prev) => prev.slice(0, -1));
					setTabSelected(0);
				}
			}

			refetch();
		}, 500);

		return () => {
			clearTimeout(id);
			setIsLoading(false);
		};
	}, [query]);

	// Handle remove query value
	const handleRemoveQuery = useCallback(() => {
		setIsLoading(true);
		setQuery("");
		refetch();
		if (tabs.length !== 1) {
			setTabs((prev) => prev.slice(0, -1));
			setTabSelected(0);
		}
	}, [tabs]);

	// Handle change visibility value
	const handleChangeVisibility = useCallback(
		(value) => {
			setIsLoading(true);
			setVisibility(value[0]);
			if (tabs.length === 1) {
				const newTab = {
					id: "custom-search",
					content: "Custom search",
				};
				setTabs((prev) => [...prev, newTab]);
				setTabSelected(1);
			}

			refetch();
		},
		[tabs]
	);

	// Handle remove visibility value
	const handleRemoveVisibility = useCallback(() => {
		setVisibility("");
		setIsLoading(true);
		if (tabs.length !== 1) {
			setTabs((prev) => prev.slice(0, -1));
			setTabSelected(0);
		}
	}, [tabs]);

	// Handle change confirm modal
	const handleChangeConfirmModal = useCallback((value) => {
		setConfirmModal((prev) => ({ ...prev, ...value }));
	}, []);

	// Handle change toast
	const handleChangeToast = useCallback((value) => {
		setToast((prev) => ({ ...prev, ...value }));
	});

	// Handle clear visibility
	// const handleClearVisibility = useCallback(() => {
	// 	handleRemoveQuery();
	// 	handleRemoveVisibility();
	// }, []);

	// Handle toggle show popover save
	const toggleIsShowPopoverSave = useCallback(() => {
		setIsShowPopoverSave((prev) => !prev);
	}, []);

	// Save button
	const saveButton = (
		<Button
			disabled={!visibility && !query.trim()}
			icon={visibility ? StarOutlineMinor : FavoriteMajor}
			onClick={toggleIsShowPopoverSave}
			disclosure
		>
			Save
		</Button>
	);

	// Handle toggle show popover sort
	const toggleIsShowPopoverSort = useCallback(() => {
		setIsShowPopoverSort((prev) => !prev);
	}, []);

	// Sort button
	const sortButton = (
		<Button icon={SortMinor} onClick={toggleIsShowPopoverSort} disclosure>
			Sort
		</Button>
	);

	// Handle change sort option
	const handleChangeSort = useCallback((value) => {
		setSortList(value[0]);
		setIsLoading(true);
		refetch();
	}, []);

	// Bulk action
	const bulkActions = [
		{
			content: "Make selected pages visible",
			onAction: () => {
				handleChangeVisibilityPages({ visibility: true });
			},
		},
		{
			content: "Hide selected pages",
			onAction: () => {
				handleChangeVisibilityPages({ visibility: false });
			},
		},
		{
			content: (
				<Button plain destructive>
					Delete pages
				</Button>
			),
			onAction: () =>
				setConfirmModal({
					isOpen: true,
					title: `Delete ${pagesSelected?.length} ${
						pagesSelected?.length === 1 ? "page" : "pages"
					}`,
					subTitle:
						"Deleted pages cannot be recovered. Do you still want to continue?",
					contentAction: `Delete ${pagesSelected?.length} ${
						pagesSelected?.length === 1 ? "page" : "pages"
					}`,
					onConfirm: handleDeletepagesSelected,
				}),
		},
	];

	// Filter visibility
	const filters = [
		{
			key: "visibility",
			label: "Visibility",
			filter: (
				<ChoiceList
					title="Visible"
					titleHidden
					choices={[
						{ label: "Visible", value: "visible" },
						{ label: "Hidden", value: "hidden" },
					]}
					selected={visibility}
					onChange={handleChangeVisibility}
				/>
			),
			shortcut: true,
		},
	];

	// Apply filter
	const appliedFilters = visibility
		? [
				{
					key: "visiable",
					label: `Visibility is ${visibility}`,
					onRemove: handleRemoveVisibility,
				},
		  ]
		: [];

	// Filter control
	const filterControl = (
		<Filters
			filters={filters}
			appliedFilters={appliedFilters}
			queryValue={query}
			onQueryChange={handleChangeQuery}
			onQueryClear={handleRemoveQuery}
			focused={isFocus}
		>
			<div style={{ display: "flex", gap: 8, paddingLeft: 8 }}>
				<Popover
					active={isShowPopoverSave}
					activator={saveButton}
					onClose={toggleIsShowPopoverSave}
				>
					<Popover.Pane>
						<TextFilter
							tagName={visibility}
							toggleIsShowPopoverSave={toggleIsShowPopoverSave}
							handleChangeTabs={handleChangeTabs}
						/>
					</Popover.Pane>
				</Popover>

				<Popover
					active={isShowPopoverSort}
					activator={sortButton}
					onClose={toggleIsShowPopoverSort}
				>
					<Popover.Pane>
						<div style={{ padding: 16 }}>
							<ChoiceList
								title="Sort by"
								choices={[
									{ label: "Newest update", value: "newest" },
									{ label: "Oldest update", value: "oldest" },
									{ label: "Title A-Z", value: "az" },
									{ label: "Title Z-A", value: "za" },
								]}
								selected={sortList}
								onChange={handleChangeSort}
								hideClearButton
							/>
						</div>
					</Popover.Pane>
				</Popover>
			</div>
		</Filters>
	);

	return (
		<LegacyCard>
			<Tabs tabs={tabs} selected={tabSelected} onSelect={handleChangeTab}>
				<LegacyCard>
					<ResourceList
						resourceName={{
							singular: "page",
							plural: "pages",
						}}
						items={pages}
						renderItem={renderItem}
						selectedItems={pagesSelected}
						filterControl={filterControl}
						onSelectionChange={handlChangepagesSelected}
						bulkActions={bulkActions}
						loading={isLoading}
					/>
				</LegacyCard>
			</Tabs>
			{confirmModal.isOpen && (
				<ModalConfirm
					confirmModal={confirmModal}
					handleChangeConfirmModal={handleChangeConfirmModal}
				/>
			)}

			{toast.isOpen && (
				<ToastDetail toast={toast} handleChangeToast={handleChangeToast} />
			)}
		</LegacyCard>
	);
};

const renderItem = (item) => {
	const { id, title, created_at, body_html, published_at, handle } = item;

	const shotcutActions = handle
		? [
				{
					content: "View Page",
					url: `https://sona139.myshopify.com/pages/${handle}`,
				},
		  ]
		: [];
	return (
		<ResourceItem id={id} shortcutActions={shotcutActions} url={`/${id}`}>
			{
				<div style={{ display: "flex", gap: 5 }}>
					<Text as="h3" variant="bodyMd" fontWeight="semibold">
						{title}
					</Text>
					{!published_at && <Badge>Hidden</Badge>}
				</div>
			}
			{body_html && <div>{parserHTML(body_html)}</div>}
			<Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
				{validDate(created_at)}
			</Text>
		</ResourceItem>
	);
};

export default Pages;
