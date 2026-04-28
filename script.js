const discordInviteUrl = "https://discord.gg/yGMfuCsfNC";

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("[data-year]");
const discordLinks = document.querySelectorAll("[data-discord-link]");
const catalogMenu = document.querySelector(".catalog-menu");
const categoryTitle = document.querySelector("[data-category-title]");
const categoryGame = document.querySelector("[data-category-game]");
const categoryCopy = document.querySelector("[data-category-copy]");
const categoryLinks = document.querySelectorAll("[data-category-link]");
const productCards = document.querySelectorAll("[data-product-category]");
const productContainer = document.querySelector("[data-products]");
const productSort = document.querySelector("[data-product-sort]");
const emptyState = document.querySelector("[data-empty-state]");
const emptyTitle = document.querySelector("[data-empty-title]");
const checkoutTag = document.querySelector("[data-checkout-tag]");
const checkoutTagChip = document.querySelector("[data-checkout-tag-chip]");
const checkoutTitle = document.querySelector("[data-checkout-title]");
const checkoutName = document.querySelector("[data-checkout-name]");
const checkoutPrice = document.querySelector("[data-checkout-price]");
const checkoutDescription = document.querySelector("[data-checkout-description]");
const checkoutImage = document.querySelector("[data-checkout-image]");
const checkoutVisual = document.querySelector("[data-checkout-visual]");
const checkoutBack = document.querySelector("[data-checkout-back]");
const qtyInput = document.querySelector("[data-qty-input]");
const qtyButtons = document.querySelectorAll("[data-qty-action]");
const summaryName = document.querySelector("[data-summary-name]");
const summaryUnit = document.querySelector("[data-summary-unit]");
const summaryQty = document.querySelector("[data-summary-qty]");
const summaryTotal = document.querySelector("[data-summary-total]");
const openPaymentButton = document.querySelector("[data-open-payment]");
const paymentModal = document.querySelector("[data-payment-modal]");
const closePaymentButtons = document.querySelectorAll("[data-close-payment]");
const paymentMethodButtons = document.querySelectorAll("[data-payment-method]");
const paymentPreviewText = document.querySelector("[data-payment-preview-text]");
const sortModes = ["price-asc", "price-desc", "name-asc", "name-desc"];

const categories = {
  skins: {
    game: "Blox Fruit",
    title: "Skins",
    copy: "Retrouve les skins Blox Fruit disponibles sur Yishi's Shop.",
  },
  fruits: {
    game: "Blox Fruit",
    title: "Fruits",
    copy: "Retrouve les fruits Blox Fruit disponibles sur Yishi's Shop.",
  },
  permanents: {
    game: "Blox Fruit",
    title: "Permanents",
    copy: "Retrouve les permanents Blox Fruit disponibles sur Yishi's Shop.",
  },
  gamepass: {
    game: "Blox Fruit",
    title: "Gamepass",
    copy: "Retrouve les gamepass Blox Fruit disponibles sur Yishi's Shop.",
  },
  boosts: {
    game: "Blox Fruit",
    title: "Boosts",
    copy: "Retrouve les boosts Blox Fruit disponibles sur Yishi's Shop.",
  },
  token: {
    game: "Blade Ball",
    title: "Token",
    copy: "Retrouve les tokens Blade Ball disponibles sur Yishi's Shop.",
  },
  "t3ch-products": {
    game: "T3CH",
    title: "Produits",
    copy: "Retrouve les produits T3CH disponibles sur Yishi's Shop.",
  },
};

const formatPrice = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

discordLinks.forEach((link) => {
  link.setAttribute("href", discordInviteUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

if (catalogMenu) {
  const gameMenus = catalogMenu.querySelectorAll(".game-menu");

  gameMenus.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (!menu.open) {
        return;
      }

      gameMenus.forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.removeAttribute("open");
        }
      });
    });
  });

  catalogMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      catalogMenu.removeAttribute("open");
    });
  });
}

const getProductTitle = (card) => {
  const title = card.dataset.title || card.querySelector("h3")?.textContent || "";
  return title.trim().toLocaleLowerCase("fr");
};

const getProductPrice = (card) => {
  const rawPrice =
    card.dataset.price || card.querySelector(".price")?.textContent || "0";
  return Number(rawPrice.replace(",", ".").replace(/[^\d.]/g, ""));
};

const getProductPayload = (card) => {
  const image = card.querySelector("img");
  const tag = card.querySelector(".product-tag")?.textContent?.trim() || "Produit";
  const description =
    card.querySelector("p")?.textContent?.trim() ||
    "Produit disponible sur le shop.";

  return {
    title: card.dataset.title || card.querySelector("h3")?.textContent?.trim() || "Produit",
    price: String(getProductPrice(card)),
    tag,
    description,
    image: image?.getAttribute("src") || "",
    category: card.dataset.productCategory || "skins",
  };
};

const buildProductUrl = (payload) => {
  const params = new URLSearchParams(payload);
  params.set("v", "t3ch-12");
  return `product.html?${params.toString()}`;
};

const sortProducts = (sortMode = "price-asc") => {
  if (!productContainer || !productCards.length) {
    return;
  }

  const sortedCards = Array.from(productCards).sort((first, second) => {
    const firstTitle = getProductTitle(first);
    const secondTitle = getProductTitle(second);
    const firstPrice = getProductPrice(first);
    const secondPrice = getProductPrice(second);

    if (sortMode === "name-asc") {
      return firstTitle.localeCompare(secondTitle, "fr");
    }

    if (sortMode === "name-desc") {
      return secondTitle.localeCompare(firstTitle, "fr");
    }

    if (sortMode === "price-desc") {
      return secondPrice - firstPrice || firstTitle.localeCompare(secondTitle, "fr");
    }

    return firstPrice - secondPrice || firstTitle.localeCompare(secondTitle, "fr");
  });

  sortedCards.forEach((card) => productContainer.appendChild(card));
};

if (categoryTitle && productCards.length) {
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = categories[params.get("category")]
    ? params.get("category")
    : "skins";
  const selected = categories[selectedCategory];
  const selectedSort = sortModes.includes(params.get("sort"))
    ? params.get("sort")
    : "price-asc";

  const updateVisibleProducts = () => {
    let visibleProducts = 0;

    productCards.forEach((card) => {
      const isVisible = card.dataset.productCategory === selectedCategory;
      card.hidden = !isVisible;

      if (isVisible) {
        visibleProducts += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleProducts > 0;
    }
  };

  document.title = `${selected.title} | Yishi's Shop`;
  categoryTitle.textContent = selected.title;

  if (categoryGame) {
    categoryGame.textContent = selected.game;
  }

  if (categoryCopy) {
    categoryCopy.textContent = selected.copy;
  }

  if (productContainer) {
    productContainer.dataset.activeCategory = selectedCategory;
  }

  categoryLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.dataset.categoryLink === selectedCategory
    );
  });

  if (productSort) {
    productSort.value = selectedSort;
    productSort.addEventListener("change", () => {
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("category", selectedCategory);
      nextParams.set("sort", productSort.value);
      nextParams.set("v", "t3ch-12");
      window.history.replaceState(null, "", `?${nextParams.toString()}`);
      sortProducts(productSort.value);
      updateVisibleProducts();
    });
  }

  sortProducts(selectedSort);
  updateVisibleProducts();

  if (emptyTitle) {
    emptyTitle.textContent = `${selected.title} bientôt disponible`;
  }
}

if (productCards.length) {
  productCards.forEach((card) => {
    const link = card.querySelector(".card-link");
    if (!link) {
      return;
    }

    const productUrl = buildProductUrl(getProductPayload(card));
    link.setAttribute("href", productUrl);
  });
}

if (checkoutTitle && qtyInput) {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Produit";
  const price = Number(params.get("price") || "0");
  const tag = params.get("tag") || "Produit";
  const description =
    params.get("description") ||
    "Produit disponible sur le shop. Finalise ici ta commande avant le paiement.";
  const image = params.get("image") || "";
  const category = params.get("category") || "skins";

  const updateCheckout = () => {
    const quantity = Math.min(99, Math.max(1, Number(qtyInput.value) || 1));
    const total = price * quantity;
    qtyInput.value = String(quantity);

    if (summaryQty) {
      summaryQty.textContent = String(quantity);
    }

    if (summaryTotal) {
      summaryTotal.textContent = formatPrice(total);
    }
  };

  document.title = `${title} | Commande | Yishi's Shop`;

  if (checkoutTitle) {
    checkoutTitle.textContent = title;
  }

  if (checkoutName) {
    checkoutName.textContent = title;
  }

  if (checkoutTag) {
    checkoutTag.textContent = tag;
  }

  if (checkoutTagChip) {
    checkoutTagChip.textContent = tag;
  }

  if (checkoutPrice) {
    checkoutPrice.textContent = formatPrice(price);
  }

  if (checkoutDescription) {
    checkoutDescription.textContent = description;
  }

  if (summaryName) {
    summaryName.textContent = title;
  }

  if (summaryUnit) {
    summaryUnit.textContent = formatPrice(price);
  }

  if (checkoutImage) {
    checkoutImage.setAttribute("src", image || "assets/hero-yishis-shop.png");
    checkoutImage.setAttribute("alt", title);
  }

  if (checkoutVisual) {
    checkoutVisual.dataset.checkoutCategory = category;
  }

  if (checkoutBack) {
    checkoutBack.setAttribute(
      "href",
      `category.html?category=${encodeURIComponent(category)}&v=t3ch-12`
    );
  }

  qtyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentQuantity = Number(qtyInput.value) || 1;
      qtyInput.value = String(
        button.dataset.qtyAction === "increase"
          ? currentQuantity + 1
          : currentQuantity - 1
      );
      updateCheckout();
    });
  });

  qtyInput.addEventListener("input", updateCheckout);
  qtyInput.addEventListener("blur", updateCheckout);

  const openModal = () => {
    if (!paymentModal) {
      return;
    }

    paymentModal.hidden = false;
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    if (!paymentModal) {
      return;
    }

    paymentModal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  if (openPaymentButton) {
    openPaymentButton.addEventListener("click", openModal);
  }

  closePaymentButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  paymentMethodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!paymentPreviewText) {
        return;
      }

      paymentMethodButtons.forEach((item) => {
        item.classList.toggle("is-selected", item === button);
      });

      paymentPreviewText.textContent =
        button.dataset.paymentMethod === "paypal"
          ? `PayPal selectionné pour ${title}. La redirection PayPal sera branchée ici ensuite avec le montant ${formatPrice(
              price * (Number(qtyInput.value) || 1)
            )}.`
          : `Carte bancaire sélectionnée pour ${title}. Le Checkout Stripe sera branché ici ensuite avec le montant ${formatPrice(
              price * (Number(qtyInput.value) || 1)
            )}.`;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  updateCheckout();
}
