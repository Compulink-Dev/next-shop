"use client";
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { ShippingAddress } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, ValidationRule, useForm } from "react-hook-form";

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push("/payment");
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: Extract<keyof ShippingAddress, string>;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div>
      <label className="label" htmlFor={id}>
        <span className="label-text font-semibold text-base-content">{name}</span>
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className="input input-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary"
        placeholder={`Enter ${name.toLowerCase()}`}
      />
      {errors[id]?.message && (
        <div className="text-error text-sm mt-1">{errors[id]?.message}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <CheckoutSteps current={1} />
        
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h1 className="text-3xl font-bold text-base-content mb-2">Shipping Address</h1>
            <p className="text-base-content/60 mb-8">Enter your delivery information</p>
            
            <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
              <FormInput name="Full Name" id="fullName" required />
              <FormInput name="Address" id="address" required />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput name="City" id="city" required />
                <FormInput name="Postal Code" id="postalCode" required />
              </div>
              
              <FormInput name="Country" id="country" required />
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full rounded-full btn-lg gap-2 shadow-lg"
                >
                  {isSubmitting && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Form;
