"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1757538350679 = void 0;
class InitialSchema1757538350679 {
    name = 'InitialSchema1757538350679';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "shipping_info" jsonb, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name_en" character varying NOT NULL, "name_ar" character varying NOT NULL, "description_en" text, "description_ar" text, "price" numeric NOT NULL, "stock" integer NOT NULL, "category_id" character varying NOT NULL, "sizes" jsonb, "colors" jsonb, "images" text array, "view_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aed9a569a2d7b3bc3be80555f5" ON "products" ("name_en") `);
        await queryRunner.query(`CREATE INDEX "IDX_1a7f67516ed051dc23452af3fe" ON "products" ("name_ar") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f6868c96e0069e699f33e12" ON "products" ("category_id") `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f6868c96e0069e699f33e12"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a7f67516ed051dc23452af3fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aed9a569a2d7b3bc3be80555f5"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
exports.InitialSchema1757538350679 = InitialSchema1757538350679;
//# sourceMappingURL=1757538350679-InitialSchema.js.map