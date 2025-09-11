import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddProductIndexes1757539955217 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
