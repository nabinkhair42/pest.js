export function validateTemplate(): string {
  return `import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}
`;
}
