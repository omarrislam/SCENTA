import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCollection, listProducts, listProductsByIds } from "../../services/catalogService";
import ProductCard from "../../components/product/ProductCard";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { useCart } from "../../storefront/cart/CartContext";
import { useToast } from "../../components/feedback/ToastContext";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import { Product } from "../../services/types";
import { resolveResponsiveImageSource } from "../../services/api";

const ShopPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const tag = params.get("tag") ?? "";
  const page = Number(params.get("page") ?? "1");
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const perPage = 6;
  const [searchValue, setSearchValue] = useState(search);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const { data: activeCollection } = useQuery({
    queryKey: ["collection", slug],
    queryFn: () => getCollection(slug ?? ""),
    enabled: Boolean(slug)
  });

  const { data: productsData, isLoading, isFetching } = useQuery({
    queryKey: ["products", search, sort, tag, page],
    queryFn: () => listProducts({ search, page, limit: perPage }),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData
  });

  const { data: collectionProducts = [] } = useQuery({
    queryKey: ["collection-products", activeCollection?.productIds?.join(",")],
    queryFn: () => listProductsByIds(activeCollection?.productIds ?? []),
    enabled: Boolean(activeCollection?.productIds?.length)
  });

  const baseProducts = activeCollection?.productIds?.length
    ? collectionProducts
    : productsData?.items ?? [];

  const filtered = useMemo(() => {
    let items = [...baseProducts];
    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch) {
      items = items.filter((product) => {
        const name = product.name.toLowerCase();
        const nameAr = product.nameAr?.toLowerCase() ?? "";
        return name.includes(normalizedSearch) || nameAr.includes(normalizedSearch);
      });
    }
    if (tag) {
      items = items.filter((product) => product.tags.some((value) => value === tag));
    }
    if (sort === "price-asc") {
      items.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    }
    if (sort === "price-desc") {
      items.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    }
    return items;
  }, [baseProducts, search, sort, tag]);

  const shouldSlice =
    Boolean(activeCollection?.productIds?.length) || (productsData?.limit ?? perPage) > perPage;
  const totalPages = shouldSlice
    ? Math.max(1, Math.ceil(filtered.length / perPage))
    : Math.max(1, Math.ceil((productsData?.total ?? filtered.length) / perPage));

  const paged = shouldSlice ? filtered.slice((page - 1) * perPage, page * perPage) : filtered;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const paramsString = params.toString();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = new URLSearchParams(paramsString);
      const trimmed = searchValue.trim();
      if (trimmed === search) {
        return;
      }
      if (trimmed) {
        next.set("q", trimmed);
      } else {
        next.delete("q");
      }
      setParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchValue, search, paramsString, setParams]);

  useEffect(() => {
    if (!quickViewProduct) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [quickViewProduct]);

  const handleQuickAdd = (item: typeof filtered[number]) => {
    const variant = item.variants[0];
    if ((variant?.stock ?? 0) <= 0) {
      pushToast(t("stock.out"), "error");
      return;
    }
    addItem(item, variant);
    pushToast(t("cta.addedCart"), "success");
  };

  const heading = activeCollection
    ? pickLocalized(activeCollection.title, activeCollection.titleAr, locale)
    : t("shop.title");

  const tags = useMemo(() => ["warm", "fresh", "bold"], []);
  const hasFilters = Boolean(search || tag || sort !== "featured");
  const quickViewName = quickViewProduct
    ? pickLocalized(quickViewProduct.name, quickViewProduct.nameAr, locale)
    : "";
  const quickViewDescription = quickViewProduct
    ? pickLocalized(quickViewProduct.description, quickViewProduct.descriptionAr, locale)
    : "";
  const quickViewPrice = quickViewProduct?.variants[0]?.price ?? 0;
  const quickViewStock = quickViewProduct?.variants[0]?.stock ?? 0;
  const quickViewImage = resolveResponsiveImageSource(quickViewProduct?.images?.[0]);
  const showSkeletons = (isLoading && !productsData) || (isFetching && paged.length === 0);
  const skeletonCount = Math.max(4, perPage);

  const handleQuickViewAdd = () => {
    if (!quickViewProduct) {
      return;
    }
    handleQuickAdd(quickViewProduct);
    setQuickViewProduct(null);
  };

  return (
    <>
      <div className="grid shop-layout">
        <aside
          className={`filters ${isMobileFiltersOpen ? "filters--mobile-open" : "filters--mobile-collapsed"}`.trim()}
        >
        <div className="filters__group">
          <label>{t("shop.searchLabel")}</label>
          <div className="form-inline">
            <TextInput
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("shop.searchPlaceholder")}
            />
            {searchValue && (
              <button
                className="button button--ghost"
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateParam("q", "");
                }}
              >
                {t("shop.clear")}
              </button>
            )}
          </div>
        </div>
        <div className="filters__group">
          <label>{t("shop.sortLabel")}</label>
          <Select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
            <option value="featured">{t("shop.sortFeatured")}</option>
            <option value="price-asc">{t("shop.sortPriceAsc")}</option>
            <option value="price-desc">{t("shop.sortPriceDesc")}</option>
          </Select>
        </div>
        <div className="filters__group">
          <label>{t("shop.tagsLabel")}</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {tags.map((value) => (
              <button
                key={value}
                className="pill"
                type="button"
                onClick={() => updateParam("tag", tag === value ? "" : value)}
              >
                {value}
              </button>
            ))}
            {tag && (
              <button className="pill pill--clear" type="button" onClick={() => updateParam("tag", "")}>
                {t("shop.clearTag")}
              </button>
            )}
          </div>
        </div>
        </aside>
        <section>
          <div className="shop-mobile-toolbar">
            <button
              className={`button ${isMobileFiltersOpen ? "button--primary" : "button--outline"}`}
              type="button"
              onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            >
              {isMobileFiltersOpen ? t("shop.hideFilters") : t("shop.showFilters")}
            </button>
            <Select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
              <option value="featured">{t("shop.sortFeatured")}</option>
              <option value="price-asc">{t("shop.sortPriceAsc")}</option>
              <option value="price-desc">{t("shop.sortPriceDesc")}</option>
            </Select>
            <p className="shop-mobile-toolbar__meta">
              {hasFilters ? t("shop.filtersApplied") : t("shop.filtersNone")}
            </p>
          </div>
          <h1 className="section-title">{heading}</h1>
          <div className="product-grid">
            {showSkeletons
              ? Array.from({ length: skeletonCount }).map((_, index) => (
                  <article key={`skeleton-${index}`} className="product-card product-card--skeleton" aria-hidden="true">
                    <div className="product-card__media skeleton-block" />
                    <div className="product-card__body">
                      <div className="skeleton-line skeleton-line--title" />
                      <div className="skeleton-line skeleton-line--meta" />
                      <div className="product-card__footer">
                        <div className="skeleton-line skeleton-line--price" />
                        <div className="skeleton-button" />
                      </div>
                    </div>
                  </article>
                ))
              : paged.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickAdd={handleQuickAdd}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
          </div>
          <div className="pagination-controls">
            <button
              className="button"
              type="button"
              onClick={() => updateParam("page", String(Math.max(1, page - 1)))}
            >
              {t("shop.prev")}
            </button>
            <span>{t("shop.pageOf", { current: page, total: totalPages })}</span>
            <button
              className="button"
              type="button"
              onClick={() => updateParam("page", String(Math.min(totalPages, page + 1)))}
            >
              {t("shop.next")}
            </button>
          </div>
        </section>
      </div>
      {quickViewProduct && (
        <div className="quick-view-overlay" role="presentation" onClick={() => setQuickViewProduct(null)}>
          <article
            className="quick-view-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("shop.quickViewTitle")}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="quick-view-modal__close"
              type="button"
              aria-label={t("shop.close")}
              onClick={() => setQuickViewProduct(null)}
            >
              x
            </button>
            <div className="quick-view-modal__media">
              {quickViewImage?.src ? <img src={quickViewImage.src} srcSet={quickViewImage.srcSet} alt={quickViewName} /> : null}
            </div>
            <div className="quick-view-modal__body">
              <h2>{quickViewName}</h2>
              <p>{quickViewDescription}</p>
              <p className="quick-view-modal__price">EGP {quickViewPrice.toLocaleString()}</p>
              <p className="quick-view-modal__stock">
                {quickViewStock > 0 ? t("stock.ok", { count: quickViewStock }) : t("stock.out")}
              </p>
              <div className="quick-view-modal__actions">
                <button className="button button--primary" type="button" onClick={handleQuickViewAdd}>
                  {t("cta.addToCart")}
                </button>
                <Link className="button button--outline" to={`/product/${quickViewProduct.slug}`} onClick={() => setQuickViewProduct(null)}>
                  {t("cta.view")}
                </Link>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
};

export default ShopPage;
