'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { Title } from "./title";
import { Button } from "@/components/ui";
import { PizzaImage } from "./pizza-Image";
import { GroupVarients } from "./group-varients";
import { PizzaSize, PizzaType, pizzaTypes } from "@/constants/pizza";
import { Ingredient, ProductItem } from "@prisma/client";
import { IngredientItem } from "./ingredient-item";
import { usePizzaOptions } from "@/hooks";
import { getPizzaDetails } from "@/lib/get-pizza-details";

interface Props {
    imageUrl: string;
    name: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    loading?: boolean;
    className?: string;
    onSubmit: (itemId: number, ingredients: number[]) => void;
}

export const ChoosePizzaForm: React.FC<Props> = ({
    imageUrl,
    name,
    ingredients,
    items,
    loading,
    className,
    onSubmit
}) => {
    const {
        size, 
        type, 
        setSize, 
        setType,
        selectedIngredients,
        addIngredient,
        availableSizes,
        cuerrentItemId
    } = usePizzaOptions(items);

    const { textDetails, totalPrice } = getPizzaDetails(
        items,
        type,
        size,
        ingredients,
        selectedIngredients
    );

    const handleClickAdd = () => {
        if (cuerrentItemId) {
            onSubmit(cuerrentItemId, Array.from(selectedIngredients));
        }
    }
    
    return (
        <div className={cn('flex flex-1',className)}>
            <PizzaImage className="flex-1 relative w-full" imageUrl={imageUrl} size={size}/>

            <div className="w-[490px] bg-[#f7f6f5] p-7 flex justify-between flex-col">
                <Title text={name} size="md" className="font-extrabold mb-1"/>

                <p className="text-gray-400 mb-3">{textDetails}</p>

                <div className="flex flex-col gap-3 mt-3">
                <GroupVarients 
                items={availableSizes}
                value={String(size)}
                onClick={value => setSize(Number(value) as PizzaSize)} 
                />

                <GroupVarients 
                items={pizzaTypes}
                value={String(type)}
                onClick={value => setType(Number(value) as PizzaType)} 
                />
                </div>

                <div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar mt-5">
                <div className="grid grid-cols-3 gap-3 mt-3 mb-3">
                    {ingredients.map((ingredient) => (
                        <IngredientItem 
                            key={ingredient.id} 
                            name={ingredient.name}
                            price={ingredient.price}
                            imageUrl={ingredient.imageUrl}
                            onClick={() => addIngredient(ingredient.id)}
                            active={selectedIngredients.has(ingredient.id)}
                        />
                    ))}
                </div>
                </div>

                <Button
                    loading={loading}
                    onClick={handleClickAdd}
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-auto">
                        Добавить в корзину за {totalPrice} ₽
                    </Button>
            </div>
        </div>
    )
}