import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758049340002 implements MigrationInterface {
    name = 'InitialSchema1758049340002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
