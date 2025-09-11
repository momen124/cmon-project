"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./entities/user.entity");
const product_entity_1 = require("./entities/product.entity");
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'your_password'),
    database: configService.get('DB_DATABASE', 'cmon-project'),
    entities: [user_entity_1.User, product_entity_1.Product],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map