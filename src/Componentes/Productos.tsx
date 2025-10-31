
import React from 'react';


interface Producto {
    id: number;
    nombre: string;
    img: string;
    descripcion: string;
    precio: string; 
}


const productos: Producto[] = [
    { 
        id: 1, 
        nombre: "Detergente Ariel", 
        img: "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750043520892L.jpg",
        descripcion: "Fórmula concentrada para ropa blanca y de color, con un aroma fresco y duradero.",
        precio: "10.000"
    },
    { 
        id: 2, 
        nombre: "Suavizante Concentrado", 
        img: "https://tse3.mm.bing.net/th/id/OIP.efN73fwTzxEiu_PcOSQcpAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        descripcion: "Deja tus prendas increíblemente suaves, reduciendo arrugas y facilitando el planchado.",
        precio: "8.990"
    },
    { 
        id: 3, 
        nombre: "Blanqueador sin Cloro", 
        img: "https://fuller.com.co/cdn/shop/files/blanqueador-sin-cloro-2000-fuller.png?v=1723569730&width=1445",
        descripcion: "Elimina manchas difíciles sin dañar los tejidos, ideal para ropa delicada.",
        precio: "7.500"
    },
    { 
        id: 4, 
        nombre: "Quitamanchas", 
        img: "https://d2o812a6k13pkp.cloudfront.net/fit-in/1200x1200/filters:quality(100)/Categorias/40378192_01.jpeg20230227150220.jpg",
        descripcion: "Actúa directamente sobre las manchas, dejándolas listas para el lavado.",
        precio: "10.000"
    },
    { 
        id: 5, 
        nombre: "Limpiador Multiusos", 
        img: "https://a1.soysuper.com/e269c18c5f7fa3213f67590528d0cbee.1500.0.0.0.wmark.fc6b1a04.jpg",
        descripcion: "Perfecto para todas las superficies, con un aroma a cítricos que refresca tu hogar.",
        precio: "6.500"
    },
    { 
        id: 6, 
        nombre: "Toallitas Secadoras", 
        img: "https://arcashop.es/11914-large_default/toallitas-suavizantes-para-secadoras-40-toallitas-san-de-persan.jpg",
        descripcion: "Ayudan a reducir la estática y a mantener la frescura de tu ropa en cada ciclo de secado.",
        precio: "4.990"
    },
];


interface ProductCarouselProps {
    onAddToCart: (producto: Producto) => void; 
}

const ProductCarousel = ({ onAddToCart }: ProductCarouselProps) => {
    
    return (
        <section className="productos-limpieza">
            <h2>Productos de Limpieza</h2>
            <div className="lista-productos">
                {productos.map(producto => (
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
        </section>
    );
};

export default ProductCarousel;