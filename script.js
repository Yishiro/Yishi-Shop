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
const checkoutFeedback = document.querySelector("[data-checkout-feedback]");
const openPaymentButton = document.querySelector("[data-open-payment]");
const paymentModal = document.querySelector("[data-payment-modal]");
const closePaymentButtons = document.querySelectorAll("[data-close-payment]");
const paymentMethodButtons = document.querySelectorAll("[data-payment-method]");
const paymentPreviewText = document.querySelector("[data-payment-preview-text]");
const paymentSubmitButton = document.querySelector("[data-payment-submit]");
const paymentStatusTitle = document.querySelector("[data-payment-status-title]");
const paymentStatusCopy = document.querySelector("[data-payment-status-copy]");
const paymentStatusMeta = document.querySelector("[data-payment-status-meta]");
const authForms = document.querySelectorAll("[data-auth-form]");
const accountName = document.querySelector("[data-account-name]");
const accountEmail = document.querySelector("[data-account-email]");
const accountDisplay = document.querySelector("[data-account-display]");
const accountMail = document.querySelector("[data-account-mail]");
const accountStatus = document.querySelector("[data-account-status]");
const accountOrders = document.querySelector("[data-account-orders]");
const logoutButton = document.querySelector("[data-logout]");
const sortModes = ["price-asc", "price-desc", "name-asc", "name-desc"];
const supabaseConfig = window.YISHI_SUPABASE_CONFIG || null;
const currentPath = window.location.pathname;
const isAuthPage =
  currentPath.endsWith("/login.html") ||
  currentPath.endsWith("/signup.html") ||
  currentPath.endsWith("/account.html");
const supabaseClient =
  window.supabase &&
  supabaseConfig?.url &&
  supabaseConfig?.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

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

const formatOrderDate = (value) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getReturnToUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("returnTo") || "account.html";
};

const isOrdersTableMissing = (error) =>
  error?.code === "42P01" || /orders/i.test(String(error?.message || ""));

const getPaymentMethodLabel = (method) =>
  method === "paypal" ? "PayPal" : "Carte bancaire";

const getOrderStatusLabel = (status) => {
  if (status === "paid") {
    return "Payee";
  }

  if (status === "delivered") {
    return "Livree";
  }

  return "En attente de paiement";
};

const renderOrders = (orders = [], message) => {
  if (!accountOrders) {
    return;
  }

  accountOrders.innerHTML = "";

  if (message) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "account-order";
    emptyCard.innerHTML = `<strong>${message}</strong>`;
    accountOrders.appendChild(emptyCard);
    return;
  }

  if (!orders.length) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "account-order";
    emptyCard.innerHTML =
      "<strong>Aucune commande pour le moment</strong><span>Ton historique apparaitra ici apres tes premiers achats.</span>";
    accountOrders.appendChild(emptyCard);
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "account-order";
    card.innerHTML = `
      <strong>${order.product_title}</strong>
      <div class="account-order-meta">
        <span>Quantite ${order.quantity}</span>
        <span>${formatPrice(Number(order.total_price || 0))}</span>
        <span>${getPaymentMethodLabel(order.payment_method)}</span>
      </div>
      <span>${getOrderStatusLabel(order.status)}</span>
      <span>${formatOrderDate(order.created_at)}</span>
    `;
    accountOrders.appendChild(card);
  });
};

const loadAccountOrders = async (user) => {
  if (!supabaseClient || !accountOrders || !user) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("orders")
    .select(
      "id, product_title, quantity, total_price, payment_method, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    renderOrders(
      [],
      isOrdersTableMissing(error)
        ? "Active la table orders dans Supabase pour afficher l'historique."
        : "Impossible de charger les commandes pour le moment."
    );
    return;
  }

  renderOrders(data || []);
};

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
  params.set("v", "t3ch-15");
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
      nextParams.set("v", "t3ch-15");
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
  let selectedPaymentMethod = "";

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
      `category.html?category=${encodeURIComponent(category)}&v=t3ch-15`
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

  const updateCheckoutFeedback = (message, isError = false) => {
    if (!checkoutFeedback) {
      return;
    }

    checkoutFeedback.innerHTML = message;
    checkoutFeedback.style.color = isError ? "#c2410c" : "";
  };

  const createPendingOrder = async (userId) => {
    const quantity = Math.min(99, Math.max(1, Number(qtyInput.value) || 1));
    const total = Number((price * quantity).toFixed(2));

    const { data, error } = await supabaseClient
      .from("orders")
      .insert({
        user_id: userId,
        product_title: title,
        product_category: category,
        product_image: image,
        unit_price: Number(price.toFixed(2)),
        quantity,
        total_price: total,
        payment_method: selectedPaymentMethod,
        status: "pending_payment",
      })
      .select("id, quantity, total_price")
      .single();

    return { data, error };
  };

  const requestPaymentRedirect = async (order) => {
    const endpoint =
      selectedPaymentMethod === "paypal"
        ? "/api/payments/paypal/create-order"
        : "/api/payments/stripe/create-session";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
        productTitle: title,
        category,
        quantity: order.quantity,
        unitPrice: Number(price.toFixed(2)),
        totalPrice: Number(order.total_price),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Impossible de lancer le paiement.");
    }

    return result;
  };

  if (openPaymentButton) {
    openPaymentButton.addEventListener("click", async () => {
      if (!supabaseClient) {
        updateCheckoutFeedback(
          "La connexion client n'est pas configuree pour le moment.",
          true
        );
        return;
      }

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `login.html?returnTo=${returnTo}`;
        return;
      }

      updateCheckoutFeedback(
        'En poursuivant, tu acceptes les <a href="cgv.html">CGV</a>.'
      );
      openModal();
    });
  }

  closePaymentButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  paymentMethodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!paymentPreviewText) {
        return;
      }

      selectedPaymentMethod = button.dataset.paymentMethod || "";
      if (paymentSubmitButton) {
        paymentSubmitButton.disabled = !selectedPaymentMethod;
      }

      paymentMethodButtons.forEach((item) => {
        item.classList.toggle("is-selected", item === button);
      });

      paymentPreviewText.textContent =
        selectedPaymentMethod === "paypal"
          ? `PayPal selectionné pour ${title}. La redirection PayPal sera branchée ici ensuite avec le montant ${formatPrice(
              price * (Number(qtyInput.value) || 1)
            )}.`
          : `Carte bancaire sélectionnée pour ${title}. Le Checkout Stripe sera branché ici ensuite avec le montant ${formatPrice(
              price * (Number(qtyInput.value) || 1)
            )}.`;
    });
  });

  if (paymentSubmitButton) {
    paymentSubmitButton.disabled = true;
    paymentSubmitButton.addEventListener("click", async () => {
      if (!supabaseClient || !selectedPaymentMethod) {
        return;
      }

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `login.html?returnTo=${returnTo}`;
        return;
      }

      paymentSubmitButton.disabled = true;
      paymentSubmitButton.textContent = "Preparation...";

      const { data: order, error: orderError } = await createPendingOrder(
        session.user.id
      );

      if (orderError) {
        updateCheckoutFeedback(
          isOrdersTableMissing(orderError)
            ? "Il faut d'abord creer la table orders dans Supabase avec le fichier supabase-orders.sql."
            : "Impossible d'enregistrer la commande pour le moment.",
          true
        );
        paymentSubmitButton.disabled = false;
        paymentSubmitButton.textContent = "Continuer";
        return;
      }

      try {
        const paymentResult = await requestPaymentRedirect(order);
        if (paymentResult.url) {
          window.location.href = paymentResult.url;
          return;
        }

        throw new Error("Aucune redirection de paiement n'a ete retournee.");
      } catch (error) {
        updateCheckoutFeedback(error.message, true);
        paymentSubmitButton.disabled = false;
        paymentSubmitButton.textContent = "Continuer";
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  updateCheckout();
}

const handlePaymentReturn = async () => {
  if (!paymentStatusTitle) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider");
  const orderId = params.get("orderId");
  const stripeSessionId = params.get("session_id");
  const paypalOrderId = params.get("token");
  const isCancelled = params.get("status") === "cancel";

  if (!provider || !orderId) {
    paymentStatusTitle.textContent = "Retour de paiement invalide";
    if (paymentStatusCopy) {
      paymentStatusCopy.textContent =
        "Les informations de paiement sont incomplètes.";
    }
    return;
  }

  if (isCancelled) {
    paymentStatusTitle.textContent = "Paiement annule";
    if (paymentStatusCopy) {
      paymentStatusCopy.textContent =
        "Ta commande existe toujours dans ton compte et reste en attente.";
    }
    if (paymentStatusMeta) {
      paymentStatusMeta.textContent = `Commande ${orderId}`;
    }
    return;
  }

  try {
    const endpoint =
      provider === "paypal"
        ? "/api/payments/paypal/capture-order"
        : "/api/payments/stripe/verify-session";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        paypalOrderId,
        stripeSessionId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Le paiement n'a pas pu etre verifie.");
    }

    paymentStatusTitle.textContent = "Paiement confirme";
    if (paymentStatusCopy) {
      paymentStatusCopy.textContent =
        "La commande a ete mise a jour et apparait maintenant comme payee dans ton compte.";
    }
    if (paymentStatusMeta) {
      paymentStatusMeta.textContent = `Commande ${orderId}`;
    }
  } catch (error) {
    paymentStatusTitle.textContent = "Verification en attente";
    if (paymentStatusCopy) {
      paymentStatusCopy.textContent = error.message;
    }
    if (paymentStatusMeta) {
      paymentStatusMeta.textContent = `Commande ${orderId}`;
    }
  }
};

handlePaymentReturn();

const setAuthFeedback = (form, message, isError = false) => {
  const feedback = form?.querySelector("[data-auth-feedback]");
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.style.color = isError ? "#c2410c" : "";
};

const getUserDisplayName = (user) =>
  user?.user_metadata?.display_name ||
  user?.email?.split("@")[0] ||
  "Client";

const applyAccountView = (user) => {
  if (!accountName) {
    return;
  }

  if (user) {
    const displayName = getUserDisplayName(user);
    accountName.textContent = `Bonjour ${displayName}`;

    if (accountEmail) {
      accountEmail.textContent = user.email || "";
    }

    if (accountDisplay) {
      accountDisplay.textContent = displayName;
    }

    if (accountMail) {
      accountMail.textContent = user.email || "";
    }

    if (accountStatus) {
      accountStatus.textContent = "Connecte";
    }

    if (logoutButton && !logoutButton.dataset.bound) {
      logoutButton.hidden = false;
      logoutButton.dataset.bound = "true";
      logoutButton.addEventListener("click", async () => {
        if (supabaseClient) {
          await supabaseClient.auth.signOut();
        }

        window.location.href = "login.html";
      });
    }

    loadAccountOrders(user);

    return;
  }

  accountName.textContent = "Mon compte";

  if (accountEmail) {
    accountEmail.textContent = supabaseClient
      ? "Connecte-toi pour retrouver ton espace client."
      : "Configuration Supabase manquante pour activer la connexion.";
  }

  if (accountDisplay) {
    accountDisplay.textContent = "Invite";
  }

  if (accountMail) {
    accountMail.textContent = "Non connecte";
  }

  if (accountStatus) {
    accountStatus.textContent = supabaseClient
      ? "Connexion requise"
      : "Configuration requise";
  }

  renderOrders([]);
};

const handleSupabaseAuth = async () => {
  if (!isAuthPage) {
    return;
  }

  if (!supabaseClient) {
    authForms.forEach((form) => {
      setAuthFeedback(
        form,
        "Ajoute ton URL Supabase et ta cle anon dans supabase-config.js pour activer la connexion.",
        true
      );
    });

    applyAccountView(null);
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  const currentUser = session?.user || null;

  if (currentPath.endsWith("/account.html")) {
    if (!currentUser) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `login.html?returnTo=${returnTo}`;
      return;
    }

    applyAccountView(currentUser);
  } else if (currentUser) {
    window.location.href = getReturnToUrl();
    return;
  }

  authForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();
      const displayName =
        String(formData.get("displayName") || "").trim() ||
        email.split("@")[0] ||
        "Client";

      setAuthFeedback(form, "Verification en cours...");

      if (form.dataset.authForm === "signup") {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) {
          setAuthFeedback(form, error.message, true);
          return;
        }

        setAuthFeedback(
          form,
          "Compte cree. Verifie aussi ton email si Supabase demande une confirmation, puis reconnecte-toi."
        );
        window.setTimeout(() => {
          window.location.href = `login.html?returnTo=${encodeURIComponent(
            getReturnToUrl()
          )}`;
        }, 1200);
        return;
      }

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthFeedback(form, error.message, true);
        return;
      }

      setAuthFeedback(form, "Connexion reussie. Redirection vers ton espace client...");
      window.setTimeout(() => {
        window.location.href = getReturnToUrl();
      }, 500);
    });
  });

  supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
    if (currentPath.endsWith("/account.html")) {
      applyAccountView(nextSession?.user || null);
    }
  });
};

handleSupabaseAuth();
