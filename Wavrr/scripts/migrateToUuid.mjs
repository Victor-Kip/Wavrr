import dotenv from "dotenv";
import sequelize from "../config/db.js";

dotenv.config();

const run = async () => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"', {
      transaction,
    });

    await sequelize.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid()
    `, { transaction });
    await sequelize.query(`
      ALTER TABLE "artist"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid()
    `, { transaction });
    await sequelize.query(`
      ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid(),
      ADD COLUMN IF NOT EXISTS "author_uuid" UUID
    `, { transaction });
    await sequelize.query(`
      ALTER TABLE "comments"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid(),
      ADD COLUMN IF NOT EXISTS "post_uuid" UUID
    `, { transaction });
    await sequelize.query(`
      ALTER TABLE "likes"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid(),
      ADD COLUMN IF NOT EXISTS "target_uuid" UUID
    `, { transaction });
    await sequelize.query(`
      ALTER TABLE "follows"
      ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid(),
      ADD COLUMN IF NOT EXISTS "follower_uuid" UUID,
      ADD COLUMN IF NOT EXISTS "following_uuid" UUID
    `, { transaction });
    for (const table of ["songs", "albums", "merchandise"]) {
      await sequelize.query(`
        ALTER TABLE "${table}"
        ADD COLUMN IF NOT EXISTS "uuid" UUID DEFAULT gen_random_uuid(),
        ADD COLUMN IF NOT EXISTS "artist_uuid" UUID
      `, { transaction });
    }

    await sequelize.query(`
      UPDATE "user"
      SET "uuid" = gen_random_uuid()
      WHERE "uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "artist"
      SET "uuid" = gen_random_uuid()
      WHERE "uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "posts"
      SET "uuid" = gen_random_uuid()
      WHERE "uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "comments"
      SET "uuid" = gen_random_uuid()
      WHERE "uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "likes"
      SET "uuid" = gen_random_uuid()
      WHERE "uuid" IS NULL
    `, { transaction });
    for (const table of ["follows", "songs", "albums", "merchandise"]) {
      await sequelize.query(`
        UPDATE "${table}"
        SET "uuid" = gen_random_uuid()
        WHERE "uuid" IS NULL
      `, { transaction });
    }
    await sequelize.query(`
      UPDATE "follows" AS follows
      SET "follower_uuid" = users."uuid"
      FROM "user" AS users
      WHERE follows."follower_id" = users."id"
        AND follows."follower_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "follows" AS follows
      SET "following_uuid" = artists."uuid"
      FROM "artist" AS artists
      WHERE follows."following_type" = 'artist'
        AND follows."following_id" = artists."id"
        AND follows."following_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "follows" AS follows
      SET "following_uuid" = users."uuid"
      FROM "user" AS users
      WHERE follows."following_type" = 'user'
        AND follows."following_id" = users."id"
        AND follows."following_uuid" IS NULL
    `, { transaction });
    for (const table of ["songs", "albums", "merchandise"]) {
      await sequelize.query(`
        UPDATE "${table}" AS records
        SET "artist_uuid" = artists."uuid"
        FROM "artist" AS artists
        WHERE records."artist_id" = artists."id"
          AND records."artist_uuid" IS NULL
      `, { transaction });
    }

    await sequelize.query(`
      UPDATE "posts" AS posts
      SET "author_uuid" = users."uuid"
      FROM "user" AS users
      WHERE posts."authorType" = 'user'
        AND posts."authorId" = users."id"
        AND posts."author_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "posts" AS posts
      SET "author_uuid" = artists."uuid"
      FROM "artist" AS artists
      WHERE posts."authorType" = 'artist'
        AND posts."authorId" = artists."id"
        AND posts."author_uuid" IS NULL
    `, { transaction });

    await sequelize.query(`
      UPDATE "comments" AS comments
      SET "post_uuid" = posts."uuid"
      FROM "posts" AS posts
      WHERE comments."post_id" = posts."id"
        AND comments."post_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "likes" AS likes
      SET "target_uuid" = posts."uuid"
      FROM "posts" AS posts
      WHERE likes."target_type" = 'POST'
        AND likes."target_id" = posts."id"
        AND likes."target_uuid" IS NULL
    `, { transaction });

    await sequelize.query(`
      UPDATE "comments" AS comments
      SET "actor_uuid" = users."uuid"
      FROM "user" AS users
      WHERE (comments."actor_type" = 'user' OR comments."actor_type" IS NULL)
        AND comments."actor_id" = users."id"
        AND comments."actor_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "comments" AS comments
      SET "actor_uuid" = artists."uuid"
      FROM "artist" AS artists
      WHERE comments."actor_type" = 'artist'
        AND comments."actor_id" = artists."id"
        AND comments."actor_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "likes" AS likes
      SET "actor_uuid" = users."uuid"
      FROM "user" AS users
      WHERE (likes."actor_type" = 'user' OR likes."actor_type" IS NULL)
        AND likes."actor_id" = users."id"
        AND likes."actor_uuid" IS NULL
    `, { transaction });
    await sequelize.query(`
      UPDATE "likes" AS likes
      SET "actor_uuid" = artists."uuid"
      FROM "artist" AS artists
      WHERE likes."actor_type" = 'artist'
        AND likes."actor_id" = artists."id"
        AND likes."actor_uuid" IS NULL
    `, { transaction });

    await sequelize.query(`
      ALTER TABLE "user" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "artist" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "posts" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "comments" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "likes" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "comments" ALTER COLUMN "post_uuid" SET NOT NULL;
      ALTER TABLE "likes" ALTER COLUMN "target_uuid" SET NOT NULL;
      ALTER TABLE "follows" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "follows" ALTER COLUMN "follower_uuid" SET NOT NULL;
      ALTER TABLE "follows" ALTER COLUMN "following_uuid" SET NOT NULL;
      ALTER TABLE "songs" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "songs" ALTER COLUMN "artist_uuid" SET NOT NULL;
      ALTER TABLE "albums" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "albums" ALTER COLUMN "artist_uuid" SET NOT NULL;
      ALTER TABLE "merchandise" ALTER COLUMN "uuid" SET NOT NULL;
      ALTER TABLE "merchandise" ALTER COLUMN "artist_uuid" SET NOT NULL;
      ALTER TABLE "comments" ALTER COLUMN "post_id" DROP NOT NULL;
      ALTER TABLE "likes" ALTER COLUMN "target_id" DROP NOT NULL;
      ALTER TABLE "songs" ALTER COLUMN "artist_id" DROP NOT NULL;
      ALTER TABLE "albums" ALTER COLUMN "artist_id" DROP NOT NULL;
      ALTER TABLE "merchandise" ALTER COLUMN "artist_id" DROP NOT NULL;
    `, { transaction });

    await sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "user_uuid_unique" ON "user" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "artist_uuid_unique" ON "artist" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "posts_uuid_unique" ON "posts" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "comments_uuid_unique" ON "comments" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "likes_uuid_unique" ON "likes" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "follows_uuid_unique" ON "follows" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "songs_uuid_unique" ON "songs" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "albums_uuid_unique" ON "albums" ("uuid");
      CREATE UNIQUE INDEX IF NOT EXISTS "merchandise_uuid_unique" ON "merchandise" ("uuid");
    `, { transaction });

    await transaction.commit();
    console.log("UUID migration phase 3 completed.");
    console.log("Actor-owned social and music references now have UUIDs; numeric columns remain nullable for legacy compatibility.");
  } catch (error) {
    await transaction.rollback();
    console.error("UUID migration phase 3 failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
