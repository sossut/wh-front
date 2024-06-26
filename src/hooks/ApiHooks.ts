import { Product } from './../intefaces/Product';
import { useState } from 'react';

import { apiUrl } from '../utils/variables';
import { SpotProps } from '../components/Spot';
import { RowProps } from '../components/Row';
import { PalletProps } from '../components/Pallet';
import { QuantityOption } from '../intefaces/QuantityOption';
import { OutDocket } from '../intefaces/OutDocket';
import { ProductHistory } from '../intefaces/ProductHistory';
import { InDocket } from '../intefaces/InDocket';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';
import { Vendor } from '../intefaces/Vendor';
import { DaysHours } from '../intefaces/DaysHours';
import { MonthsHours } from '../intefaces/MonthsHours';
import { DaysShipments } from '../intefaces/DaysShipments';

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

  const getSpotIdByRowGapSpot = async (
    row = 0,
    gap = 0,
    spot = 0
  ): Promise<SpotProps> => {
    try {
      const fetchOptions = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const id = await fetchJson(
        `${apiUrl}/spot/row-gap-spot/${row}/${gap}/${spot}`,
        fetchOptions
      );
      return id;
    } catch (error) {
      console.error(error);
      return {} as SpotProps;
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

  const getRowsWithGapsWithSpots = async (): Promise<RowProps[]> => {
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
      return {} as RowProps[];
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
    getSpotIdByRowGapSpot,
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

  const putProduct = async (id = 0, data: unknown): Promise<Product> => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/product/${id}`, options);
      return json as Product;
    } catch (error) {
      console.log(error);
      return {} as Product;
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

  const getProductHistory = async (id = 0): Promise<ProductHistory[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const history = await fetchJson(
        `${apiUrl}/product/history/${id}`,
        options
      );
      return history as ProductHistory[];
    } catch (error) {
      console.log(error);
      return {} as ProductHistory[];
    }
  };

  // useEffect(() => {
  //   getProducts();
  // }, []);

  return {
    products,
    getProducts,
    getProduct,
    postProduct,
    putProduct,
    product,
    getSpotsByProductCode,
    getQuantityOptions,
    getProductHistory
  };
};

const useOutDockets = () => {
  const [outDockets, setOutDockets] = useState<OutDocket[]>([]);
  const [outDocket, setOutDocket] = useState<OutDocket>({} as OutDocket);
  const getOutDockets = async (): Promise<OutDocket[]> => {
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

  const getOutDocketsByIds = async (data: unknown): Promise<OutDocket[]> => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const outDockets = await fetchJson(
        `${apiUrl}/outdocket/multiple`,
        options
      );
      return outDockets;
    } catch (error) {
      console.error(error);
      return {} as OutDocket[];
    }
  };

  const getOutDocketsBackOrder = async (
    data: unknown
  ): Promise<OutDocket[]> => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const outDockets = await fetchJson(
        `${apiUrl}/outdocket/back-order`,
        options
      );
      return outDockets;
    } catch (error) {
      console.error(error);
      return {} as OutDocket[];
    }
  };

  const getOutDocket = async (id = 0): Promise<OutDocket> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const outDocket = await fetchJson(`${apiUrl}/outdocket/${id}`, options);
      setOutDocket(outDocket);
      return outDocket;
    } catch (error) {
      return {} as OutDocket;
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

  const deleteOutDocket = async (id = 0) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(`${apiUrl}/outdocket/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getSentOutDockets = async (): Promise<SentOutDocket[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const sentOutDockets = await fetchJson(
        `${apiUrl}/sent-outdocket`,
        options
      );
      return sentOutDockets;
    } catch (error) {
      console.error(error);
      return {} as SentOutDocket[];
    }
  };

  const getPendingShipments = async (): Promise<PendingShipment[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const pendingShipments = await fetchJson(
        `${apiUrl}/sent-outdocket/pending`,
        options
      );
      return pendingShipments;
    } catch (error) {
      console.error(error);
      return {} as PendingShipment[];
    }
  };

  const getPendingShipment = async (id = 0): Promise<PendingShipment> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const pendingShipment = await fetchJson(
        `${apiUrl}/sent-outdocket/pending/${id}`,
        options
      );
      return pendingShipment;
    } catch (error) {
      console.error(error);
      return {} as PendingShipment;
    }
  };

  const deletePendingShipment = async (id = 0) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(
        `${apiUrl}/sent-outdocket/pending/${id}`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const postSentOutDocket = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      console.log(data);
      const json = await fetchJson(`${apiUrl}/sent-outdocket`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const postPendingShipment = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      console.log(data);
      const json = await fetchJson(`${apiUrl}/sent-outdocket/pending`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putPendingShipment = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      console.log(data);
      const json = await fetchJson(
        `${apiUrl}/sent-outdocket/pending/${id}`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getTransportOptions = async () => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const transportOptions = await fetchJson(
        `${apiUrl}/transport-option`,
        options
      );
      return transportOptions;
    } catch (error) {
      console.error(error);
      return {} as QuantityOption[];
    }
  };

  const postDaysShipments = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };

      const json = await fetchJson(
        `${apiUrl}/sent-outdocket/days-shipments`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putDaysShipments = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };

      const json = await fetchJson(
        `${apiUrl}/sent-outdocket/days-shipments/${id}`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getDaysShipment = async (id = 0) => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(
        `${apiUrl}/sent-outdocket/days-shipments/${id}`,
        options
      );
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getDaysShipments = async (): Promise<DaysShipments[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const daysShipments = await fetchJson(
        `${apiUrl}/sent-outdocket/days-shipments`,
        options
      );
      return daysShipments;
    } catch (error) {
      console.error(error);
      return {} as DaysShipments[];
    }
  };

  return {
    outDockets,
    getOutDockets,
    getOutDocketsByIds,
    getOutDocketsBackOrder,
    getPendingShipments,
    getPendingShipment,
    deletePendingShipment,
    getOutDocket,
    postOutDocket,
    putOutDocket,
    deleteOutDocket,
    outDocket,
    getSentOutDockets,
    postSentOutDocket,
    postPendingShipment,
    putPendingShipment,
    getTransportOptions,
    postDaysShipments,
    putDaysShipments,
    getDaysShipment,
    getDaysShipments
  };
};

const useInDockets = () => {
  const getInDockets = async (): Promise<InDocket[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const inDockets = await fetchJson(`${apiUrl}/indocket`, options);
      return inDockets;
    } catch (error) {
      console.error(error);
      return {} as InDocket[];
    }
  };
  const getInDocket = async (id = 0): Promise<InDocket> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const inDocket = await fetchJson(`${apiUrl}/indocket/${id}`, options);
      return inDocket;
    } catch (error) {
      console.error(error);
      return {} as InDocket;
    }
  };
  const postInDocket = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/indocket`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putInDocket = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/indocket/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInDocket = async (id = 0) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(`${apiUrl}/indocket/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };
  return {
    getInDockets,
    getInDocket,
    postInDocket,
    putInDocket,
    deleteInDocket
  };
};

const useClients = () => {
  const getClients = async (): Promise<Client[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const clients = await fetchJson(`${apiUrl}/client`, options);
      return clients;
    } catch (error) {
      console.error(error);
      return {} as Client[];
    }
  };

  const getClient = async (id = 0): Promise<Client> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const client = await fetchJson(`${apiUrl}/client/${id}`, options);
      return client;
    } catch (error) {
      console.error(error);
      return {} as Client;
    }
  };

  const postClient = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/client`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };
  return { getClients, getClient, postClient };
};

const useVendors = () => {
  const getVendors = async (): Promise<Vendor[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const vendors = await fetchJson(`${apiUrl}/vendor`, options);
      return vendors;
    } catch (error) {
      console.error(error);
      return {} as Vendor[];
    }
  };
  const getVendor = async (id = 0): Promise<Vendor> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const vendor = await fetchJson(`${apiUrl}/vendor/${id}`, options);
      return vendor;
    } catch (error) {
      console.error(error);
      return {} as Vendor;
    }
  };

  const postVendor = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/vendor`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };
  return { getVendors, getVendor, postVendor };
};

const useDaysHours = () => {
  const getDaysHoursList = async (): Promise<DaysHours[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const daysHours = await fetchJson(`${apiUrl}/days-hours`, options);
      return daysHours;
    } catch (error) {
      console.error(error);
      return {} as DaysHours[];
    }
  };
  const getDaysHours = async (id = 0): Promise<DaysHours> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const daysHours = await fetchJson(`${apiUrl}/days-hours/${id}`, options);
      return daysHours;
    } catch (error) {
      console.error(error);
      return {} as DaysHours;
    }
  };
  const postDaysHours = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/days-hours`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const putDaysHours = async (id = 0, data: unknown) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/days-hours/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDaysHours = async (id = 0) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const json = await fetchJson(`${apiUrl}/days-hours/${id}`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getMonthsHoursList = async (): Promise<MonthsHours[]> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const monthsHours = await fetchJson(
        `${apiUrl}/days-hours/months`,
        options
      );
      return monthsHours;
    } catch (error) {
      console.error(error);
      return {} as MonthsHours[];
    }
  };

  const getMonthsHours = async (id = 0): Promise<MonthsHours> => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const monthsHours = await fetchJson(
        `${apiUrl}/days-hours/months/${id}`,
        options
      );
      return monthsHours;
    } catch (error) {
      console.error(error);
      return {} as MonthsHours;
    }
  };

  const postMonthsHours = async (data: unknown) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      };
      const json = await fetchJson(`${apiUrl}/days-hours/months`, options);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getDaysHoursList,
    getDaysHours,
    postDaysHours,
    putDaysHours,
    deleteDaysHours,
    getMonthsHoursList,
    getMonthsHours,
    postMonthsHours
  };
};

export {
  useLogin,
  useWarehouse,
  useProducts,
  useOutDockets,
  useInDockets,
  useClients,
  useVendors,
  useDaysHours
};
