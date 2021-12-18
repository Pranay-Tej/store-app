import { API_URL } from '@/constants/app.constants';
import useAxios from '@/hooks/useAxios';
import useToggle from '@/hooks/useToggle';
import { Address } from '@/models/address.model';
import TheAddressModal from '@/pages/profile/components/TheAddressModal';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';

const Addresses = () => {
  const {
    execute: fetchAddresses,
    data: addressList,
    errorMessage,
    isLoading
  } = useAxios<Address[]>();

  const [addressId, setAddressId] = useState<number | null>(null);

  const { value: isAddressModalOpen, toggle: toggleAddressModal } =
    useToggle(false);

  useEffect(() => {
    fetchAddresses({ url: `${API_URL}/addresses` });
  }, []);

  const handleAddressModalClose = (shouldRefresh: boolean = false) => {
    if (shouldRefresh) {
      fetchAddresses({ url: `${API_URL}/addresses` });
    }
    setAddressId(null);
  };

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      {addressList &&
        addressList.map(address => (
          <div
            key={address.id}
            onClick={() => {
              setAddressId(address.id);
              toggleAddressModal();
            }}
          >
            <div>{address.id}</div>
            <div>{address.name}</div>
          </div>
        ))}
      <Button onClick={toggleAddressModal}>New Address</Button>

      <TheAddressModal
        isAddressModalOpen={isAddressModalOpen}
        toggleAddressModal={toggleAddressModal}
        addressId={addressId}
        handleAddressModalClose={handleAddressModalClose}
      />
    </div>
  );
};

export default Addresses;
