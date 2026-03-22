'use client';

import { useForm, FormProvider, useFormContext, type FieldValues, type Resolver, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { ReactNode } from 'react';

interface FormWrapperProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export function FormWrapper<T extends FieldValues>({ schema, defaultValues, onSubmit, children, className = '' }: FormWrapperProps<T>) {
  const methods = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T> | undefined,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
        {children}
      </form>
    </FormProvider>
  );
}

export function useFormContextHelper<T extends FieldValues>() {
  return useFormContext<T>();
}
