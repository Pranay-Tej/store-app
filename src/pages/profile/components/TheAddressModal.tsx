import { BASE_URL } from '@/constants/app.constants';
import useAxios from '@/hooks/useAxios';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Address } from '@/models/address.model';
import {
  MAX_LENGTH_MESSAGE,
  MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE
} from '@/constants/validation.constants';

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
  const {
    execute: fetchAddressById,
    data: address,
    isLoading: fetchAddressByIdLoading,
    errorMessage: fetchAddressByIdError,
    reset: resetFetchAddressById
  } = useAxios<Address>();

  const {
    execute: saveAddress,
    data: savedAddress,
    isLoading: saveAddressLoading,
    errorMessage: saveAddressError,
    reset: resetSaveAddress
  } = useAxios<Address>();

  const {
    execute: updateAddress,
    data: updatedAddress,
    isLoading: updatedAddressLoading,
    errorMessage: updatedAddressError,
    reset: resetUpdateAddress
  } = useAxios<Address>();

  useEffect(() => {
    if (addressId) {
      fetchAddressById({
        url: `${BASE_URL}/addresses/${addressId}`,
        successCallback: (data: Address) => setFormValues(data)
      });
    }
    return () => {
      // cleanup
      reset();
      resetFetchAddressById();
      resetSaveAddress();
      resetUpdateAddress();
      addressId = null;
    };
  }, [addressId]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
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

  const handleClose = (shouldRefresh: boolean = false) => {
    handleAddressModalClose(shouldRefresh);
    toggleAddressModal();
  };

  const handleSaveAddress = (data: AddressForm) => {
    // save address
    // post address with axios

    if (addressId) {
      updateAddress({
        url: `${BASE_URL}/addresses/${addressId}`,
        axiosConfig: {
          method: 'PUT',
          data: data
        },
        successCallback: () => handleClose(true)
      });
    } else {
      saveAddress({
        url: `${BASE_URL}/addresses`,
        axiosConfig: {
          method: 'POST',
          data: data
        },
        successCallback: () => handleClose(true)
      });
    }
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
        {fetchAddressByIdLoading ? (
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
                data => handleSaveAddress(data),
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
                {updatedAddressError && <p>{updatedAddressError}</p>}
              </DialogContent>

              <DialogActions>
                <LoadingButton
                  onClick={() => handleClose(false)}
                  loading={
                    fetchAddressByIdLoading ||
                    saveAddressLoading ||
                    updatedAddressLoading
                  }
                  disabled={
                    fetchAddressByIdError !== undefined ||
                    fetchAddressByIdLoading ||
                    saveAddressLoading ||
                    updatedAddressLoading
                  }
                  variant="text"
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  // onClick={handleSaveAddress}
                  loading={
                    fetchAddressByIdLoading ||
                    saveAddressLoading ||
                    updatedAddressLoading
                  }
                  disabled={
                    fetchAddressByIdError !== undefined ||
                    fetchAddressByIdLoading ||
                    saveAddressLoading ||
                    updatedAddressLoading
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
