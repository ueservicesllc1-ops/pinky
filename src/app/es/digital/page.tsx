'use client';

import { useMemo, useState } from "react";
import { useCandles } from "@/hooks/useCandles";

function DigitalHeader() {
  return (
    <header
      className="bg-white"
      style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
    >
      <div className="mx-auto flex h-28 max-w-[393px] items-center justify-center px-6">
        <img
          src="/images/logo2.png"
          alt="Pinky Flame"
          className="h-16 w-auto object-contain"
        />
      </div>
    </header>
  );
}

export default function DigitalPage() {
  const { candles, isLoading, error } = useCandles();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; category: string; price: number; quantity: number }>
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activeCandles = useMemo(
    () => candles.filter((candle) => candle.isActive),
    [candles]
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    activeCandles.forEach((candle) => {
      if (candle.category) {
        unique.add(candle.category);
      }
    });
    return ["Todas", ...Array.from(unique)];
  }, [activeCandles]);

  const filteredCandles = useMemo(() => {
    if (selectedCategory === "Todas") {
      return activeCandles;
    }
    return activeCandles.filter(
      (candle) => candle.category === selectedCategory
    );
  }, [activeCandles, selectedCategory]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const addToCart = (candle: {
    id: string;
    name: string;
    category: string;
    price: number;
  }) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === candle.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: candle.id,
          name: candle.name,
          category: candle.category || "Sin categoría",
          price: candle.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const updatedQuantity = item.quantity + delta;
          return { ...item, quantity: updatedQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const openWhatsAppWithCart = () => {
    if (cartItems.length === 0) return;

    const total = cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);

    const lines = [
      "Hola Pinky Flame, quiero hacer un pedido digital.",
      "",
      ...cartItems.map(
        (item) =>
          `• ${item.name} (${item.category}) x${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      ),
      "",
      `Total estimado: $${total}`,
    ];

    const message = encodeURIComponent(lines.join("\n"));

    window.open(`https://wa.me/15513019412?text=${message}`, "_blank");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col bg-white text-gray-900">
      <DigitalHeader />

      <main className="flex flex-1 flex-col gap-6 px-6 py-8">
        <section className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Catálogo Digital
          </h1>
          <p className="text-base text-gray-600">
            Descubre todas nuestras velas disponibles para tu hogar o evento.
          </p>
        </section>

        <section className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.35)]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </section>

        <section className="space-y-4">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-24 w-full animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              Ocurrió un problema al cargar el catálogo. Inténtalo nuevamente en
              unos minutos.
            </div>
          )}

          {!isLoading && !error && filteredCandles.length === 0 && (
            <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              {selectedCategory === "Todas"
                ? "Aún no hay productos disponibles. Vuelve pronto para descubrir nuestras novedades."
                : "No hay productos en esta categoría por el momento. Prueba con otra categoría."}
            </div>
          )}

          <div className="space-y-4">
            {filteredCandles.map((candle) => (
              <article
                key={candle.id}
                className="flex gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    candle.imageUrl && setSelectedImage(candle.imageUrl)
                  }
                  className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 transition-transform active:scale-95"
                >
                  {candle.imageUrl ? (
                    <img
                      src={candle.imageUrl}
                      alt={candle.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold">{candle.name}</h2>
                    {candle.description && (
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {candle.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-pink-500">
                        ${candle.price.toFixed(2)}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        {candle.category || "Sin categoría"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: candle.id,
                          name: candle.name,
                          category: candle.category || "Sin categoría",
                          price: candle.price,
                        })
                      }
                      className="w-full rounded-full bg-pink-500 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.35)] transition active:scale-95"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute inset-0 h-full w-full cursor-pointer"
            aria-label="Cerrar imagen ampliada"
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-[360px] overflow-hidden rounded-3xl bg-white p-4">
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="h-full w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="mt-3 w-full rounded-xl bg-pink-500 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.35)] transition active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-[0_12px_30px_rgba(236,72,153,0.45)] transition active:scale-95"
        aria-label="Abrir carrito"
      >
        <span className="text-xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-pink-500 shadow">
            {totalItems}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 h-full w-full cursor-pointer"
            aria-label="Cerrar carrito"
          />
          <div className="relative z-10 w-full max-w-[360px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tu pedido</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-sm text-gray-500"
              >
                Cerrar
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                Aún no agregas productos. Explora el catálogo y toca “Hacer
                pedido”.
              </p>
            ) : (
              <>
                <div className="max-h-72 space-y-4 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500"
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-400 underline"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total estimado</span>
                    <span className="text-base font-semibold text-pink-500">
                      $
                      {cartItems
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={openWhatsAppWithCart}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-pink-500 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(236,72,153,0.45)] transition active:scale-95"
                  >
                    <img
                      src="/images/whatsapp.svg"
                      alt="WhatsApp"
                      className="h-5 w-5"
                    />
                    Hacer pedido por WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

