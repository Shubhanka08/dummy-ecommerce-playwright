import { http, HttpResponse } from "msw";
import { products } from "./data/products";
import { CartItem, CheckoutPayload, ShippingInfo, PaymentInfo } from "@/types";

let cartItems: CartItem[] = [];
let nextCartItemId = 1;

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCart() {
  return { items: cartItems, total: computeTotal(cartItems) };
}

export const handlers = [
  // GET /api/products
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const category = url.searchParams.get("category") || "";
    const sort = url.searchParams.get("sort") || "";

    let result = [...products];

    if (search) {
      result = result.filter((p) => p.name.toLowerCase().includes(search));
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return HttpResponse.json({ products: result });
  }),

  // GET /api/products/:id
  http.get("/api/products/:id", ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ product });
  }),

  // GET /api/cart
  http.get("/api/cart", () => {
    return HttpResponse.json(getCart());
  }),

  // POST /api/cart
  http.post("/api/cart", async ({ request }) => {
    const body = (await request.json()) as {
      productId: string;
      quantity: number;
    };
    const product = products.find((p) => p.id === body.productId);

    if (!product) {
      return HttpResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const existing = cartItems.find((item) => item.productId === body.productId);

    if (existing) {
      existing.quantity += body.quantity || 1;
    } else {
      cartItems.push({
        id: `cart-${nextCartItemId++}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: body.quantity || 1,
        image: product.image,
      });
    }

    return HttpResponse.json(getCart());
  }),

  // PATCH /api/cart/:id
  http.patch("/api/cart/:id", async ({ params, request }) => {
    const body = (await request.json()) as { quantity: number };
    const itemIndex = cartItems.findIndex((item) => item.id === params.id);

    if (itemIndex === -1) {
      return HttpResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (body.quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = body.quantity;
    }

    return HttpResponse.json(getCart());
  }),

  // DELETE /api/cart/:id
  http.delete("/api/cart/:id", ({ params }) => {
    const itemIndex = cartItems.findIndex((item) => item.id === params.id);

    if (itemIndex === -1) {
      return HttpResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    cartItems.splice(itemIndex, 1);
    return HttpResponse.json(getCart());
  }),

  // POST /api/checkout
  http.post("/api/checkout", async ({ request }) => {
    const body = (await request.json()) as CheckoutPayload;
    const errors: Record<string, string> = {};

    // Validate shipping
    const shipping: ShippingInfo = body.shipping || ({} as ShippingInfo);
    if (!shipping.firstName?.trim()) errors.firstName = "First name is required";
    if (!shipping.lastName?.trim()) errors.lastName = "Last name is required";
    if (!shipping.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      errors.email = "Invalid email format";
    }
    if (!shipping.address?.trim()) errors.address = "Address is required";
    if (!shipping.city?.trim()) errors.city = "City is required";
    if (!shipping.state?.trim()) errors.state = "State is required";
    if (!shipping.zipCode?.trim()) {
      errors.zipCode = "Zip code is required";
    } else if (!/^\d{5}$/.test(shipping.zipCode)) {
      errors.zipCode = "Zip code must be 5 digits";
    }

    // Validate payment
    const payment: PaymentInfo = body.payment || ({} as PaymentInfo);
    const cardDigits = payment.cardNumber?.replace(/\s/g, "") || "";
    if (!cardDigits) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardDigits)) {
      errors.cardNumber = "Card number must be 16 digits";
    }
    if (!payment.expiryDate?.trim()) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiryDate)) {
      errors.expiryDate = "Expiry must be MM/YY format";
    }
    if (!payment.cvv?.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }
    if (!payment.nameOnCard?.trim())
      errors.nameOnCard = "Name on card is required";

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json({ errors }, { status: 400 });
    }

    if (cartItems.length === 0) {
      return HttpResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const order = {
      orderId: `ORD-${Date.now()}`,
      items: [...cartItems],
      total: computeTotal(cartItems),
      shipping,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    };

    // Clear cart after successful checkout
    cartItems = [];
    nextCartItemId = 1;

    return HttpResponse.json({ order });
  }),
];
