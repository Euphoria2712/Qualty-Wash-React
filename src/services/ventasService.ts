import { createHttpClient, API_CONFIG } from './httpClient';

const ventasClient = createHttpClient(API_CONFIG.ventas);

const BASE_PATH = '/ventas';

export interface VentaItem {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface BoletaPayload {
  clienteId?: number;
  clienteEmail?: string | null;
  items: VentaItem[];
  total: number;
}

export const crearBoleta = (payload: BoletaPayload) => {
  return ventasClient.post<{ id: number }>(
    `${BASE_PATH}/boleta`,
    payload as unknown as Record<string, unknown>
  );
};

export interface VentaPayload {
  productoId: number;
  clienteId: number;
  cantidad: number;
  precioTotal: number;
  fechaVenta: string;
}

export const crearVenta = (payload: VentaPayload) => {
  return ventasClient.post<unknown>(
    `${BASE_PATH}`,
    payload as unknown as Record<string, unknown>
  );
};

export default { crearBoleta, crearVenta };
