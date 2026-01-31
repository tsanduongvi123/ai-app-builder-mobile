import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Project Database Operations
 */

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { projects } = await import("../drizzle/schema");
  return db.select().from(projects).where(eq(projects.userId, userId));
}

export async function getProjectById(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const { projects } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

  return result[0] || null;
}

export async function createProject(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projects } = await import("../drizzle/schema");
  const result = await db.insert(projects).values(data);
  return (result as any).insertId || 0;
}

export async function updateProject(
  projectId: number,
  userId: number,
  data: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projects } = await import("../drizzle/schema");
  await db
    .update(projects)
    .set(data)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

export async function deleteProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projects, projectFiles } = await import("../drizzle/schema");
  // Delete all files first
  await db
    .delete(projectFiles)
    .where(eq(projectFiles.projectId, projectId));

  // Delete project
  await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

/**
 * Project Files Database Operations
 */

export async function getProjectFiles(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  const { projectFiles } = await import("../drizzle/schema");
  return db
    .select()
    .from(projectFiles)
    .where(eq(projectFiles.projectId, projectId));
}

export async function getProjectFileByPath(
  projectId: number,
  filePath: string
) {
  const db = await getDb();
  if (!db) return null;

  const { projectFiles } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(projectFiles)
    .where(
      and(
        eq(projectFiles.projectId, projectId),
        eq(projectFiles.filePath, filePath)
      )
    );

  return result[0] || null;
}

export async function createProjectFile(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projectFiles } = await import("../drizzle/schema");
  const result = await db.insert(projectFiles).values(data);
  return (result as any).insertId || 0;
}

export async function createProjectFiles(files: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projectFiles } = await import("../drizzle/schema");
  const result = await db.insert(projectFiles).values(files);
  return result;
}

export async function updateProjectFile(
  fileId: number,
  data: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projectFiles } = await import("../drizzle/schema");
  await db
    .update(projectFiles)
    .set(data)
    .where(eq(projectFiles.id, fileId));
}

export async function deleteProjectFile(fileId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projectFiles } = await import("../drizzle/schema");
  await db.delete(projectFiles).where(eq(projectFiles.id, fileId));
}

export async function deleteProjectFiles(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { projectFiles } = await import("../drizzle/schema");
  await db
    .delete(projectFiles)
    .where(eq(projectFiles.projectId, projectId));
}
