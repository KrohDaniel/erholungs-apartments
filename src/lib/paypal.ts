// =============================================================================
// Erholungs Apartments - PayPal Server-Side Integration
// =============================================================================

import {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
  PaypalExperienceUserAction,
  PaypalWalletContextShippingPreference,
} from '@paypal/paypal-server-sdk';
import type { Order } from '@paypal/paypal-server-sdk';

// -----------------------------------------------------------------------------
// PayPal Client (Singleton)
// -----------------------------------------------------------------------------

let paypalClient: Client;

function getPayPalClient(): Client {
  if (!paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'PayPal-Konfiguration fehlt: PAYPAL_CLIENT_ID und PAYPAL_CLIENT_SECRET müssen gesetzt sein.'
      );
    }

    paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      environment:
        process.env.NODE_ENV === 'production'
          ? Environment.Production
          : Environment.Sandbox,
    });
  }

  return paypalClient;
}

// -----------------------------------------------------------------------------
// Orders Controller
// -----------------------------------------------------------------------------

let ordersController: OrdersController;

function getOrdersController(): OrdersController {
  if (!ordersController) {
    ordersController = new OrdersController(getPayPalClient());
  }
  return ordersController;
}

// -----------------------------------------------------------------------------
// Exported Helpers
// -----------------------------------------------------------------------------

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://erholungs-apartments.de';

/**
 * Creates a PayPal order for a booking.
 *
 * @param bookingId  - Firestore booking document ID (used as reference / custom ID)
 * @param amount     - Total price in EUR
 * @param description - Human-readable description shown to the buyer
 * @returns The created PayPal Order object (contains id and approval links)
 */
export async function createPayPalOrder(
  bookingId: string,
  amount: number,
  description: string
): Promise<Order> {
  const controller = getOrdersController();

  const response = await controller.createOrder({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'EUR',
            value: amount.toFixed(2),
          },
          referenceId: bookingId,
          customId: bookingId,
          description,
        },
      ],
      paymentSource: {
        paypal: {
          experienceContext: {
            brandName: 'Erholungs Apartments',
            locale: 'de-DE',
            shippingPreference: PaypalWalletContextShippingPreference.NoShipping,
            userAction: PaypalExperienceUserAction.PayNow,
            returnUrl: `${SITE_URL}/buchen/bestaetigung`,
            cancelUrl: `${SITE_URL}/buchen?cancelled=true`,
          },
        },
      },
    },
    prefer: 'return=representation',
  });

  if (!response.result) {
    throw new Error('PayPal-Bestellung konnte nicht erstellt werden.');
  }

  return response.result;
}

/**
 * Captures (completes) a previously approved PayPal order.
 *
 * @param orderId - The PayPal order ID to capture
 * @returns The captured PayPal Order object
 */
export async function capturePayPalOrder(orderId: string): Promise<Order> {
  const controller = getOrdersController();

  const response = await controller.captureOrder({
    id: orderId,
    prefer: 'return=representation',
  });

  if (!response.result) {
    throw new Error('PayPal-Zahlung konnte nicht erfasst werden.');
  }

  return response.result;
}

export { getPayPalClient };
