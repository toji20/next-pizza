'use client'

import { WhiteBlock } from "../white-block"
import { FormTextarea } from "../form-components/form-textarea"
import { FormInput } from "../form-components"

interface Props {
    className?: string
}
export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title="3.Адрес доставки" className={className}>
            <div className="flex flex-col gap-5">            
            <FormInput name="address" placeholder="Адрес доставки" className="text-base"/>
            
            <FormTextarea
            name="comment"
            className="text-base"
            placeholder="Комментарий к заказу"
             />
            </div>
        </WhiteBlock>
    )
}