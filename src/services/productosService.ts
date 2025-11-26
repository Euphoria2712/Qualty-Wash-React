import { createHttpClient, API_CONFIG } from './httpClient';

const productosClient = createHttpClient(API_CONFIG.productos);

export interface Producto {
  id?: number;
  nombre: string;
  tipo: string;
  stock: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
}

export const productosService = {

  obtenerProductos: async (): Promise<Producto[]> => {
    const data = await productosClient.get<Producto[] | null>('/api/productos');
    return data ?? [];
  },

  obtenerProductoPorId: async (id: number): Promise<Producto> => {
    return productosClient.get<Producto>(`/api/productos/${id}`);
  },

  crearProducto: async (producto: Producto): Promise<Producto> => {
    return productosClient.post<Producto>(
      '/api/productos',
      producto as unknown as Record<string, unknown>
    );
  },

  actualizarProducto: async (id: number, producto: Producto): Promise<Producto> => {
    return productosClient.put<Producto>(
      `/api/productos/${id}`,
      producto as unknown as Record<string, unknown>
    );
  },

  eliminarProducto: async (id: number): Promise<void> => {
    return productosClient.delete<void>(`/api/productos/${id}`);
  },
};

export default productosService;
