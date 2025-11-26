import { useState, useEffect } from 'react';
import productosService from '../services/productosService';
import type { Producto } from '../services/productosService';
import '../Styles/GestionProducto.css';

interface UserProfile {
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

type AppView = "dashboard" | "tienda" | "perfil" | "contacto" | "gestionProductos";

interface GestionProductosProps {
  user: UserProfile;
  onLogout: () => void;
  navigateTo: (view: AppView) => void;
}

export default function GestionProductos({ navigateTo }: GestionProductosProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [formData, setFormData] = useState<Producto>({
    nombre: '',
    tipo: '',
    stock: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productosService.obtenerProductos();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) || 0 : value,
    }));
  };

  const abrirModalCrear = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      tipo: '',
      stock: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
    });
    setShowModal(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setEditingProduct(producto);
    setFormData(producto);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      tipo: '',
      stock: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
    });
  };

  const handleSeed = async () => {
    if (isSeeding) return;
    setError(null);
    setIsSeeding(true);
    const sampleProducts: Omit<Producto, 'id'>[] = [
      {
        nombre: 'Shampoo Premium',
        tipo: 'LAVADO',
        stock: '100',
        descripcion: 'Shampoo para lavado profundo de tapicería',
        precio: 9.99,
      },
      {
        nombre: 'Cera Líquida',
        tipo: 'DETALLADO',
        stock: '80',
        descripcion: 'Cera protectora con acabado brillante',
        precio: 14.5,
      },
      {
        nombre: 'Desengrasante',
        tipo: 'MOTOR',
        stock: '50',
        descripcion: 'Desengrasante para motor y piezas metálicas',
        precio: 12.0,
      },
    ];

    try {
      for (const p of sampleProducts) {
        await productosService.crearProducto(p as Producto);
      }
      await cargarProductos();
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      const msg = status ? `Error al cargar datos de ejemplo (código: ${status})` : 'Error al cargar datos de ejemplo';
      setError(msg);
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  const validarProducto = (p: Producto): string | null => {
    if (!p.nombre || !p.nombre.trim()) return 'El nombre es obligatorio';
    if (!p.tipo || !p.tipo.trim()) return 'El tipo es obligatorio';
    if (!p.stock || !p.stock.trim()) return 'El stock es obligatorio';
    if (!/^\d+$/.test(p.stock)) return 'El stock debe ser un número entero';
    if (p.precio === undefined || p.precio === null) return 'El precio es obligatorio';
    if (isNaN(p.precio)) return 'El precio debe ser numérico';
    if (p.precio < 0) return 'El precio debe ser mayor o igual a 0';
    if (!p.descripcion || !p.descripcion.trim()) return 'La descripción es obligatoria';
    if (!p.imagenUrl || !p.imagenUrl.trim()) return 'La imagen (URL) es obligatoria';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const validationError = validarProducto(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setIsSubmitting(true);
      if (editingProduct) {
        const actualizado = await productosService.actualizarProducto(editingProduct.id!, formData);
        if (formData.imagenUrl && actualizado?.id) {
          const imgsRaw = localStorage.getItem('productoImagenes');
          const imgs = imgsRaw ? JSON.parse(imgsRaw) as Record<string, string> : {};
          imgs[String(actualizado.id)] = formData.imagenUrl;
          localStorage.setItem('productoImagenes', JSON.stringify(imgs));
        }
        setSuccess('Producto actualizado correctamente');
      } else {
        const creado = await productosService.crearProducto(formData);
        if (formData.imagenUrl && creado?.id) {
          const imgsRaw = localStorage.getItem('productoImagenes');
          const imgs = imgsRaw ? JSON.parse(imgsRaw) as Record<string, string> : {};
          imgs[String(creado.id)] = formData.imagenUrl;
          localStorage.setItem('productoImagenes', JSON.stringify(imgs));
        }
        setSuccess('Producto creado correctamente');
      }
      
      await cargarProductos();
      cerrarModal();
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      const baseMsg = editingProduct ? 'Error al actualizar producto' : 'Error al crear producto';
      setError(status ? `${baseMsg} (código: ${status})` : baseMsg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productosService.eliminarProducto(id);
      const imgsRaw = localStorage.getItem('productoImagenes');
      if (imgsRaw) {
        const imgs = JSON.parse(imgsRaw) as Record<string, string>;
        delete imgs[String(id)];
        localStorage.setItem('productoImagenes', JSON.stringify(imgs));
      }
      await cargarProductos();
      setSuccess('Producto eliminado correctamente');
    } catch (err) {
      setError('Error al eliminar producto');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fondo">
        <div className="loading-container">
          <div className="loading-text">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fondo">
      <div className="productos-container">
        <div className="productos-header">
          <div className="header-left">
            <button onClick={() => navigateTo('dashboard')} className="boton-volver">
              ← Volver
            </button>
            <h1>Gestión de Productos</h1>
          </div>
          <button onClick={abrirModalCrear} className="boton-nuevo">
            + Nuevo Producto
          </button>
        </div>

        {error && (
          <div className="mensaje-error-box">
            {error}
          </div>
        )}
        {success && (
          <div className="mensaje-exito-box">
            {success}
            <div className="acciones-exito" style={{ marginTop: '10px' }}>
              <button onClick={() => navigateTo('tienda')} className="boton-accion">Ver en tienda</button>
            </div>
          </div>
        )}

        <div className="tabla-container">
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td className="producto-nombre">{producto.nombre}</td>
                  <td>{producto.tipo}</td>
                  <td>{producto.stock}</td>
                  <td className="producto-precio">${producto.precio.toFixed(2)}</td>
                  <td className="acciones-cell">
                    <button
                      onClick={() => abrirModalEditar(producto)}
                      className="boton-accion boton-editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id!)}
                      className="boton-accion boton-eliminar"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {productos.length === 0 && (
            <div className="tabla-vacia">
              <div>No hay productos registrados</div>
              <div className="acciones-vacia">
                <button onClick={handleSeed} className="boton-accion" disabled={isSeeding}>
                  {isSeeding ? 'Cargando ejemplo...' : 'Cargar productos de ejemplo'}
                </button>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-contenedor">
              <h2 className="modal-titulo">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              
              <form onSubmit={handleSubmit} className="modal-formulario">
                <div className="input-grupo">
                  <label className="input-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    maxLength={25}
                    className="input-campo"
                  />
                </div>

                <div className="input-grupo">
                  <label className="input-label">Tipo</label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    maxLength={25}
                    className="input-campo"
                  />
                </div>

                <div className="input-grupo">
                  <label className="input-label">Imagen (URL)</label>
                  <input
                    type="url"
                    name="imagenUrl"
                    value={formData.imagenUrl || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="https://..."
                    className="input-campo"
                  />
                </div>

                <div className="input-grupo">
                  <label className="input-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="input-campo"
                  />
                </div>

                <div className="input-grupo">
                  <label className="input-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    rows={3}
                    className="input-campo textarea-campo"
                  />
                </div>

                <div className="input-grupo">
                  <label className="input-label">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="input-campo"
                  />
                </div>

                <div className="modal-botones">
                  <button type="submit" className="boton-enviar" disabled={isSubmitting}>
                    {isSubmitting ? (editingProduct ? 'Actualizando...' : 'Creando...') : (editingProduct ? 'Actualizar' : 'Crear')}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="boton-cancelar"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
