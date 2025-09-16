import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758049768839 implements MigrationInterface {
    name = 'InitialSchema1758049768839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "governorate" character varying NOT NULL, "postalCode" character varying NOT NULL, "phone" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "shipping_info"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "shipping_info" jsonb`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
