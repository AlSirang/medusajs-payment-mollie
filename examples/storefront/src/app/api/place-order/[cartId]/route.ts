import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, removeCartId } from "@lib/data/cookies"

type Params = { params: Promise<{ cartId: string }> }

export async function GET(_: Request, { params }: Params) {
  try {
    const cartId = (await params).cartId

    const cartRes = await sdk.store.cart
      .complete(cartId, {}, getAuthHeaders())
      .then((cartRes) => {
        revalidateTag("cart")
        return cartRes
      })
      .catch(medusaError)

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()
      removeCartId()

      return Response.redirect(
        new URL(
          `/${countryCode}/order/${cartRes?.order.id}/confirmed`,
          process.env.NEXT_PUBLIC_BASE_URL
        )
      )
    }
    return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL))
  } catch (error: any) {
    return Response.json({ error: error?.message })
  }
}
