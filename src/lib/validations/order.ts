import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().cuid(),
});

export const confirmReceiptSchema = z.object({
  orderId: z.string().cuid(),
});

export const markDeliveredSchema = z.object({
  orderId: z.string().cuid(),
  deliveryPayload: z.string().min(1, "Укажите данные для передачи покупателю").max(4000),
});

export const openDisputeSchema = z.object({
  orderId: z.string().cuid(),
  reason: z.string().min(10, "Опишите проблему подробнее (не менее 10 символов)").max(2000),
});

export const resolveDisputeSchema = z.object({
  orderId: z.string().cuid(),
  resolution: z.enum(["COMPLETE", "REFUND"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type MarkDeliveredInput = z.infer<typeof markDeliveredSchema>;
export type OpenDisputeInput = z.infer<typeof openDisputeSchema>;
