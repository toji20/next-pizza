import { Input } from "@/components/ui"
import { WhiteBlock } from "../white-block"
import { FormInput } from "../form-components"

interface Props {
    className?: string
}
export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
    return (
        <WhiteBlock title="2.Персональные данные" className={className}>
        <div className="grid grid-cols-2 gap-5">
            <FormInput name="firstName" placeholder="Имя" className="text-base"/>
            <FormInput name="lastName" placeholder="Фамилия" className="text-base"/>
            <FormInput name="email" placeholder="E-mail" className="text-base"/>
            <FormInput name="phone" placeholder="Телефон" className="text-base"/>
        </div>
        </WhiteBlock>
    )
}