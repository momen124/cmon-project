import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductIndexes1757539955217 implements MigrationInterface {
    name = 'AddProductIndexes1757539955217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_75895eeb1903f8a17816dafe0a" ON "products" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ef15e30a8b83d79e606d8ff62" ON "products" ("sizes") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e0692d9239c976277a6c8fb57" ON "products" ("colors") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5e0692d9239c976277a6c8fb57"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ef15e30a8b83d79e606d8ff62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75895eeb1903f8a17816dafe0a"`);
    }

}
