import { REACT_QUERY_KEYS } from '@/constants/react-query-keys.constants';
import {
  MAX_LENGTH_MESSAGE,
  MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE
} from '@/constants/validation.constants';
import { AddressResponse } from '@/models/address.model';
import {
  useGetAddressByPkQuery,
  useInsertAddressMutation,
  useUpdateAddressByPkMutation
} from '@/utils/__generated__/graphql';
import {
  Button,
  Divider,
  Loader,
  LoadingOverlay,
  Modal,
  TextInput
} from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export interface AddressForm {
  name: string;
  mobile: string;
  house: string;
  street: string;
  landmark?: string | undefined;
  city: string;
  pincode: string;
}

const TheAddressModal: React.FC<{
  isAddressModalOpen: boolean;
  toggleAddressModal: () => void;
  selectedAddressId: string | undefined;
  onClose: () => void;
}> = ({
  isAddressModalOpen,
  toggleAddressModal,
  selectedAddressId,
  onClose
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset: resetAddressForm
  } = useForm<AddressForm>({
    defaultValues: {
      name: '',
      mobile: '',
      house: '',
      street: '',
      landmark: '',
      city: '',
      pincode: ''
    }
  });

  const {
    isFetching: isFetchAddressByPkLoading,
    isError: fetchAddressByPkError
  } = useGetAddressByPkQuery(
    {
      id: selectedAddressId
    },
    {
      select: res => res.addresses_by_pk,
      enabled: isAddressModalOpen && selectedAddressId !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: data => {
        setFormValues(data as AddressResponse);
      }
    }
  );

  const setFormValues = ({
    name,
    mobile,
    house,
    street,
    landmark,
    city,
    pincode
  }: AddressResponse) => {
    setValue('name', name);
    setValue('mobile', mobile);
    setValue('house', house);
    setValue('street', street);
    setValue('landmark', landmark ?? '');
    setValue('city', city);
    setValue('pincode', pincode);
  };

  // handle address form submit
  const handleAddressFormSubmit = (addressData: AddressForm) => {
    if (selectedAddressId) {
      updateAddressByPk.mutate({
        id: selectedAddressId,
        address_input: { ...addressData }
      });
    } else {
      addAddress.mutate({ address_input: { ...addressData } });
    }
  };

  // Save address
  const addAddress = useInsertAddressMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_ADDRESSES]);
      handleClose();
    },
    onError: err => {
      console.error(err);
    }
  });

  // Update address
  const updateAddressByPk = useUpdateAddressByPkMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries([REACT_QUERY_KEYS.GET_ADDRESSES]);
      handleClose();
    },
    onError: err => {
      console.error(err);
    }
  });

  const handleClose = () => {
    queryClient.cancelQueries([REACT_QUERY_KEYS.GET_ADDRESS_BY_PK]);
    resetAddressForm();
    toggleAddressModal();
    onClose();
  };

  return (
    <>
      <Modal
        overflow="inside"
        opened={isAddressModalOpen}
        onClose={() => handleClose()}
        closeOnClickOutside={true}
        title={selectedAddressId ? 'Update Address' : 'Save address'}
      >
        {fetchAddressByPkError ? (
          <p>{JSON.stringify(fetchAddressByPkError)}</p>
        ) : (
          <div className="relative">
            <LoadingOverlay
              loader={<Loader variant="bars" />}
              visible={
                isFetchAddressByPkLoading ||
                addAddress.isLoading ||
                updateAddressByPk.isLoading
              }
            />

            <form
              data-testid="address-form"
              onSubmit={handleSubmit(
                data => handleAddressFormSubmit(data),
                e => console.log(e)
              )}
            >
              <div className="grid gap-y-4">
                <Divider
                  variant="dashed"
                  label="Customer Details"
                  labelPosition="center"
                />
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Name"
                      error={errors?.name?.message}
                      id="name"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 30, message: MAX_LENGTH_MESSAGE(30) },
                    minLength: { value: 2, message: MIN_LENGTH_MESSAGE(2) }
                  }}
                />
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Mobile"
                      error={errors?.mobile?.message}
                      id="mobile"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 10, message: MAX_LENGTH_MESSAGE(10) },
                    minLength: { value: 10, message: MIN_LENGTH_MESSAGE(10) }
                  }}
                />
                <Divider
                  variant="dashed"
                  label="Location Details"
                  labelPosition="center"
                />
                <Controller
                  name="house"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="House Number"
                      error={errors?.house?.message}
                      id="house"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 20, message: MAX_LENGTH_MESSAGE(20) },
                    minLength: { value: 3, message: MIN_LENGTH_MESSAGE(3) }
                  }}
                />
                <Controller
                  name="street"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Street"
                      error={errors?.street?.message}
                      id="street"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 20, message: MAX_LENGTH_MESSAGE(20) },
                    minLength: { value: 3, message: MIN_LENGTH_MESSAGE(3) }
                  }}
                />
                <Controller
                  name="landmark"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Landmark (Optional)"
                      error={errors?.landmark?.message}
                      id="landmark"
                    />
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="City"
                      error={errors?.city?.message}
                      id="city"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 20, message: MAX_LENGTH_MESSAGE(20) },
                    minLength: { value: 3, message: MIN_LENGTH_MESSAGE(3) }
                  }}
                />
                <Controller
                  name="pincode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Zip"
                      error={errors?.pincode?.message}
                      id="pincode"
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD_MESSAGE
                    },
                    maxLength: { value: 6, message: MAX_LENGTH_MESSAGE(6) },
                    minLength: { value: 6, message: MIN_LENGTH_MESSAGE(6) }
                  }}
                />
              </div>

              {addAddress.isError && <p>{JSON.stringify(addAddress.error)}</p>}
              {updateAddressByPk.isError && (
                <p>{JSON.stringify(updateAddressByPk.error)}</p>
              )}

              <div className="flex justify-end gap-4">
                <Button variant="white" onClick={() => handleClose()}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TheAddressModal;
