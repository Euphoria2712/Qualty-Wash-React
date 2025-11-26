import { createHttpClient, API_CONFIG } from './httpClient';

const contactoClient = createHttpClient(API_CONFIG.contacto);

const BASE_PATH = '/contactos';

export interface ContactoPayload {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

export const crearContacto = (payload: ContactoPayload) => {
  return contactoClient.post<{ id?: number }>(
    `${BASE_PATH}`,
    payload as unknown as Record<string, unknown>
  );
};

export default { crearContacto };
