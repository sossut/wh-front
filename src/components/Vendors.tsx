import React from 'react';
import { Vendor } from '../intefaces/Vendor';
import { useVendors } from '../hooks/ApiHooks';

export interface VendorsProps {
  vendors: Vendor[];
  updateVendorsState: (updateFunction: (vendors: Vendor[]) => Vendor[]) => void;
}

const Vendors: React.FC<VendorsProps> = ({ vendors, updateVendorsState }) => {
  const [newVendorName, setNewVendorName] = React.useState('');
  const { postVendor } = useVendors();
  const addNewVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const post = await postVendor({ name: newVendorName });
    if (!post) {
      console.error('Failed to post new vendor');
      return;
    }
    updateVendorsState((prevVendors) => [
      ...prevVendors,
      {
        id: post.id,
        name: newVendorName
      }
    ]);
  };

  return (
    <div>
      <h1>Toimittajat</h1>
      <form onSubmit={addNewVendor}>
        <input
          type="text"
          placeholder="Toimittajan nimi"
          onChange={(e) => {
            setNewVendorName(e.target.value);
          }}
        />
        <button type="submit">Lisää toimittaja</button>
      </form>
      <div>
        {Array.isArray(vendors) &&
          vendors.map((vendor) => (
            <div key={vendor.id}>
              <p>{vendor.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Vendors;
