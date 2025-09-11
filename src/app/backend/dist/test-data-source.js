"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("./data-source"));
async function testDataSource() {
    try {
        await data_source_1.default.initialize();
        console.log('Data source initialized successfully');
        await data_source_1.default.destroy();
    }
    catch (error) {
        console.error('Data source initialization failed:', error.message);
    }
}
testDataSource();
//# sourceMappingURL=test-data-source.js.map