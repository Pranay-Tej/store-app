import {
  MAX_LENGTH_MESSAGE,
  MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE
} from '@/constants/validation.constants';
import { useAxiosInstance } from '@/context/axios.context';
import useApiCallStatus from '@/hooks/useApiCallStatus';
import { Address } from '@/models/address.model';
import { Button, Loader, Modal, TextInput } from '@mantine/core';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export interface AddressForm {
  name: string;
  mobile: string;
  houseNumber: string;
  street: string;
  landmark: string;
  city: string;
  zip: string;
}

const TheAddressModal: React.FC<{
  isAddressModalOpen: boolean;
  toggleAddressModal: () => void;
  addressId: number | null;
  handleAddressModalClose: (shouldRefresh?: boolean) => void;
}> = ({
  isAddressModalOpen,
  toggleAddressModal,
  addressId,
  handleAddressModalClose
}) => {
  const { axiosInstance } = useAxiosInstance();

  useEffect(() => {
    if (addressId) {
      fetchAddressById();
    }
    return () => {
      // cleanup
      resetAddressForm();
      resetFetchAddressById();
      resetSaveAddress();
      resetUpdateAddress();
    };
  }, [addressId]);

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
      houseNumber: '',
      street: '',
      landmark: '',
      city: '',
      zip: ''
    }
  });

  const setFormValues = ({
    name,
    mobile,
    houseNumber,
    street,
    landmark,
    city,
    zip
  }: Address) => {
    setValue('name', name);
    setValue('mobile', mobile);
    setValue('houseNumber', houseNumber);
    setValue('street', street);
    setValue('landmark', landmark);
    setValue('city', city);
    setValue('zip', zip);
  };

  const {
    data: address,
    isLoading: isFetchAddressByIdLoading,
    setIsLoading: setIsFetchAddressByIdLoading,
    errorMessage: fetchAddressByIdError,
    setErrorMessage: setFetchAddressByIdError,
    reset: resetFetchAddressById
  } = useApiCallStatus<Address>();

  const fetchAddressById = async () => {
    try {
      setIsFetchAddressByIdLoading(true);
      const response: AxiosResponse<Address> = await axiosInstance.get(
        `/addresses/${addressId}`
      );

      setFormValues(response.data);
    } catch (error: any) {
      setFetchAddressByIdError(error.message);
    } finally {
      setIsFetchAddressByIdLoading(false);
    }
  };

  // handle address form submit
  const handleAddressFormSubmit = (addressData: AddressForm) => {
    if (addressId) {
      updateAddress(addressData);
    } else {
      saveAddress(addressData);
    }
  };

  const {
    isLoading: isSaveAddressLoading,
    setIsLoading: setIsSaveAddressLoading,
    errorMessage: saveAddressError,
    setErrorMessage: setSaveAddressError,
    reset: resetSaveAddress
  } = useApiCallStatus<Address>();

  // Save address
  const saveAddress = async (addressData: AddressForm) => {
    try {
      setIsSaveAddressLoading(true);
      const response: AxiosResponse<Address> = await axiosInstance.post(
        '/addresses',
        addressData
      );
      handleClose(true);
    } catch (error: any) {
      console.error(error);
      setSaveAddressError(error.message);
    } finally {
      setIsSaveAddressLoading(false);
    }
  };

  // Update address
  const {
    isLoading: isUpdateAddressLoading,
    setIsLoading: setIsUpdateAddressLoading,
    errorMessage: updateAddressError,
    setErrorMessage: setUpdateAddressError,
    reset: resetUpdateAddress
  } = useApiCallStatus<Address>();

  const updateAddress = async (addressData: AddressForm) => {
    try {
      setIsUpdateAddressLoading(true);
      const response: AxiosResponse<Address> = await axiosInstance.put(
        `/addresses/${addressId}`,
        addressData
      );
      handleClose(true);
    } catch (error: any) {
      console.error(error);
      setUpdateAddressError(error.message);
    } finally {
      setIsUpdateAddressLoading(false);
    }
  };

  const handleClose = (shouldRefresh: boolean = false) => {
    handleAddressModalClose(shouldRefresh);
    toggleAddressModal();
  };

  return (
    <>
      <Modal
        opened={isAddressModalOpen}
        onClose={() => handleClose(false)}
        title={addressId ? 'Update Address' : 'Save address'}
      >
        {isFetchAddressByIdLoading ? (
          <div className="grid min-h-full place-items-center">
            <Loader variant="bars" />
          </div>
        ) : fetchAddressByIdError ? (
          <p>{fetchAddressByIdError}</p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(
                data => handleAddressFormSubmit(data),
                e => console.log(e)
              )}
            >
              <div className="grid gap-y-4">
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Name"
                      error={errors?.name?.message}
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
                <Controller
                  name="houseNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="House Number"
                      error={errors?.houseNumber?.message}
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
                      label="Landmark"
                      error={errors?.landmark?.message}
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
                  name="city"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="City"
                      error={errors?.city?.message}
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
                  name="zip"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Zip"
                      error={errors?.zip?.message}
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

              {saveAddressError && <p>{saveAddressError}</p>}
              {updateAddressError && <p>{updateAddressError}</p>}

              <Button
                onClick={() => handleClose(false)}
                loading={
                  isFetchAddressByIdLoading ||
                  isSaveAddressLoading ||
                  isUpdateAddressLoading
                }
                disabled={
                  fetchAddressByIdError !== undefined ||
                  isFetchAddressByIdLoading ||
                  isSaveAddressLoading ||
                  isUpdateAddressLoading
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={
                  isFetchAddressByIdLoading ||
                  isSaveAddressLoading ||
                  isUpdateAddressLoading
                }
                disabled={
                  fetchAddressByIdError !== undefined ||
                  isFetchAddressByIdLoading ||
                  isSaveAddressLoading ||
                  isUpdateAddressLoading
                }
              >
                Save
              </Button>
            </form>
          </>
        )}
      </Modal>
    </>
  );
};

export default TheAddressModal;
