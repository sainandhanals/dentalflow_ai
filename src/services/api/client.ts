const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export class ApiClient {
  private static baseUrl = BASE_URL;

  public static async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs = 4000
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      return json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      return {
        success: false,
        error: {
          message: isAbort
            ? 'Request timed out connecting to DentalFlow server'
            : 'Unable to connect to DentalFlow backend server',
          code: isAbort ? 'TIMEOUT' : 'CONNECTION_ERROR',
        },
      };
    }
  }

  public static get<T = any>(endpoint: string, timeoutMs?: number) {
    return this.request<T>(endpoint, { method: 'GET' }, timeoutMs);
  }

  public static post<T = any>(endpoint: string, data?: any, timeoutMs?: number) {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      timeoutMs
    );
  }

  public static patch<T = any>(endpoint: string, data?: any, timeoutMs?: number) {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      timeoutMs
    );
  }

  public static delete<T = any>(endpoint: string, timeoutMs?: number) {
    return this.request<T>(endpoint, { method: 'DELETE' }, timeoutMs);
  }
}
