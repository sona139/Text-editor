// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === "production"
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	shopify.redirectToShopifyOrAppRoot()
);
app.post(
	shopify.config.webhooks.path,
	shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (req, res) => {
	const countData = await shopify.api.rest.Product.count({
		session: res.locals.shopify.session,
	});
	res.status(200).send(countData);
});

app.get("/api/products/create", async (req, res) => {
	let status = 200;
	let error = null;

	try {
		await productCreator(res.locals.shopify.session);
	} catch (e) {
		console.log(`Failed to process products/create: ${e.message}`);
		status = 500;
		error = e.message;
	}
	res.status(status).send({ success: status === 200, error });
});

// Get all page
app.get("/api/pages", async (req, res) => {
	const { id, published } = req.query;
	if (id) {
		const pagesData = await shopify.api.rest.Page.find({
			session: res.locals.shopify.session,
			// @ts-ignore
			id,
		});
		res.status(200).send(pagesData);
	} else {
		const pagesData = await shopify.api.rest.Page.all({
			session: res.locals.shopify.session,
			published_status: published,
		});
		res.status(200).send(pagesData);
	}
});

// Create page
app.post("/api/pages", async (req, res) => {
	const { page } = req.body;

	const newPage = new shopify.api.rest.Page({
		session: res.locals.shopify.session,
	});

	newPage.title = page?.title;
	newPage.body_html = page?.body_html || "";
	newPage.published = page?.published;
	if (page.handle) newPage.handle = page?.handle;

	await newPage.save({ update: true });
	res.status(200).send(newPage);
});

// Delete page
app.delete("/api/pages", async (req, res) => {
	// @ts-ignore
	const ids = req.query.id?.split(","); // Split comma-separated IDs into an array
	const deletePromises = ids.map((id) =>
		shopify.api.rest.Page.delete({
			session: res.locals.shopify.session,
			id: id,
		})
	);
	const pagesData = await Promise.all(deletePromises);
	res.status(200).send(pagesData);
});

// Update page
app.put("/api/pages", async (req, res) => {
	// @ts-ignore
	const ids = req.query.id?.split(",");
	const { published, page } = req.body;

	if (page?.title) {
		const updatePage = new shopify.api.rest.Page({
			session: res.locals.shopify.session,
		});

		updatePage.id = ids[0];
		updatePage.title = page?.title;
		updatePage.published = page?.published;
		updatePage.body_html = page?.body_html;

		if (page?.handle) updatePage.handle = page?.handle;

		await updatePage.save({
			update: true,
		});

		res.status(200).send(updatePage);
	} else if (ids) {
		const updatePageStatus = ids.map(async (id) => {
			const page = new shopify.api.rest.Page({
				session: res.locals.shopify.session,
			});
			page.id = id;
			page.published = published;
			await page.save({
				update: true,
			});
		});
		const pagesData = await Promise.all(updatePageStatus);
		res.status(200).send(pagesData);
	}
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (req, res, _next) => {
	return res
		.status(200)
		.set("Content-Type", "text/html")
		.send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
