import { useEffect, useMemo, useState } from "react";

export const useForm = (initialForm: any = {}, formValidations: any = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState<string | any>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  const onInputChange = ({ target }: { target: any }, uppercase = false, onlynumber = false) => {
    const { name, value } = target;
    if (onlynumber) {
      const regex = /^[0-9\b]+$/;
      return setFormState({
        ...formState,
        [name]: regex.test(value) ? value : "",
      });
    }

    setFormState({
      ...formState,
      [name]: uppercase ? value.toUpperCase() : value,
    });
  };

  const onImage64Change = (name: string, file: string) => {
    setFormState({
      ...formState,
      [name]: file,
    });
  };
  const onFileChange = (name: string, file: File) => {
    setFormState({
      ...formState,
      [name]: file,
    });
  };
  const onValueChange = (name: string, state: any) => {
    setFormState({
      ...formState,
      [name]: state,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckedValues: Record<string, any> = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
    }

    setFormValidation(formCheckedValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onFileChange,
    onValueChange,
    onImage64Change,
    onResetForm,

    ...formValidation,
    isFormValid,
  };
};
