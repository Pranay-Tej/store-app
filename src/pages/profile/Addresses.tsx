import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import { useAuthContext } from '@/context/auth.context';
import { DELETE_ADDRESS_BY_PK, GET_ADDRESSES } from '@/graphql/addresses';
import useToggle from '@/hooks/useToggle';
import { Address } from '@/models/address.model';
import TheAddressModal from '@/pages/profile/components/TheAddressModal';
import { createProtectedGraphQlClient } from '@/utils/graphql-instance';
import { ActionIcon, Button, Loader } from '@mantine/core';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Pencil, Plus, Trash } from 'tabler-icons-react';

const Addresses = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();

  const { value: isAddressModalOpen, toggle: toggleAddressModal } =
    useToggle(false);

  const {
    data: addressList,
    isLoading,
    error
  } = useQuery<Address[]>(REACT_QUERY_KEYS.GET_ADDRESSES, async () => {
    const res = await createProtectedGraphQlClient().request(GET_ADDRESSES, {
      customer_id: userId
    });
    return res?.addresses;
  });

  const deleteAddressByPk = useMutation(
    async (addressId: string) => {
      const res = await createProtectedGraphQlClient().request(
        DELETE_ADDRESS_BY_PK,
        {
          id: addressId
        }
      );
      return res?.delete_addresses_by_pk;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REACT_QUERY_KEYS.GET_ADDRESSES);
      },
      onError: err => {
        console.error(err);
      }
    }
  );

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader variant="bars" />
      </div>
    );
  }

  return (
    <div className="my-5 max-w-5xl mx-auto p-5 lg:p-10 bg-white">
      <Button onClick={toggleAddressModal} leftIcon={<Plus />}>
        New Address
      </Button>
      <div className="grid gap-6 my-5">
        {addressList &&
          addressList.map(({ id, name, house, street, city, pincode }) => (
            <div
              key={id}
              className="max-w-md border-2 border-gray-200 rounded-md p-4 text-sm"
            >
              <div className="flex justify-between">
                <p className="text-base">{name}</p>
                <div className="flex gap-2">
                  <ActionIcon
                    onClick={() => {
                      setSelectedAddressId(id);
                      toggleAddressModal();
                    }}
                  >
                    <Pencil strokeWidth={1.5} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      deleteAddressByPk.mutate(id);
                    }}
                  >
                    <Trash strokeWidth={1.5} />
                  </ActionIcon>
                </div>
              </div>
              <div>{house}</div>
              <div>{street}</div>
              <div>
                {city} - {pincode}
              </div>
            </div>
          ))}
      </div>

      <TheAddressModal
        isAddressModalOpen={isAddressModalOpen}
        toggleAddressModal={toggleAddressModal}
        selectedAddressId={selectedAddressId}
        onClose={() => {
          setSelectedAddressId(undefined);
        }}
      />
    </div>
  );
};

export default Addresses;
