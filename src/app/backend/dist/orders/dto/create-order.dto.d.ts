declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    orderItems: OrderItemDto[];
    shipping_info: object;
}
export {};
