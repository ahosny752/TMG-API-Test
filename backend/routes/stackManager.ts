import { Router, Request, Response, NextFunction } from "express";
import stackService from "../services/stackService";

const router = Router();

//route to add an item to the stack
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item } = req.body;
    if (!item) {
      const error = new Error("Item is required");
      (error as any).status = 400;
      return next(error);
    }

    await stackService.push(item);
    res.json({ message: `Item '${item}' added to stack` });
  } catch (err) {
    next(err);
  }
});

//route to get the top item from the stack and remove it
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await stackService.pop();
    if (!item) {
      const error = new Error("Stack is empty");
      (error as any).status = 404;
      return next(error);
    }

    res.json({ item });
  } catch (err) {
    next(err);
  }
});

export default router;
