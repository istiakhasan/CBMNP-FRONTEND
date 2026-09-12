/* eslint-disable @next/next/no-img-element */
"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductOrderList from "./Abc";
import { Badge, Empty, Skeleton, message } from "antd";
import GbDrawer from "@/components/ui/GbDrawer";
import moment from "moment";
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";

const ProductShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customer, setCustomer] = useState<any>({});
  const [now, setNow] = useState(moment());
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: organization } = useGetOrganizationByIdQuery(undefined);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 30000);
    return () => clearInterval(timer);
  }, []);

  // F2 = jump to barcode / search field, like most billing counters
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { data, isLoading } = useGetAllProductQuery({
    searchTerm: debouncedSearchTerm,
    limit: "200",
    active: true,
  });

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    data?.data?.forEach((p: any) => {
      if (p?.category?.id) map.set(p.category.id, p.category.label);
    });
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return data?.data ?? [];
    return (data?.data ?? []).filter((p: any) => p?.category?.id === activeCategory);
  }, [data, activeCategory]);

  const handleAddToCart = (product: any) => {
    const stock = Number(product?.inventories?.stock || 0);
    if (stock < 1) return message.error("Out of stock");
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > stock) {
          message.error("No more stock available");
          return prev;
        }
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pos-shell">
      <GbHeader />

      {/* Counter strip — shop name, counter, live clock */}
      <div className="pos-counter-bar">
        <div className="pos-counter-shop">
          <i className="ri-store-2-line" />
          {organization?.data?.name || "Point of Sale"}
        </div>
        <div className="pos-counter-meta">
          <span>Counter 01</span>
          <span>{now.format("DD MMM YYYY, hh:mm:ss A")}</span>
        </div>
        <button className="pos-cart-fab" onClick={() => setDrawerOpen(true)}>
          <Badge count={cartCount} size="small">
            <i className="ri-shopping-cart-2-line" />
          </Badge>
        </button>
      </div>

      <div className="pos-layout">
        <div className="pos-catalog">
          <div className="pos-scan-row">
            <i className="ri-barcode-line" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Scan barcode or type product name…  [F2]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} aria-label="Clear search">
                <i className="ri-close-line" />
              </button>
            )}
          </div>

          <div className="pos-category-rail">
            <button className={activeCategory === "all" ? "active" : ""} onClick={() => setActiveCategory("all")}>
              All items
            </button>
            {categories.map((c) => (
              <button key={c.id} className={activeCategory === c.id ? "active" : ""} onClick={() => setActiveCategory(c.id)}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="pos-grid-scroll custom_scroll">
            {isLoading ? (
              <div className="pos-grid">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div className="pos-card pos-card-skeleton" key={i}>
                    <Skeleton.Image active style={{ width: "100%", height: 80 }} />
                    <Skeleton active title paragraph={{ rows: 1 }} />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <Empty description="No products found" className="pos-empty" />
            ) : (
              <div className="pos-grid">
                {filteredProducts.map((product: any) => {
                  const cartItem = cart.find((p) => p.id === product.id);
                  const stock = Number(product?.inventories?.stock || 0);
                  const lowStock = stock > 0 && stock <= 10;
                  const outOfStock = stock < 1;

                  return (
                    <button
                      key={product.id}
                      className={`pos-card ${outOfStock ? "is-out" : ""} ${cartItem ? "is-in-cart" : ""}`}
                      disabled={outOfStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      {cartItem && <span className="pos-card-qty-badge">{cartItem.quantity}</span>}
                      <div className="pos-card-media">
                        <img src={product?.images?.[0]?.url} alt={product.name} />
                      </div>
                      <div className="pos-card-body">
                        <h3>{product?.name?.length > 34 ? `${product.name.slice(0, 34)}…` : product?.name}</h3>
                        <div className="pos-card-footer">
                          <span className="pos-price">৳{product.salePrice?.toLocaleString()}</span>
                          <span className={`pos-stock-tag ${outOfStock ? "out" : lowStock ? "low" : ""}`}>
                            {outOfStock ? "Out" : `Stk ${stock}`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pos-cart-panel">
          <ProductOrderList
            cart={cart}
            setCart={setCart}
            handleQuantityChange={handleQuantityChange}
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>
      </div>

      <GbDrawer open={drawerOpen} setOpen={setDrawerOpen}>
        <ProductOrderList
          cart={cart}
          setCart={setCart}
          handleQuantityChange={handleQuantityChange}
          customer={customer}
          setCustomer={setCustomer}
        />
      </GbDrawer>
    </div>
  );
};

export default ProductShowcase;