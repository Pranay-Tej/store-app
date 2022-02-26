import {
  MAX_LENGTH_MESSAGE,
  MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE
} from '@/constants/validation.constants';
import useApiCallStatus from '@/hooks/useApiCallStatus';
import { Address } from '@/models/address.model';
import { axiosInstance } from '@/utils/axios-instance';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
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
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={isAddressModalOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>
          {addressId ? 'Update Address' : 'Save address'}
        </DialogTitle>
        {isFetchAddressByIdLoading ? (
          <DialogContent>
            <div className="grid min-h-full place-items-center">
              <CircularProgress />
            </div>
          </DialogContent>
        ) : fetchAddressByIdError ? (
          <DialogContent>
            <p>{fetchAddressByIdError}</p>
          </DialogContent>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(
                data => handleAddressFormSubmit(data),
                e => console.log(e)
              )}
            >
              <DialogContent>
                <div className="grid gap-y-4">
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        variant="outlined"
                        error={errors?.name !== undefined}
                        helperText={errors?.name?.message}
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
                      <TextField
                        {...field}
                        label="Mobile"
                        variant="outlined"
                        error={errors?.mobile !== undefined}
                        helperText={errors?.mobile?.message}
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
                      <TextField
                        {...field}
                        label="House Number"
                        variant="outlined"
                        error={errors?.houseNumber !== undefined}
                        helperText={errors?.houseNumber?.message}
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
                      <TextField
                        {...field}
                        label="Street"
                        variant="outlined"
                        error={errors?.street !== undefined}
                        helperText={errors?.street?.message}
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
                      <TextField
                        {...field}
                        label="Landmark"
                        variant="outlined"
                        error={errors?.landmark !== undefined}
                        helperText={errors?.landmark?.message}
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
                      <TextField
                        {...field}
                        label="City"
                        variant="outlined"
                        error={errors?.city !== undefined}
                        helperText={errors?.city?.message}
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
                      <TextField
                        {...field}
                        label="Zip"
                        variant="outlined"
                        error={errors?.zip !== undefined}
                        helperText={errors?.zip?.message}
                      />
                    )}
                    rules={{
                      required: {
                        value: true,
                        message: REQUIRED_FIELD_MESSAGE
                      },
                      maxLength: { value: 5, message: MAX_LENGTH_MESSAGE(5) },
                      minLength: { value: 5, message: MIN_LENGTH_MESSAGE(5) }
                    }}
                  />
                </div>

                {saveAddressError && <p>{saveAddressError}</p>}
                {updateAddressError && <p>{updateAddressError}</p>}
              </DialogContent>

              <DialogActions>
                <LoadingButton
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
                  variant="text"
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
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
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </DialogActions>
            </form>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TheAddressModal;
