import { createHttpClient, API_CONFIG } from "./httpClient";


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: string;
  token: string;
  message: string;
}

export interface UserModel {
  id: number;
  tipoUsuario: string;
  run: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  password: string;
}


export type CreateUserPayload = Omit<UserModel, "id">;

const httpClient = createHttpClient(API_CONFIG.usuarios);

const BASE_PATH = "/api/usuarios";


export const login = (payload: LoginRequest) => {
  return httpClient.post<LoginResponse>(
    `${BASE_PATH}/login`,
    payload as unknown as Record<string, unknown>
  );
};

export const createUser = (payload: CreateUserPayload) => {
  return httpClient.post<UserModel>(
    BASE_PATH,
    payload as unknown as Record<string, unknown>
  );
};

export const getUserById = (id: number) => {
  return httpClient.get<UserModel>(`${BASE_PATH}/${id}`);
};

export const getUserByEmail = (email: string) => {
  return httpClient.get<UserModel>(`${BASE_PATH}/email/${encodeURIComponent(email)}`);
};
