import { Router } from "express";

import * as controller from "@/controllers/client/payment";
import schemaValidatingMiddleware from "@/middlewares/schemaValidatingMiddleware";
import paymentSchema from "@/schemas/paymentSchema";

const router = Router();

router.post("/", schemaValidatingMiddleware(paymentSchema), controller.createPayment);
router.get("/",  controller.getPayment);

export default router;
