import type {
  DashboardStats,
  GetLeadsQuery,
  Lead,
  PaginatedLeadsResponse,
  NewLeadInput,
  UpdateLeadInput,
  Conversation,
  NewConversationInput,
  ApiResponse,
} from "../types/crm";

// Centralized API Base URL configuration
const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_URL"]) ||
  (typeof import.meta !== "undefined" && import.meta.env?.["NEXT_PUBLIC_API_URL"]) ||
  "http://localhost:5000";

class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ field?: string; message: string }> | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    if (errors !== undefined) {
      this.errors = errors;
    }
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        json?.message || `Request failed with status ${res.status}: ${res.statusText}`;
      throw new ApiError(errorMessage, res.status, json?.errors);
    }

    return json as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error?.message || "Network error. Please check if the backend server is running.",
      0
    );
  }
}

/**
 * Fetch aggregated CRM stats
 * GET /api/dashboard/stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await request<ApiResponse<DashboardStats>>("/api/dashboard/stats");
  if (!response.data) {
    throw new ApiError("Failed to fetch dashboard stats", 500);
  }
  return response.data;
}

/**
 * Fetch paginated leads with optional filters
 * GET /api/leads
 */
export async function getLeads(params?: GetLeadsQuery): Promise<PaginatedLeadsResponse> {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.source) searchParams.set("source", params.source);
    if (params.tag) searchParams.set("tag", params.tag);
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  }

  const queryStr = searchParams.toString();
  const endpoint = `/api/leads${queryStr ? `?${queryStr}` : ""}`;
  return request<PaginatedLeadsResponse>(endpoint);
}

/**
 * Fetch single lead by ID with conversations
 * GET /api/leads/:id
 */
export async function getLeadById(id: string): Promise<Lead> {
  const response = await request<ApiResponse<Lead>>(`/api/leads/${id}`);
  if (!response.data) {
    throw new ApiError(`Lead with ID '${id}' not found`, 404);
  }
  return response.data;
}

/**
 * Create a new lead
 * POST /api/leads
 */
export async function createLead(data: NewLeadInput): Promise<Lead> {
  const response = await request<ApiResponse<Lead>>("/api/leads", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.data) {
    throw new ApiError("Failed to create lead", 500);
  }
  return response.data;
}

/**
 * Update an existing lead
 * PATCH /api/leads/:id
 */
export async function updateLead(id: string, data: UpdateLeadInput): Promise<Lead> {
  const response = await request<ApiResponse<Lead>>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.data) {
    throw new ApiError("Failed to update lead", 500);
  }
  return response.data;
}

/**
 * Delete a lead by ID
 * DELETE /api/leads/:id
 */
export async function deleteLead(id: string): Promise<Lead> {
  const response = await request<ApiResponse<Lead>>(`/api/leads/${id}`, {
    method: "DELETE",
  });
  if (!response.data) {
    throw new ApiError("Failed to delete lead", 500);
  }
  return response.data;
}

/**
 * Get conversations for a lead
 * GET /api/leads/:leadId/conversations
 */
export async function getLeadConversations(leadId: string): Promise<Conversation[]> {
  const response = await request<ApiResponse<Conversation[]>>(
    `/api/leads/${leadId}/conversations`
  );
  return response.data || [];
}

/**
 * Add a conversation message to a lead
 * POST /api/leads/:leadId/conversations
 */
export async function addLeadConversation(
  leadId: string,
  data: NewConversationInput
): Promise<Conversation> {
  const response = await request<ApiResponse<Conversation>>(
    `/api/leads/${leadId}/conversations`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  if (!response.data) {
    throw new ApiError("Failed to add conversation message", 500);
  }
  return response.data;
}
