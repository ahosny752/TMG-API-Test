import { Router, Request, Response, NextFunction } from "express";
import storeService from "../services/storeService";

const router = Router();

// route to add a key value pair with an optional ttl
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, value, ttl } = req.body;

    if (!key || !value) {
      const error = new Error("Key and value are required");
      (error as any).status = 400;
      return next(error);
    }

    // Check if ttl is a number
    if (ttl !== undefined && (typeof ttl !== "number" || ttl < 0)) {
      const error = new Error("TTL must be a positive number or undefined");
      (error as any).status = 400;
      return next(error);
    }

    await storeService.set(key, value, ttl);

    res.json({
      message: `Key '${key}' added`,
      key,
      value,
      ttl: ttl || null,
    });
  } catch (err) {
    next(err);
  }
});

// get a value by specific key
router.get("/:key", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const result = await storeService.get(key);

    if (!result) {
      const error = new Error("Key not found or expired");
      (error as any).status = 404;
      return next(error);
    }

    res.json({ value: result });
  } catch (err) {
    next(err);
  }
});

// delete a specific key
router.delete(
  "/:key",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;
      const deleted = await storeService.delete(key);
      if (deleted) {
        res.json({ message: `Key '${key}' deleted` });
      } else {
        const error = new Error("Key not found");
        (error as any).status = 404;
        return next(error);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
