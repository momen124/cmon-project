"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const product_entity_1 = require("../entities/product.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    productsRepository;
    dataSource;
    constructor(ordersRepository, productsRepository, dataSource) {
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
        this.dataSource = dataSource;
    }
    async create(createOrderDto, user) {
        const { orderItems, shipping_info } = createOrderDto;
        let totalPrice = 0;
        const orderItemsToCreate = [];
        for (const item of orderItems) {
            const product = await this.productsRepository.findOne({ where: { id: item.productId } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID "${item.productId}" not found`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Not enough stock for product "${product.name_en}"`);
            }
            totalPrice += product.price * item.quantity;
            const orderItem = new order_item_entity_1.OrderItem();
            orderItem.product = product;
            orderItem.quantity = item.quantity;
            orderItem.price = product.price;
            orderItemsToCreate.push(orderItem);
        }
        const order = new order_entity_1.Order();
        order.user = user;
        order.shipping_info = shipping_info;
        order.total_price = totalPrice;
        order.orderItems = orderItemsToCreate;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of orderItemsToCreate) {
                item.product.stock -= item.quantity;
                await queryRunner.manager.save(item.product);
            }
            const savedOrder = await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return savedOrder;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    findAllForUser(userId) {
        return this.ordersRepository.find({ where: { user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
    }
    async findOneForUser(id, userId) {
        const order = await this.ordersRepository.findOne({ where: { id, user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found for user "${userId}"`);
        }
        return order;
    }
    findAllForAdmin() {
        return this.ordersRepository.find({ relations: ['orderItems', 'orderItems.product', 'user'] });
    }
    async updateStatus(id, updateOrderStatusDto) {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
        order.status = updateOrderStatusDto.status;
        return this.ordersRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map