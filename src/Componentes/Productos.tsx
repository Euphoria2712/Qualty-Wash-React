import { useEffect, useState } from 'react';
import productosService from '../services/productosService';
import type { Producto as ProductoApi } from '../services/productosService';


interface Producto {
    id: number;
    nombre: string;
    img: string;
    descripcion: string;
    precio: string; 
}

const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x400?text=Producto';


interface ProductCarouselProps {
    onAddToCart: (producto: Producto) => void; 
}

const ProductCarousel = ({ onAddToCart }: ProductCarouselProps) => {
    const [items, setItems] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const data = await productosService.obtenerProductos();
                const imgsRaw = localStorage.getItem('productoImagenes');
                const imgs = imgsRaw ? JSON.parse(imgsRaw) as Record<string, string> : {};
                const mapped: Producto[] = data.map((p: ProductoApi) => ({
                    id: p.id!,
                    nombre: p.nombre,
                    img: imgs[String(p.id!)] || p.imagenUrl || PLACEHOLDER_IMG,
                    descripcion: p.descripcion,
                    precio: (p.precio ?? 0).toLocaleString('es-CL', { minimumFractionDigits: 0 }),
                }));
                setItems(mapped);
                setError(null);
            } catch (err) {
                setError('Error al cargar productos de la tienda');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    return (
        <section className="productos-limpieza">
            <h2>Productos de Limpieza</h2>
            {loading && <div className="lista-productos">Cargando productos...</div>}
            {error && <div>{error}</div>}
            {!loading && !error && (
                <div className="lista-productos">
                    {items.map(producto => (
                        <div className="producto-card" key={producto.id}>
                            <img src={producto.img} alt={producto.nombre} />
                            <h3>{producto.nombre}</h3>
                            <p>{producto.descripcion}</p>
                            <span className="precio">${producto.precio}</span>
                            <button 
                                className="comprar-btn" 
                                onClick={() => onAddToCart(producto)} 
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductCarousel;
