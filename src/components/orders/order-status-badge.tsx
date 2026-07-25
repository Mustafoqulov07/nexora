import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<
  string,
  { label: string; variant: "default" | "brand" | "success" | "warning" | "danger" | "outline" }
> = {
  PENDING_PAYMENT: { label: "Ожидает оплаты", variant: "outline" },
  PAID_IN_ESCROW: { label: "Оплачен, в эскроу", variant: "brand" },
  DELIVERED: { label: "Товар передан", variant: "warning" },
  COMPLETED: { label: "Завершён", variant: "success" },
  DISPUTED: { label: "Спор открыт", variant: "danger" },
  CANCELLED: { label: "Отменён", variant: "outline" },
  REFUNDED: { label: "Возврат выполнен", variant: "default" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
