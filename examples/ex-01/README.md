# README for Example Folder

This folder demonstrates how to integrate and use the `medusajs-payment-mollie` library in a Medusa.js application. Below, you'll find a guide to setting up and using this payment provider within both the Medusa backend and frontend store.

---

## **Backend Configuration**

### **Add Mollie as a Payment Provider**

Update the `medusa-config.js` file in your Medusa server to include the Mollie payment provider:

```javascript
modules: [
  {
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "medusajs-payment-mollie",
          id: "mollie",
          options: {
            id: "mollie",
            apiKey: process.env.MOLLIE_API_KEY,
          },
        },
      ],
    },
  },
];
```

### **Create a Custom API Endpoint**

Add an API route to list available Mollie payment methods.

File: `src/api/store/mollie/payment-methods/route.ts`

```typescript
import MollieClient from "@mollie/api-client";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mollieClient = MollieClient({
    apiKey: process.env.MOLLIE_API_KEY || "",
  });

  const methods = await mollieClient.methods.list();

  res.status(200).json(methods);
}
```

### **Set the Mollie API Key**

Add your Mollie API key to the `.env` file in the Medusa backend:

```env
MOLLIE_API_KEY=your_mollie_api_key_here
```

---

## **Frontend Configuration**

### **Handle the Place Order Logic**

Create an API route to complete the order and handle redirections after a successful transaction.

File: `api/place-order/[cartId]/route.ts`

```typescript
import { sdk } from "@lib/config";
import { revalidateTag } from "next/cache";
import medusaError from "@lib/util/medusa-error";
import { getAuthHeaders, removeCartId } from "@lib/data/cookies";

type Params = { params: Promise<{ cartId: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const cartId = (await params).cartId;

    const cartRes = await sdk.store.cart
      .complete(cartId, {}, getAuthHeaders())
      .then((cartRes) => {
        revalidateTag("cart");
        return cartRes;
      })
      .catch(medusaError);

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase();
      removeCartId();

      return Response.redirect(
        new URL(
          `/${countryCode}/order/${cartRes?.order.id}/confirmed`,
          process.env.NEXT_PUBLIC_BASE_URL
        )
      );
    }
    return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
  } catch (error: any) {
    return Response.json({ error: error?.message });
  }
}
```

---

## **Getting Started**

1. **Clone this Repository**  
   Clone the repository and navigate to the `example` folder.

2. **Install Dependencies**  
   Run `npm install` or `yarn install` to install the required dependencies.

3. **Configure the Backend**

   - Update the `medusa-config.js` file to include the Mollie provider.
   - Add your Mollie API key to the `.env` file.

4. **Run the Medusa Server**  
   Start the Medusa server with `npm run start` or `yarn start`.

5. **Configure the Frontend**

   - Ensure the place order route is properly linked to the backend.
   - Update the `NEXT_PUBLIC_BASE_URL` in your frontend `.env` file.

6. **Test the Integration**  
   Use the Mollie payment methods in your store and verify the end-to-end flow from checkout to order confirmation.

---

## **Notes**

- Ensure the `MOLLIE_API_KEY` is kept secure and not exposed publicly.
- For more information on Mollie's API, refer to their [official documentation](https://docs.mollie.com/).

Enjoy using the `medusajs-payment-mollie` library! 🚀
