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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const wishlist_entity_1 = require("../entities/wishlist.entity");
let WishlistService = class WishlistService {
    wishlistRepository;
    productsRepository;
    constructor(wishlistRepository, productsRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productsRepository = productsRepository;
    }
    async getWishlist(user) {
        const wishlistItems = await this.wishlistRepository.find({
            where: { userId: user.id },
            relations: ['product'],
        });
        return wishlistItems.map(item => item.product);
    }
    async addToWishlist(addToWishlistDto, user) {
        const { productId } = addToWishlistDto;
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${productId}" not found`);
        }
        const wishlistItem = this.wishlistRepository.create({
            userId: user.id,
            productId: product.id,
        });
        return this.wishlistRepository.save(wishlistItem);
    }
    async removeFromWishlist(productId, user) {
        const result = await this.wishlistRepository.delete({
            userId: user.id,
            productId: productId,
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Product with ID "${productId}" not found in wishlist`);
        }
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map