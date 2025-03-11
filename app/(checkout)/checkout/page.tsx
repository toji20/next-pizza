'use client';

import { Container, Title } from "@/components/shared";
import { CheckoutSidebar } from "@/components/shared/checkout-sidebar";
import { CheckoutCart } from "@/components/shared/checkout/checkout-cart";
import { useCart } from "@/hooks/use-cart";
import { Form, FormProvider, set, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { CheckoutPersonalForm } from "@/components/shared/checkout/checkout-personal-form";
import { CheckoutAddressForm } from "@/components/shared/checkout/checkout-address-form";
import { useSession } from "next-auth/react";
import { Api } from "@/services/api-client";

export default function CheckoutPage() {
    const [submitting, setSubmitting] = useState(false);
    const {updateItemQuantity, items, removeCartItem, loading } = useCart();
    const { totalAmount } = useCart();
    const {data: session} = useSession()  

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        },
    });

    React.useEffect(() => {
        async function fetchUserInfo() {
          const data = await Api.auth.getMe();
          const [firstName, lastName] = data.fullName.split(' ');
    
          form.setValue('firstName', firstName);
          form.setValue('lastName', lastName);
          form.setValue('email', data.email);
        }
    
        if (session) {
          fetchUserInfo();
        }
      }, [session]);
    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);
            const url = await createOrder(data);

            toast.error('Заказ успешно оформлен! 📝 Переход на оплату... ', {
                icon: '✅',
              });
        
              if (url) {
                location.href = url;
              }

        } catch (err) {
            console.log(err);
            setSubmitting(false);
            toast.error('Не удалось создать заказ', {
                icon: '❌',
            });
        }
    };
    
    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
      };
    return <Container className="mt-10">
      <Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />
        <FormProvider {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)}>
             {/* Левая часть */}
        <div className="flex gap-10">
        <div className="flex flex-col gap-10 flex-1 mb-20">
            <CheckoutCart 
            items={items} 
            removeCartItem={removeCartItem} 
            onClickCountButton={onClickCountButton}
            />
            
            <CheckoutPersonalForm className={loading ? 'opacity-40 pointer-events-none' : ''}/>

            <CheckoutAddressForm className={loading ? 'opacity-40 pointer-events-none' : ''}/>

        </div>

        {/* Правая часть */}
        <div className="w-[450px]">
        <CheckoutSidebar 
        totalAmount={totalAmount} 
        loading={loading || submitting} />
        </div>
        </div>
           </form>
        </FormProvider>
    </Container>;
}