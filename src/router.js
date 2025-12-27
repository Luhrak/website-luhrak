import { Router } from "@oak/oak";
import * as controller from "./pages/controller.js";

const router = new Router();

// Main Pages
router.get("/", controller.index);
router.get("/gallery", controller.gallery);
router.get("/prices", controller.prices);
router.get("/projects", controller.projects);
router.get("/about", controller.about);

// Legal Pages
router.get("/legal/impressum", controller.impressum);
router.get("/legal/privacy-policy", controller.privacyPolicy);

// Detail Pages
router.get("/detailpage/art-raimond", controller.artRaimond);
router.get("/detailpage/art-stargaze", controller.artStargaze);
router.get("/detailpage/price-headshot", controller.priceHeadshot);
router.get("/detailpage/price-sticker", controller.priceSticker);
router.get("/detailpage/project-fursuit", controller.projectFursuit);
router.get("/detailpage/project-stickers", controller.projectStickers);

export default router;
