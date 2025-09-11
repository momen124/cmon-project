"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductIndexes1757539955217 = void 0;
class AddProductIndexes1757539955217 {
    name = 'AddProductIndexes1757539955217';
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_75895eeb1903f8a17816dafe0a" ON "products" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ef15e30a8b83d79e606d8ff62" ON "products" ("sizes") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e0692d9239c976277a6c8fb57" ON "products" ("colors") `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_5e0692d9239c976277a6c8fb57"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ef15e30a8b83d79e606d8ff62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75895eeb1903f8a17816dafe0a"`);
    }
}
exports.AddProductIndexes1757539955217 = AddProductIndexes1757539955217;
//# sourceMappingURL=1757539955217-AddProductIndexes.js.map