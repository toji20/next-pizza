'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { Title } from "./title";
import { Button } from "@/components/ui";

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    loading?: boolean;
    className?: string;
    onSubmit?: VoidFunction;
}

export const ChooseProductForm: React.FC<Props> = ({
    imageUrl,
    name,
    price,
    className,
    onSubmit,
    loading
}) => {

    
    return (
        <div className={cn('flex flex-1',className)}>
            <div className="flex items-center justify-center flex-1 relative w-full">
                <img src={imageUrl} 
                alt={name}
                className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
                />
            </div>

            <div className="w-[490px] bg-[#f7f6f5] p-7 flex justify-between flex-col">
                <Title text={name} size="md" className="font-extrabold mb-1"/>

                <Button
                    loading={loading}
                    onClick={() => onSubmit?.()}
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-auto">
                        Добавить в корзину за {price} ₽
                    </Button>
            </div>
        </div>
    )
}