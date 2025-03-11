'use client'

import React, { use, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

interface Props {
    className?: string;
    product: ProductWithRelations;
}

export const ChooseProductModule: React.FC<Props> = ({ className, product }) => {
    const router = useRouter();
    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);
    const addCartItem = useCartStore((state) => state.addCartItem);
    const loading = useCartStore((state) => state.loading);

    const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
        try {
        const itemId = productItemId ?? firstItem.id;
        await addCartItem({
            productItemId: itemId,
            ingredients,
        });
        toast.success('Товар успешно добавлен в корзину');
        return router.back();
        } catch (error) {
        toast.error(`Не удалось добавить товар в корзину`);
        console.error(error);
    }   
}

    return (
        <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
            <DialogContent className={cn(
            'p-0 w-[1060px] max-w-[1060px] min-h-[520px] bg-white overflow-hidden',
            className,
            )}>
                <DialogTitle className="hidden"></DialogTitle>
                {
                    isPizzaForm ? (
                        <ChoosePizzaForm 
                        imageUrl={product.imageUrl} 
                        name={product.name} 
                        ingredients={product.ingredients} 
                        items={product.items}
                        onSubmit={onSubmit}
                        loading={loading}
                         />
                    ) : 
                    <ChooseProductForm 
                    imageUrl={product.imageUrl} 
                    name={product.name}
                    onSubmit={onSubmit}
                    price={firstItem.price}
                    loading={loading}
                     />
                }
            </DialogContent>
        </Dialog>
    )
}