import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';
import EditProductModal from '../components/EditProductModal';
import AddProductModal from '../components/AddProductModal';
import ProductHistoryModal from '../components/ProductHistoryModal';

const Products = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const { getProducts } = useProducts();

  const editProduct = (product: Product) => {
    setProduct(product);
    setIsEditModalOpen(true);
  };

  const addProduct = () => {
    setProduct(null);
    setIsAddModalOpen(true);
  };

  const historyProduct = (product: Product) => {
    setProduct(product);
    setIsHistoryModalOpen(true);
  };

  const sortProducts = (products: Product[]) => {
    if (!Array.isArray(products)) {
      console.error(
        'sortProducts was called with a non-array value:',
        products
      );
      return [];
    }
    if (products.length === 0) {
      return [];
    }
    return products.sort((a, b) => a.code.localeCompare(b.code));
  };

  const handleState = (
    updateFunction: (prevProducts: Product[]) => Product[]
  ) => {
    setProducts(updateFunction);
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();

      setProducts(products);
    };
    fetchProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    sortProducts(products);
    setFilteredProducts(products);
  }, [products]);
  console.log('aaa', products);
  return (
    <div className="products-body common-body">
      <header className="products-header common-header">
        <h1>Tuotteet</h1>

        <div>
          <input
            onChange={(event) => {
              if (event.target.value === '') {
                setFilteredProducts(products);
                return;
              }
              try {
                setFilteredProducts(
                  products.filter((product) =>
                    product.code
                      .toLowerCase()
                      .startsWith(event.target.value.toLowerCase())
                  )
                );
              } catch (error) {
                console.log(error);
              }
            }}
          ></input>
          <button>Hae</button>
        </div>
        <div>
          <button onClick={() => addProduct()}>Lisää tuote</button>
        </div>
      </header>
      <main className="products-main common-main">
        <table className="products-table common-table">
          <thead className="products-thead common-thead">
            <tr>
              <th>Koodi</th>
              <th>Nimi</th>
              <th>Varastossa</th>
              <th>Hinta</th>

              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="products-tbody common-tbody">
            {filteredProducts &&
              filteredProducts.length > 0 &&
              filteredProducts.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>

                    <td>
                      <button onClick={() => editProduct(product)}>
                        Muokkaa
                      </button>
                    </td>
                    <td>
                      <button onClick={() => historyProduct(product)}>
                        Historia
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
          stateChanger={handleState}
        />
      )}
      {isAddModalOpen && (
        <AddProductModal
          addProduct={(newProduct) => setProducts([...products, newProduct])}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      {isHistoryModalOpen && (
        <ProductHistoryModal
          product={product}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;
