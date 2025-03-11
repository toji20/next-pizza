import { PaymentCallbackData } from '@/@types/yookassa';
import { prisma } from '@/prisma/prisma-client';
import { sendEmail } from '@/lib';
import { CartItemDTO } from '@/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { OrderSuccessTemplate } from '@/components/shared/email-templates/order-success';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' });
    }

    const isSUCCEEDED = body.object.status === 'SUCCEEDED';

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status:OrderStatus.SUCCEEDED,
      },
    });

    const items = JSON.parse(order?.items as string) as CartItemDTO[];

    if (isSUCCEEDED) {
      await sendEmail(
        order.email,
        'Next Pizza / Ваш заказ успешно оформлен 🎉',
        OrderSuccessTemplate({ orderId: order.id, items }),
      );
    } else {
      // Письмо о неуспешной оплате
    }
  } catch (error) {
    console.log('[Checkout Callback] Error:', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
