import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';

const Products = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { getProducts } = useProducts();

  const editProduct = (product: Product) => {
    setProduct(product);
    setIsEditModalOpen(true);
  };

  const addProduct = () => {
    setProduct(null);
    setIsAddModalOpen(true);
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();

      setProducts(products);
    };
    fetchProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('aaa', products);
  return (
    <div className="products-body">
      <header className="products-header">
        <h1>Tuotteet</h1>

        <div>
          <input></input>
          <button>Hae</button>
        </div>
        <div>
          <button onClick={() => addProduct()}>Lisää tuote</button>
        </div>
      </header>
      <main className="products-main">
        <table className="products-table">
          <thead className="products-thead">
            <tr>
              <th>Koodi</th>
              <th>Nimi</th>
              <th>Varastossa</th>
              <th>Hinta</th>
              <th>Viimeisin päivitys</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="products-tbody">
            {products &&
              products.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.updatedAt &&
                        new Date(product.updatedAt).toLocaleDateString('FI-fi')}
                    </td>
                    <td>
                      <button onClick={() => editProduct(product)}>
                        Muokkaa
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </main>
      {isEditModalOpen && (
        <EditProductModal
          onClose={() => setIsEditModalOpen(false)}
          product={product}
        />
      )}
      {isAddModalOpen && (
        <AddProductModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default Products;
