'use server'

import { CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { PayOrderTemplate } from "@/components/shared/email-templates/pay-order";
import { VerificationUserTemplate } from "@/components/shared/email-templates/verification-user";
import { createPayment, sendEmail } from "@/lib";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
    const DELIVERY_PRICE = 250;
    try {
        const cookieStore = cookies();
        const cartToken = (await cookieStore).get('cartToken')?.value;
    
        if (!cartToken) {
            throw new Error('Cart token not found');
        }
        // Находим корзину по токену
        const userCart = await prisma.cart.findFirst({
            include: {
              user: true,
              items: {
                include: {
                  ingredients: true,
                  productItem: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
            where: {
              token: cartToken,
            },
          });
        //   если корзина не найдена возвращаем ошибку
        if (!userCart) {
            throw new Error('Cart not found');
        }
        // если корзина пустая возвращаем ошибку
        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }
        // создаем заказ
        const order = await prisma.order.create({
            data: {
              token: cartToken,
              fullName: data.firstName + ' ' + data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              comment: data.comment,
              totalAmount: userCart.totalAmount + DELIVERY_PRICE,
              status: OrderStatus.PENDING,
              items: JSON.stringify(userCart.items),
            },
          });
        //   очищаем корзину
          await prisma.cart.update({
            where: {
              id: userCart.id,
            },
            data: {
              totalAmount: 0,
            },
          })

          await prisma.cartItem.deleteMany({
            where: {
              cartId: userCart.id,
            },
          });

          const paymentData = await createPayment({ 
            amount: order.totalAmount,  
            orderId: order.id,
            description: `Next Pizza / Оплата заказа #${order.id}`, 
          });

          if (!paymentData) {
            throw new Error('Payment data not found');
          }

          await prisma.order.update({
            where: {
              id: order.id,
            },
            data: {
              paymentId: paymentData.id,
            },
          });

          const paymentUrl = paymentData.confirmation.confirmation_url;

          await sendEmail(
            data.email,
            'Next Pizza / Оплатите заказ #' + order.id,
            PayOrderTemplate({
              orderId: order.id,
              totalAmount: order.totalAmount,
              paymentUrl,
            }),
          );

          return paymentUrl
    } catch (err) {
      console.log('[CreateOrder] Server error', err);
    }
}


export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
       const currentUser = await getUserSession();

       if (!currentUser) {
        throw new Error('User not found');
       }

       const findUser = await prisma.user.findFirst({
        where: {
          id: Number(currentUser.id),
        },
      });

       await prisma.user.update({
        where: {
            id: Number(currentUser.id)
        },
        
        data: {
           fullName: body.fullName,
           email: body.email,
           password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
        },
       });
    } catch (error) {
        console.log('[UpdateUserInfo] Server error', error);
        throw error
    }
}

export async function registerUser(body: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (user) {
        if (!user.verified) {
          throw new Error('Почта не подтверждена');
        }

        throw new Error('Пользователь с таким email уже зарегистрирован');
      }

      const createdUser = await prisma.user.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          password: hashSync(body.password, 10),
        },
      })

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.verificationCode.create({
        data: {
          code,
          userId: createdUser.id
        }
      })

      await sendEmail(
        createdUser.email,
       'Next Pizza / 📝 Подтверждение регистрации',
        VerificationUserTemplate({
        code,
      }),
      )
    } catch (error) {
        console.log('[RegisterUser] Server error', error);
        throw error
    }
}