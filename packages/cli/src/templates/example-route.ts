import type { ProjectConfig } from "../types.js";

export function exampleRouteTemplate(config: ProjectConfig): string {
  switch (config.database) {
    case "prisma":
      return prismaVariant();
    case "drizzle":
      return drizzleVariant(config);
    case "typeorm":
      return typeormVariant();
    default:
      return inMemoryVariant();
  }
}

function inMemoryVariant(): string {
  return `import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { NotFoundError } from "../lib/errors.js";

export const exampleRouter = Router();

interface Example {
  id: number;
  name: string;
  description: string;
}

let nextId = 1;
const examples: Example[] = [];

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  }),
});

exampleRouter.get("/", (_req, res) => {
  res.json(examples);
});

exampleRouter.post("/", validate(createSchema), (req, res) => {
  const example: Example = { id: nextId++, ...req.body };
  examples.push(example);
  res.status(201).json(example);
});

exampleRouter.put("/:id", validate(updateSchema), (req, res) => {
  const idx = examples.findIndex((e) => e.id === Number(req.params.id));
  if (idx === -1) throw new NotFoundError("Example not found");
  examples[idx] = { ...examples[idx], ...req.body };
  res.json(examples[idx]);
});

exampleRouter.delete("/:id", (req, res) => {
  const idx = examples.findIndex((e) => e.id === Number(req.params.id));
  if (idx === -1) throw new NotFoundError("Example not found");
  examples.splice(idx, 1);
  res.status(204).end();
});
`;
}

function prismaVariant(): string {
  return `import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { NotFoundError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export const exampleRouter = Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }),
});

exampleRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

exampleRouter.post("/", validate(createSchema), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json(user);
});

exampleRouter.put("/:id", validate(updateSchema), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) throw new NotFoundError("User not found");
  const updated = await prisma.user.update({ where: { id: user.id }, data: req.body });
  res.json(updated);
});

exampleRouter.delete("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) throw new NotFoundError("User not found");
  await prisma.user.delete({ where: { id: user.id } });
  res.status(204).end();
});
`;
}

function drizzleVariant(config: ProjectConfig): string {
  if (config.dbProvider === "mysql") {
    return drizzleMysqlVariant();
  }
  return drizzleReturningVariant();
}

function drizzleReturningVariant(): string {
  return `import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { validate } from "../middleware/validate.js";
import { NotFoundError } from "../lib/errors.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const exampleRouter = Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }),
});

exampleRouter.get("/", async (_req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});

exampleRouter.post("/", validate(createSchema), async (req, res) => {
  const [user] = await db.insert(users).values(req.body).returning();
  res.status(201).json(user);
});

exampleRouter.put("/:id", validate(updateSchema), async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, Number(req.params.id)));
  if (!existing) throw new NotFoundError("User not found");
  const [updated] = await db.update(users).set(req.body).where(eq(users.id, existing.id)).returning();
  res.json(updated);
});

exampleRouter.delete("/:id", async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, Number(req.params.id)));
  if (!existing) throw new NotFoundError("User not found");
  await db.delete(users).where(eq(users.id, existing.id));
  res.status(204).end();
});
`;}

function drizzleMysqlVariant(): string {
  return `import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { validate } from "../middleware/validate.js";
import { NotFoundError } from "../lib/errors.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const exampleRouter = Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }),
});

exampleRouter.get("/", async (_req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});

exampleRouter.post("/", validate(createSchema), async (req, res) => {
  const result = await db.insert(users).values(req.body).$returningId();
  const [user] = await db.select().from(users).where(eq(users.id, result[0].id));
  res.status(201).json(user);
});

exampleRouter.put("/:id", validate(updateSchema), async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, Number(req.params.id)));
  if (!existing) throw new NotFoundError("User not found");
  await db.update(users).set(req.body).where(eq(users.id, existing.id));
  const [updated] = await db.select().from(users).where(eq(users.id, existing.id));
  res.json(updated);
});

exampleRouter.delete("/:id", async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, Number(req.params.id)));
  if (!existing) throw new NotFoundError("User not found");
  await db.delete(users).where(eq(users.id, existing.id));
  res.status(204).end();
});
`;
}

function typeormVariant(): string {
  return `import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { NotFoundError } from "../lib/errors.js";
import { AppDataSource } from "../db/data-source.js";
import { User } from "../db/entities/user.js";

export const exampleRouter = Router();

const userRepo = AppDataSource.getRepository(User);

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }),
});

exampleRouter.get("/", async (_req, res) => {
  const users = await userRepo.find();
  res.json(users);
});

exampleRouter.post("/", validate(createSchema), async (req, res) => {
  const user = userRepo.create(req.body);
  const saved = await userRepo.save(user);
  res.status(201).json(saved);
});

exampleRouter.put("/:id", validate(updateSchema), async (req, res) => {
  const user = await userRepo.findOneBy({ id: Number(req.params.id) });
  if (!user) throw new NotFoundError("User not found");
  userRepo.merge(user, req.body);
  const updated = await userRepo.save(user);
  res.json(updated);
});

exampleRouter.delete("/:id", async (req, res) => {
  const user = await userRepo.findOneBy({ id: Number(req.params.id) });
  if (!user) throw new NotFoundError("User not found");
  await userRepo.remove(user);
  res.status(204).end();
});
`;
}
