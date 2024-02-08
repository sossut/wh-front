import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';

const Products = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  const { getProducts } = useProducts();

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
          <button>Lisää tuote</button>
        </div>
      </header>
      <main className="products-main">
        <table className="products-table">
          <thead className="products-thead">
            <tr>
              <th>Koodi</th>
              <th>Nimi</th>
              <th>Varastossa</th>
              <th>Varattu</th>
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
                    <td>{0}</td>
                    <td>{0}</td>
                    <td>{0}</td>
                    <td>
                      <button>Muokkaa</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Products;
