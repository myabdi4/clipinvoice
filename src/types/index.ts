export type DealStatus = "draft" | "sent" | "viewed" | "paid";

export type Deal = {
  id: string;
  user_id: string;
  brand_name: string;
  title: string;
  total_amount: number;
  status: DealStatus;
  share_slug: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  due_date: string | null;
};

export type DealDeliverable = {
  id: string;
  deal_id: string;
  description: string;
  quantity: number;
  price: number | null;
  created_at: string;
};

export type DealEvent = {
  id: string;
  deal_id: string;
  event_type: "created" | "sent" | "viewed" | "paid";
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  channel_name: string | null;
  created_at: string;
  updated_at: string;
};
