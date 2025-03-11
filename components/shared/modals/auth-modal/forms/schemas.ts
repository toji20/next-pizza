import { z } from "zod"

export const passswordSchema = z.string().min(6, { message: 'Пароль должен содержать не менее 6 символов' })

export const FormLoginSchema = z.object({
    email: z.string().email({ message: 'Введите корректную почту' }),
    password: passswordSchema,
})

export const FormRegisterSchema = FormLoginSchema.merge(
    z.object({
        fullName: z.string().min(2, { message: 'Имя и фамилия должно содержать не менее 2-х символов' }),
        confirmPassword: passswordSchema,
    })
).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
})

export type TFormLoginValues = z.infer<typeof FormLoginSchema>;
export type TFormRegisterValues = z.infer<typeof FormRegisterSchema>;