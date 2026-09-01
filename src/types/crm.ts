export const LEAD_SOURCES = [
  "voice_agent",
  "email",
  "website",
  "instagram",
  "facebook",
  "sms",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_TAGS = [
  "VOICE_AGENT",
  "EMAIL",
  "WEBSITE",
  "INSTAGRAM",
  "FACEBOOK",
  "SMS",
  "OTHER",
] as const;

export type LeadTag = (typeof LEAD_TAGS)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "booked",
  "completed",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CONVERSATION_CHANNELS = [
  "voice",
  "email",
  "instagram",
  "facebook",
  "website",
  "sms",
  "other",
] as const;

export type ConversationChannel = (typeof CONVERSATION_CHANNELS)[number];

export const CONVERSATION_ROLES = ["user", "assistant", "system"] as const;

export type ConversationRole = (typeof CONVERSATION_ROLES)[number];

export interface Conversation {
  id: string;
  leadId: string;
  channel: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  tag: string;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  conversations?: Conversation[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedLeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationMeta;
}

export interface DashboardStats {
  totalLeads: number;
  voiceLeads: number;
  emailLeads: number;
  websiteLeads: number;
  instagramLeads: number;
  facebookLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  bookedLeads: number;
  completedLeads: number;
  lostLeads: number;
  recentActivity?: {
    totalConversations: number;
  };
}

export interface GetLeadsQuery {
  page?: number;
  limit?: number;
  source?: string;
  tag?: string;
  status?: string;
  search?: string;
  sortBy?: "createdAt" | "name" | "status" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface NewLeadInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string;
  tag?: string;
  message?: string | null;
  status?: string;
}

export interface UpdateLeadInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  source?: string;
  tag?: string;
  message?: string | null;
  status?: string;
}

export interface NewConversationInput {
  channel?: string;
  role: string;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}
