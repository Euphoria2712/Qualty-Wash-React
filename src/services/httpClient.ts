
export const API_CONFIG = {
  usuarios: import.meta.env.VITE_API_USUARIOS_URL ?? "http://localhost:8081",
  productos: import.meta.env.VITE_API_PRODUCTOS_URL ?? "http://localhost:8082",
  ventas: import.meta.env.VITE_API_VENTAS_URL ?? "http://localhost:8083",
  contacto: import.meta.env.VITE_API_CONTACTO_URL ?? "http://localhost:8084",
} as const;

interface RequestOptions extends Omit<RequestInit, "body"> {
  skipJson?: boolean;
  body?: BodyInit | Record<string, unknown> | Array<unknown> | null;
}

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};


const handleResponse = async <T>(
  response: Response,
  skipJson?: boolean,
): Promise<T> => {
  if (response.status === 204 || skipJson) {
    return null as T;
  }

  const contentType = response.headers.get("content-type");
  const hasJson =
    contentType !== null && contentType.toLowerCase().includes("application/json");

  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string })?.message ??
      response.statusText ??
      "Error de comunicación con el servidor";

    const error = new Error(errorMessage);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return data as T;
};

const request = async <T>(
  path: string,
  baseUrl: string,
  { skipJson, headers, body: rawBody, ...options }: RequestOptions = {},
): Promise<T> => {
  let preparedBody: BodyInit | null | undefined = rawBody as
    | BodyInit
    | null
    | undefined;

  if (
    rawBody !== undefined &&
    rawBody !== null &&
    typeof rawBody !== "string" &&
    !(rawBody instanceof FormData) &&
    !(rawBody instanceof Blob) &&
    !(rawBody instanceof URLSearchParams)
  ) {
    preparedBody = JSON.stringify(rawBody);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: preparedBody,
  });

  return handleResponse<T>(response, skipJson);
};


export const createHttpClient = (baseUrl: string) => {


  const getAuth = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    get: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, baseUrl, {
        ...options,
        method: "GET",
        headers: {
          ...(options?.headers ?? {}),
          ...getAuth(),
        },
      }),

    post: <T>(path: string, body?: RequestOptions["body"], options?: RequestOptions) =>
      request<T>(path, baseUrl, {
        ...options,
        method: "POST",
        body,
        headers: {
          ...(options?.headers ?? {}),
          ...getAuth(),
        },
      }),

    put: <T>(path: string, body?: RequestOptions["body"], options?: RequestOptions) =>
      request<T>(path, baseUrl, {
        ...options,
        method: "PUT",
        body,
        headers: {
          ...(options?.headers ?? {}),
          ...getAuth(),
        },
      }),

    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, baseUrl, {
        ...options,
        method: "DELETE",
        headers: {
          ...(options?.headers ?? {}),
          ...getAuth(),
        },
      }),
  };
};


const httpClient = createHttpClient(API_CONFIG.usuarios);
export default httpClient;
