'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCandles } from "@/hooks/useCandles";
function DigitalFooter({ locale }: { locale: Locale }) {
  const labels = {
    es: {
      site: "PinkyFlames.com",
      terms: "Términos y Condiciones",
      shipping: "Políticas de Envío",
      credit: "Potenciado y diseñado por Freedom Labs · +1 551 301 4573",
    },
    en: {
      site: "PinkyFlames.com",
      terms: "Terms & Conditions",
      shipping: "Shipping Policies",
      credit: "Powered and designed by Freedom Labs · +1 551 301 4573",
    },
  } as const;

  const copy = labels[locale];

  return (
    <footer className="bg-pink-500">
      <div className="mx-auto flex max-w-[393px] flex-col items-center justify-center gap-4 px-6 py-6 text-sm font-medium text-white">
        <a
          href="https://www.pinkyflanes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 transition hover:opacity-80"
        >
          {copy.site}
        </a>
        <a
          href="/politicas-envio"
          className="order-1 transition hover:opacity-80"
        >
          {copy.shipping}
        </a>
        <a href="/terminos" className="order-3 transition hover:opacity-80">
          {copy.terms}
        </a>
        <p className="order-4 text-xs font-semibold text-white/80 text-center">
          {copy.credit}
        </p>
      </div>
    </footer>
  );
}

type Locale = "es" | "en";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

type Translation = {
  catalogTitle: string;
  catalogSubtitle: string;
  categoriesAll: string;
  errorMessage: string;
  emptyAll: string;
  emptyCategory: string;
  noImage: string;
  noCategory: string;
  addToCart: string;
  cartTitle: string;
  cartEmpty: string;
  totalLabel: string;
  whatsappButton: string;
  whatsappHeader: string;
  whatsappTotalLabel: string;
  close: string;
  openCartAria: string;
  closeCartAria: string;
  closeImageAria: string;
  decreaseQtyAria: string;
  increaseQtyAria: string;
  removeItem: string;
  languageSelectorAria: string;
  orderLine: (name: string, category: string, quantity: number, price: number) => string;
};

const ALL_CATEGORIES = "__all__";

const LANGUAGE_OPTIONS: Array<{ code: Locale; label: string }> = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

const TRANSLATIONS: Record<Locale, Translation> = {
  es: {
    catalogTitle: "Catálogo Digital",
    catalogSubtitle: "Descubre todas nuestras velas disponibles para tu hogar o evento.",
    categoriesAll: "Todas",
    errorMessage: "Ocurrió un problema al cargar el catálogo. Inténtalo nuevamente en unos minutos.",
    emptyAll: "Aún no hay productos disponibles. Vuelve pronto para descubrir nuestras novedades.",
    emptyCategory: "No hay productos en esta categoría por el momento. Prueba con otra categoría.",
    noImage: "Sin imagen",
    noCategory: "Sin categoría",
    addToCart: "Agregar al carrito",
    cartTitle: "Tu pedido",
    cartEmpty: 'Aún no agregas productos. Explora el catálogo y toca "Agregar al carrito".',
    totalLabel: "Total estimado",
    whatsappButton: "Hacer pedido por WhatsApp",
    whatsappHeader: "Hola Pinky Flame, quiero hacer un pedido digital.",
    whatsappTotalLabel: "Total estimado",
    close: "Cerrar",
    openCartAria: "Abrir carrito",
    closeCartAria: "Cerrar carrito",
    closeImageAria: "Cerrar imagen ampliada",
    decreaseQtyAria: "Disminuir cantidad",
    increaseQtyAria: "Aumentar cantidad",
    removeItem: "Quitar",
    languageSelectorAria: "Cambiar idioma a",
    orderLine: (name, category, quantity, price) =>
      `• ${name} (${category}) x${quantity} - $${(price * quantity).toFixed(2)}`,
  },
  en: {
    catalogTitle: "Digital Catalog",
    catalogSubtitle: "Discover all of our candles available for your home or event.",
    categoriesAll: "All",
    errorMessage: "We couldn't load the catalog right now. Please try again in a moment.",
    emptyAll: "No products available yet. Check back soon for new arrivals.",
    emptyCategory: "There are no products in this category right now. Try a different filter.",
    noImage: "No image",
    noCategory: "No category",
    addToCart: "Add to cart",
    cartTitle: "Your order",
    cartEmpty: 'You have not added any products yet. Browse the catalog and tap "Add to cart".',
    totalLabel: "Estimated total",
    whatsappButton: "Place order via WhatsApp",
    whatsappHeader: "Hi Pinky Flame, I would like to place a digital order.",
    whatsappTotalLabel: "Estimated total",
    close: "Close",
    openCartAria: "Open cart",
    closeCartAria: "Close cart",
    closeImageAria: "Close enlarged image",
    decreaseQtyAria: "Decrease quantity",
    increaseQtyAria: "Increase quantity",
    removeItem: "Remove",
    languageSelectorAria: "Switch language to",
    orderLine: (name, category, quantity, price) =>
      `• ${name} (${category}) x${quantity} - $${(price * quantity).toFixed(2)}`,
  },
};

function DigitalHeader({
  locale,
  onSelectLocale,
}: {
  locale: Locale;
  onSelectLocale: (locale: Locale) => void;
}) {
  return (
    <header
      className="bg-white"
      style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
    >
      <div className="relative mx-auto flex h-28 max-w-[393px] items-center justify-center px-6">
        <img
          src="/images/logo2.png"
          alt="Pinky Flame"
          className="h-16 w-auto object-contain"
        />
        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 gap-2">
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.code === locale;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => onSelectLocale(option.code)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_6px_18px_rgba(236,72,153,0.35)]"
                    : "bg-gray-100 text-gray-600"
                }`}
                aria-label={`${TRANSLATIONS[locale].languageSelectorAria} ${option.label}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default function DigitalCatalogPage({ locale }: { locale: Locale }) {
  const t = TRANSLATIONS[locale];
  const router = useRouter();
  const pathname = usePathname();
  const { candles, isLoading, error } = useCandles();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLocaleChange = (targetLocale: Locale) => {
    if (targetLocale === locale) return;
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    const restSegments = segments.slice(1);
    const nextPath =
      restSegments.length > 0
        ? `/${[targetLocale, ...restSegments].join("/")}`
        : `/${targetLocale}`;
    router.push(nextPath);
  };

  const activeCandles = useMemo(
    () => candles.filter((candle) => candle.isActive),
    [candles]
  );

  const resolveLocalizedValue = (
    field: Partial<Record<Locale, string>> | undefined,
    fallback: string
  ) => field?.[locale] || fallback;

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, string>();

    activeCandles.forEach((candle) => {
      const categoryKey = candle.category ?? "";

      if (!categoryMap.has(categoryKey)) {
        const localized = resolveLocalizedValue(
          candle.translations?.category,
          candle.category
        );

        categoryMap.set(
          categoryKey,
          localized && localized.trim().length > 0 ? localized : t.noCategory
        );
      }
    });

    return [
      { value: ALL_CATEGORIES, label: t.categoriesAll },
      ...Array.from(categoryMap.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [activeCandles, t.categoriesAll, t.noCategory, locale]);

  const filteredCandles = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) {
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
          category: candle.category || t.noCategory,
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
      t.whatsappHeader,
      "",
      ...cartItems.map((item) =>
        t.orderLine(item.name, item.category, item.quantity, item.price)
      ),
      "",
      `${t.whatsappTotalLabel}: $${total}`,
    ];

    const message = encodeURIComponent(lines.join("\n"));

    window.open(`https://wa.me/15513019412?text=${message}`, "_blank");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col bg-white text-gray-900">
      <DigitalHeader locale={locale} onSelectLocale={handleLocaleChange} />

      <main className="flex flex-1 flex-col gap-6 px-6 py-8">
        <section className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t.catalogTitle}
          </h1>
          <p className="text-base text-gray-600">
            {t.catalogSubtitle}
          </p>
        </section>

        <section className="flex gap-2 overflow-x-auto pb-2">
          {categoryOptions.map((category) => {
            const isActive = category.value === selectedCategory;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-pink-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.35)]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.label}
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
              {t.errorMessage}
            </div>
          )}

          {!isLoading && !error && filteredCandles.length === 0 && (
            <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              {selectedCategory === ALL_CATEGORIES
                ? t.emptyAll
                : t.emptyCategory}
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
                      alt={resolveLocalizedValue(
                        candle.translations?.name,
                        candle.name
                      )}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">{t.noImage}</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold">
                      {resolveLocalizedValue(
                        candle.translations?.name,
                        candle.name
                      )}
                    </h2>
                    {candle.description && (
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {resolveLocalizedValue(
                          candle.translations?.description,
                          candle.description
                        )}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-pink-500">
                        ${candle.price.toFixed(2)}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        {resolveLocalizedValue(
                          candle.translations?.category,
                          candle.category || t.noCategory
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: candle.id,
                          name: resolveLocalizedValue(
                            candle.translations?.name,
                            candle.name
                          ),
                          category: resolveLocalizedValue(
                            candle.translations?.category,
                            candle.category || t.noCategory
                          ),
                          price: candle.price,
                        })
                      }
                      className="w-full rounded-full bg-pink-500 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.35)] transition active:scale-95"
                    >
                      {t.addToCart}
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
            aria-label={t.closeImageAria}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-[360px] overflow-hidden rounded-3xl bg-white p-4">
            <img
              src={selectedImage}
              alt="Selected candle"
              className="h-full w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="mt-3 w-full rounded-xl bg-pink-500 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(236,72,153,0.35)] transition active:scale-95"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-300 text-white shadow-[0_12px_30px_rgba(236,72,153,0.45)] transition active:scale-95"
        aria-label={t.openCartAria}
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
            aria-label={t.closeCartAria}
          />
          <div className="relative z-10 w-full max-w-[360px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t.cartTitle}</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-sm text-gray-500"
              >
                {t.close}
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                {t.cartEmpty}
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
                          aria-label={t.decreaseQtyAria}
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
                          aria-label={t.increaseQtyAria}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-400 underline"
                        >
                          {t.removeItem}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.totalLabel}</span>
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
                    {t.whatsappButton}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <DigitalFooter locale={locale} />
    </div>
  );
}


