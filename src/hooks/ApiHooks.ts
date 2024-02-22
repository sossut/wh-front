import { Product } from './../intefaces/Product';
import { useEffect, useState } from 'react';

import { apiUrl } from '../utils/variables';
import { SpotProps } from '../components/Spot';
import { RowProps } from '../components/Row';
import { PalletProps } from '../components/Pallet';
import { QuantityOption } from '../intefaces/QuantityOption';
import { OutDocket } from '../intefaces/OutDocket';

const fetchJson = async (url: string, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.message;
      throw new Error(message);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw e;
    }
  }
};

const useLogin = () => {
  const postLogin = async (inputs: unknown) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputs)
    };
    const json = await fetchJson(`${apiUrl}/auth/login`, options);
    return json;
  };
  return { postLogin };
};

const useWarehouse = () => {
  const [spots, setSpots] = useState<SpotProps[]>([]);
  // const [update, setUpdate] = useState(false);
  const [rows, setRows] = useState<RowProps[]>([]);
  const [pallet, setPallet] = useState<PalletProps>({} as PalletProps);
  const [pallets, setPallets] = useState<PalletProps[]>([]);
  console.log('useWarehouse loaded');
  const getSpots = async () => {
    try {
      const fetchOptions = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const spots = await fetchJson(`${apiUrl}/spot`, fetchOptions);
      setSpots(spots);
    } catch (error) {
      console.error(error);
    }
  };

  const getSpot = async (id = 0) => {
    try {
      const fetchOptions = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const spot = await fetchJson(`${apiUrl}/spot/${id}`, fetchOptions);
      return spot;
    } catch (error) {
      console.error(error);
    }
  };

  const postSpots = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/spot/all`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putSpot = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/spot/${id}`, options);
      console.log(json);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getRowsWithGapsWithSpots = async () => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const rows = await fetchJson(`${apiUrl}/row/nested`, options);
      setRows(rows);
      return rows as RowProps[];
    } catch (error) {
      console.log(error);
      return {} as RowProps;
    }
  };

  const getPallet = async (id = 0): Promise<PalletProps> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const pallet = await fetchJson(`${apiUrl}/pallet/${id}`, options);
      setPallet(pallet);
      return pallet;
    } catch (error) {
      console.log(error);
      return {} as PalletProps;
    }
  };

  const getPallets = async (): Promise<PalletProps[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const pallets = await fetchJson(`${apiUrl}/pallet`, options);
      setPallets(pallets);
      return pallets;
    } catch (error) {
      console.log(error);
      return {} as PalletProps[];
    }
  };

  const postPallet = async (productIds: number[]) => {
    const data = {
      products: productIds.map((productId) => ({ productId: productId }))
    };
    console.log('postPallet', data);
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/pallet`, options);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const putPallet = async (id = 0, productIds: number[], spotId: number) => {
    const data = {
      products: productIds.map((productId) => ({ productId: productId })),
      spotId: spotId
    };
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/pallet/${id}`, options);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const putPalletSpot = async (id = 0, spotId: number) => {
    const data = {
      spotId: spotId
    };
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/pallet/${id}`, options);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const deletePallet = async (id = 0) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(`${apiUrl}/pallet/${id}`, options);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getSpots,
    getSpot,
    postSpots,
    putSpot,
    getRowsWithGapsWithSpots,
    getPallet,
    getPallets,
    postPallet,
    putPallet,
    putPalletSpot,
    deletePallet,
    spots,
    rows,
    pallet,
    pallets
  };
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({} as Product);
  const getProducts = async (): Promise<Product[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const products = await fetchJson(`${apiUrl}/product`, options);
      setProducts(products);
      return products as Product[];
    } catch (error) {
      console.log(error);
      return {} as Product[];
    }
  };

  const getProduct = async (id = 0): Promise<Product> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const product = await fetchJson(`${apiUrl}/product/${id}`, options);

      setProduct(product);

      return product;
    } catch (error) {
      console.log(error);
      return {} as Product;
    }
  };

  const postProduct = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/product`, options);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const getSpotsByProductCode = async (code = ''): Promise<SpotProps[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const spots = await fetchJson(`${apiUrl}/spot/product/${code}`, options);
      return spots as SpotProps[];
    } catch (error) {
      console.log(error);
      return {} as SpotProps[];
    }
  };

  const getQuantityOptions = async (): Promise<QuantityOption[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const quantityOptions = await fetchJson(
        `${apiUrl}/quantity-option`,
        options
      );
      return quantityOptions;
    } catch (error) {
      console.log(error);
      return {} as QuantityOption[];
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    getProducts,
    getProduct,
    postProduct,
    product,
    getSpotsByProductCode,
    getQuantityOptions
  };
};

const useOutDockets = () => {
  const [outDockets, setOutDockets] = useState<OutDocket[]>([]);
  const [outDocket, setOutDocket] = useState<OutDocket>({} as OutDocket);
  const getOutDockets = async () => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const outDockets = await fetchJson(`${apiUrl}/outdocket`, options);
      setOutDockets(outDockets);
      return outDockets;
    } catch (error) {
      console.error(error);
      return {} as OutDocket[];
    }
  };

  const getOutDocket = async (id = 0) => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const outDocket = await fetchJson(`${apiUrl}/outdocket/${id}`, options);
      setOutDocket(outDocket);
    } catch (error) {
      console.error(error);
    }
  };

  const postOutDocket = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/outdocket`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putOutDocket = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/outdocket/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const postSentOutDocket = async (id = 0) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(
        `${apiUrl}/outdocket/${id}/sent`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    outDockets,
    getOutDockets,
    getOutDocket,
    postOutDocket,
    putOutDocket,
    outDocket,
    postSentOutDocket
  };
};

export { useLogin, useWarehouse, useProducts, useOutDockets };
