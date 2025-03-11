import { CartStateItem } from "@/lib/get-cart-details";
import { WhiteBlock } from "../white-block";
import { CheckoutItem } from "../checkout-item";
import { getCartItemDetails } from "@/lib";
import { PizzaSize, PizzaType } from "@/constants/pizza";

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    loading?: boolean;
    className?: string
}
export const CheckoutCart: React.FC<Props> = ({ className, items, onClickCountButton, removeCartItem }) => {
    return (
        <WhiteBlock title="1.Корзина" className={className}>
            <div className="flex flex-col gap-5">

        {items.map((item) => (
            <CheckoutItem
            id={item.id}
            key={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            quantity={item.quantity}
            disabled={item.disabled}
            details={getCartItemDetails(
                item.ingredients,
                item.pizzaType as PizzaType,
                item.pizzaSize as PizzaSize,
            )}
            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
            onClickRemove={() => removeCartItem(item.id)}
            />
        ))}
            </div>
    </WhiteBlock>
    )
}