import React, { useEffect, useState } from 'react';
import { PalletProps } from './Pallet';
import { useProducts, useWarehouse } from '../hooks/ApiHooks';
import { Product } from '../intefaces/Product';

export interface PalletModalProps extends PalletProps {
  onClose: () => void;
  onUpdate?: (updatedPallet: PalletProps | null) => void;
  stateChanger: (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => void;
}

const PalletModal: React.FC<PalletModalProps> = ({
  id,
  onClose,
  spotId,
  onUpdate = () => {},
  stateChanger = () => {}
}) => {
  console.log('spotId', spotId);
  const {
    getPallet,
    pallet,
    postPallet,
    putPallet,
    deletePallet,
    getSpotIdByRowGapSpot,
    putPalletSpot
  } = useWarehouse();
  const { getProducts } = useProducts();
  const [productIds, setProductIds] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  console.log('Selected products at start', selectedProducts);
  const [changeSpot, setChangeSpot] = useState<{
    row: number;
    gap: number;
    spot: number;
    palletId: number;
  }>({ row: 0, gap: 0, spot: 0, palletId: id as number });

  const handleClick = () => {
    onClose();
  };
  console.log('PalletModal', pallet);
  console.log('palletId', id);
  useEffect(() => {
    // Fetch the pallet and products when the component mounts
    const fetchPalletAndProducts = async () => {
      console.log('Fetching pallet and products');
      const products = await getProducts();
      const sortedProducts = products.sort((a, b) =>
        a.code.localeCompare(b.code)
      );
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);

      if (id) {
        console.log('palletId', id);
        const pallet = await getPallet(id);
        console.log('Fetched pallet', pallet);

        setProductIds(
          Array.isArray(pallet?.products)
            ? pallet.products
                .map((product) => product.id)
                .filter((id): id is number => id !== undefined)
            : []
        );
        if (pallet?.products) {
          const sortedProducts = pallet.products.sort((a, b) =>
            a.code.localeCompare(b.code)
          );
          setSelectedProducts(sortedProducts);
        } else {
          setSelectedProducts([]);
        }
      } else {
        setProductIds([]);
        setSelectedProducts([]);
      }
    };

    fetchPalletAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addProduct = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!Array.isArray(products)) {
      console.error('products is not an array');
      return;
    }
    const selectElement = document.getElementById(
      'products-select'
    ) as HTMLSelectElement;
    const selectedProductId = parseInt(selectElement.value);
    if (!productIds.includes(selectedProductId)) {
      setProductIds((prevProductIds) => {
        const newProductIds = [...prevProductIds, selectedProductId];
        console.log('a', newProductIds);
        return newProductIds;
      });

      const selectedProduct = products.find(
        (product) => product.id === selectedProductId
      );
      if (selectedProduct) {
        setSelectedProducts((prevProducts) => [
          ...(Array.isArray(prevProducts) ? prevProducts : []),
          selectedProduct
        ]);
      }
    }
  };

  const handleDelete = (productId: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setProductIds(productIds.filter((id) => id !== productId));
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!Array.isArray(selectedProducts)) {
      console.error('selectedProducts is not an array');
      return;
    }
    let updatedPallet: PalletProps | null = null;
    try {
      if (!id && spotId) {
        const palletId = await postPallet(productIds);
        await putPallet(palletId.id, productIds, spotId);
        updatedPallet = await getPallet(palletId.id);
        //here change the state of the pallets. find the spot and update the state of the pallets
        stateChanger((prevPallets) => {
          // If the updatedPallet is null, return the previous state
          if (updatedPallet === null) {
            return prevPallets;
          }

          // Find the spot and replace the pallet at that spot with the updated pallet
          return prevPallets.map((pallet) =>
            pallet.spotId === spotId ? { ...pallet, ...updatedPallet } : pallet
          );
        });
      } else if (productIds.length !== 0 && spotId) {
        await putPallet(id, productIds, spotId);
        updatedPallet = await getPallet(id);
        stateChanger((prevPallets) => {
          const newPallets = [...prevPallets];
          const palletIndex = newPallets.findIndex(
            (pallet) => pallet.id === id
          );
          console.log('updatedPallet', updatedPallet);
          console.log('palletIndex', palletIndex);
          if (palletIndex !== -1 && updatedPallet !== null) {
            newPallets[palletIndex] = updatedPallet;
          }
          console.log('newPallets', newPallets);
          return newPallets;
        });
      } else {
        await deletePallet(id);
        updatedPallet = null;

        stateChanger((prevPallets) => {
          const newPallets = [...prevPallets];
          const palletIndex = newPallets.findIndex(
            (pallet) => pallet.id === id
          );
          console.log('updatedPallet', updatedPallet);
          console.log('palletIndex', palletIndex);
          if (palletIndex !== -1) {
            newPallets[palletIndex] = {
              ...newPallets[palletIndex],
              id: 0,
              products: []
            };
          }
          console.log('newPallets', newPallets);
          return newPallets;
        });
      }
      console.log('Updated pallet:', updatedPallet);
      if (onUpdate) {
        onUpdate(updatedPallet);
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the form from being submitted
  };

  const searchProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.code.toLowerCase().startsWith(searchValue)
    );
    setFilteredProducts(filtered);
  };
  const handleSpotChange = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('changeSpot', changeSpot);
    const spotId = await getSpotIdByRowGapSpot(
      changeSpot.row,
      changeSpot.gap,
      changeSpot.spot
    );
    if (spotId.palletId !== null) {
      alert('Paikka on jo varattu');
      return;
    }
    await putPalletSpot(pallet.id, spotId.id as number);
    stateChanger((prevPallets) => {
      return prevPallets.map((pallet) => {
        if (pallet.id === id) {
          return { ...pallet, spotId: spotId.id as number };
        }
        return pallet;
      });
    });
  };
  return (
    <div className="modal">
      <button className="close-button" onClick={handleClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Lavan Tuotteet</h3>
        <form className="pallet-form" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="product-search">Hae tuottetta</label>
            <input
              onChange={searchProducts}
              type="text"
              id="product-search"
              name="product-search"
            />
            <label htmlFor="products-select">Tuotteet</label>
            <select id="products-select" name="products-select">
              {Array.isArray(filteredProducts) &&
                filteredProducts.map((product, index) => (
                  <option key={index} value={`${product.id}`}>
                    {product.code}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="button"
            className="add-product-button"
            onClick={addProduct}
          >
            Lisää tuote
          </button>
          <button type="button" id="save-pallet" onClick={handleSubmit}>
            Tallenna
          </button>
          <ul className="products-list">
            {Array.isArray(selectedProducts) &&
              selectedProducts.map((product, index) => (
                <li data-id={`${product.id}`} key={index}>
                  <div className="pallet-product-div">
                    <p>{product.code}</p>
                    <button
                      type="button"
                      className="pallet-product-delete-button"
                      onClick={() => {
                        if (product.id !== undefined) {
                          handleDelete(product.id);
                        }
                      }}
                    >
                      Poista
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </form>
        {id != 0 && (
          <form onSubmit={handleSpotChange}>
            <h3>Vaihda lavan paikkaa</h3>
            <div>
              <label>
                Rivi
                <input
                  type="number"
                  value={changeSpot.row}
                  onChange={(e) =>
                    setChangeSpot({
                      ...changeSpot,
                      row: parseInt(e.target.value)
                    })
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Väli
                <input
                  type="number"
                  value={changeSpot.gap}
                  onChange={(e) =>
                    setChangeSpot({
                      ...changeSpot,
                      gap: parseInt(e.target.value)
                    })
                  }
                />
              </label>
            </div>
            <div>
              <label>
                Paikka
                <input
                  type="number"
                  value={changeSpot.spot}
                  onChange={(e) =>
                    setChangeSpot({
                      ...changeSpot,
                      spot: parseInt(e.target.value)
                    })
                  }
                />
              </label>
            </div>
            <button type="submit">Vaihda paikkaa</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PalletModal;
