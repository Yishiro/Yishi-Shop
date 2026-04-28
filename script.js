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
const adminOrders = document.querySelector("[data-admin-orders]");
const adminEntries = document.querySelectorAll("[data-admin-entry]");
const adminStats = document.querySelector("[data-admin-stats]");
const adminSearch = document.querySelector("[data-admin-search]");
const adminFilter = document.querySelector("[data-admin-filter]");
const conversationThread = document.querySelector("[data-conversation-thread]");
const conversationForm = document.querySelector("[data-conversation-form]");
const conversationEmpty = document.querySelector("[data-conversation-empty]");
const logoutButton = document.querySelector("[data-logout]");
const sortModes = ["price-asc", "price-desc", "name-asc", "name-desc"];
const adminEmail = "yishiroof@gmail.com";
let activeConversationOrderId = "";
let activeConversationMode = "";
let currentAccountOrders = [];
let currentAdminOrders = [];
const supabaseConfig = window.YISHI_SUPABASE_CONFIG || null;
const currentPath = window.location.pathname;
const isAccountPage =
  currentPath.endsWith("/account.html") || currentPath.endsWith("/admin.html");
const isAuthPage =
  currentPath.endsWith("/login.html") ||
  currentPath.endsWith("/signup.html") ||
  isAccountPage;
const needsUserBootstrap = isAuthPage || adminEntries.length > 0;
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

const isAdminUser = (user) =>
  String(user?.email || "").trim().toLowerCase() === adminEmail;

const isPendingOrderExpired = (order) => {
  if (order?.status !== "pending_payment" || !order?.created_at) {
    return false;
  }

  const createdAt = new Date(order.created_at).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt > 10 * 60 * 1000;
};

const getOrderStatusLabel = (status) => {
  if (status === "paid") {
    return "Payee";
  }

  if (status === "delivered") {
    return "Livree";
  }

  if (status === "processing") {
    return "En preparation";
  }

  if (status === "cancelled") {
    return "Annulee";
  }

  return "En attente de paiement";
};

const getOrderTrackingSteps = (status) => {
  const steps = [
    { key: "created", label: "Commande creee", done: true },
    {
      key: "paid",
      label: "Paiement valide",
      done: ["paid", "processing", "delivered"].includes(status),
    },
    {
      key: "processing",
      label: "En preparation",
      done: ["processing", "delivered"].includes(status),
    },
    {
      key: "delivered",
      label: "Livree",
      done: status === "delivered",
    },
  ];

  if (status === "cancelled") {
    return [{ key: "cancelled", label: "Commande annulee", done: true }];
  }

  return steps;
};

const renderTrackingMarkup = (status) =>
  getOrderTrackingSteps(status)
    .map(
      (step) =>
        `<span class="tracking-step${step.done ? " is-done" : ""}">${step.label}</span>`
    )
    .join("");

const updateAdminEntries = (isAdmin) => {
  adminEntries.forEach((entry) => {
    entry.hidden = !isAdmin;
  });
};

const renderOrders = (orders = [], message) => {
  if (!accountOrders) {
    return;
  }

  accountOrders.innerHTML = "";
  currentAccountOrders = orders.filter((order) => !isPendingOrderExpired(order));

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

  currentAccountOrders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "account-order";
    card.innerHTML = `
      <div class="account-order-head">
        <strong>${order.product_title}</strong>
        <span class="product-tag">${getOrderStatusLabel(order.status)}</span>
      </div>
      <div class="account-order-meta">
        <span>#${String(order.id || "").slice(0, 8)}</span>
        <span>Quantite ${order.quantity}</span>
        <span>${formatPrice(Number(order.total_price || 0))}</span>
        <span>${getPaymentMethodLabel(order.payment_method)}</span>
      </div>
      <div class="tracking-steps">${renderTrackingMarkup(order.status)}</div>
      <div class="account-actions">
        <button type="button" class="button button-secondary" data-open-conversation="${order.id}">Voir la discussion</button>
      </div>
      <span>${formatOrderDate(order.created_at)}</span>
    `;
    accountOrders.appendChild(card);
  });
};

const renderAdminOrders = (orders = [], message) => {
  if (!adminOrders) {
    return;
  }

  adminOrders.innerHTML = "";
  currentAdminOrders = orders;

  if (message) {
    const card = document.createElement("article");
    card.className = "account-order";
    card.innerHTML = `<strong>${message}</strong>`;
    adminOrders.appendChild(card);
    return;
  }

  if (!orders.length) {
    const card = document.createElement("article");
    card.className = "account-order";
    card.innerHTML = "<strong>Aucune commande active pour le moment</strong>";
    adminOrders.appendChild(card);
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "account-order admin-order";
    card.innerHTML = `
      <div class="account-order-head">
        <strong>${order.product_title}</strong>
        <span class="product-tag">${getOrderStatusLabel(order.status)}</span>
      </div>
      <div class="account-order-meta">
        <span>#${String(order.id || "").slice(0, 8)}</span>
        <span>${order.user_email || "Client inconnu"}</span>
        <span>Quantite ${order.quantity}</span>
        <span>${formatPrice(Number(order.total_price || 0))}</span>
      </div>
      <div class="tracking-steps">${renderTrackingMarkup(order.status)}</div>
      <div class="admin-order-controls">
        <select data-admin-status="${order.id}">
          <option value="paid"${order.status === "paid" ? " selected" : ""}>Payee</option>
          <option value="processing"${order.status === "processing" ? " selected" : ""}>En preparation</option>
          <option value="delivered"${order.status === "delivered" ? " selected" : ""}>Livree</option>
          <option value="cancelled"${order.status === "cancelled" ? " selected" : ""}>Annulee</option>
        </select>
        <button type="button" class="button button-secondary" data-admin-update="${order.id}">Mettre a jour</button>
        <button type="button" class="button button-secondary" data-open-conversation="${order.id}">Messages</button>
      </div>
      <span>${formatOrderDate(order.created_at)}</span>
    `;
    adminOrders.appendChild(card);
  });
};

const renderAdminStats = (orders = []) => {
  if (!adminStats) {
    return;
  }

  const paidCount = orders.filter((order) => order.status === "paid").length;
  const processingCount = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  adminStats.innerHTML = `
    <article class="admin-stat-card">
      <span>Total commandes</span>
      <strong>${orders.length}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Payees</span>
      <strong>${paidCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>En preparation</span>
      <strong>${processingCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Livrees</span>
      <strong>${deliveredCount}</strong>
    </article>
  `;
};

const applyAdminFilters = () => {
  if (!adminOrders) {
    return;
  }

  const searchValue = String(adminSearch?.value || "")
    .trim()
    .toLowerCase();
  const filterValue = String(adminFilter?.value || "all");

  const filteredOrders = currentAdminOrders.filter((order) => {
    const matchesStatus =
      filterValue === "all" ? true : String(order.status) === filterValue;
    const haystack = [
      order.product_title,
      order.user_email,
      order.id,
      getOrderStatusLabel(order.status),
    ]
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!searchValue || haystack.includes(searchValue));
  });

  renderAdminOrders(filteredOrders);
  bindConversationButtons("admin");
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
  bindConversationButtons("buyer");
};

const loadAdminOrders = async () => {
  if (!supabaseClient || !adminOrders) {
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const response = await fetch("/api/orders/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    renderAdminOrders([], result.error || "Impossible de charger les commandes admin.");
    return;
  }

  renderAdminOrders(result.orders || []);
  renderAdminStats(result.orders || []);
  bindConversationButtons("admin");

  adminOrders.querySelectorAll("[data-admin-update]").forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = button.dataset.adminUpdate;
      const select = adminOrders.querySelector(`[data-admin-status="${orderId}"]`);
      const nextStatus = select?.value;

      if (!orderId || !nextStatus) {
        return;
      }

      button.disabled = true;
      button.textContent = "Maj...";

      const updateResponse = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          orderId,
          status: nextStatus,
        }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        button.disabled = false;
        button.textContent = "Reessayer";
        return;
      }

      await loadAdminOrders();
      if (accountName) {
        loadAccountOrders({ id: session?.user?.id });
      }
    });
  });
};

const renderConversation = (messages = []) => {
  if (!conversationThread) {
    return;
  }

  conversationThread.innerHTML = "";

  if (!messages.length) {
    const emptyMessage = document.createElement("article");
    emptyMessage.className = "message-bubble";
    emptyMessage.innerHTML =
      "<strong>Aucun message pour le moment</strong><span>Commence la discussion depuis cette commande.</span>";
    conversationThread.appendChild(emptyMessage);
    return;
  }

  messages.forEach((message) => {
    const item = document.createElement("article");
    item.className = `message-bubble${message.author_role === "admin" ? " is-admin" : " is-buyer"}`;
    item.innerHTML = `
      <strong>${message.author_role === "admin" ? "Admin" : message.user_email || "Client"}</strong>
      <p>${message.message}</p>
      <span>${formatOrderDate(message.created_at)}</span>
    `;
    conversationThread.appendChild(item);
  });

  conversationThread.scrollTop = conversationThread.scrollHeight;
};

const loadConversation = async (orderId, mode) => {
  if (!conversationThread || !conversationForm) {
    return;
  }

  activeConversationOrderId = orderId;
  activeConversationMode = mode;

  if (conversationEmpty) {
    conversationEmpty.textContent = `Discussion ouverte pour la commande #${String(orderId).slice(0, 8)}.`;
  }

  conversationThread.hidden = false;
  conversationForm.hidden = false;
  conversationThread.innerHTML =
    '<article class="message-bubble"><strong>Chargement...</strong></article>';

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const response = await fetch("/api/messages/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const result = await response.json();

  if (!response.ok) {
    renderConversation([
      {
        author_role: "admin",
        user_email: "",
        message: result.error || "Impossible de charger les messages.",
        created_at: new Date().toISOString(),
      },
    ]);
    return;
  }

  renderConversation(result.messages || []);
};

const bindConversationButtons = (mode) => {
  document.querySelectorAll("[data-open-conversation]").forEach((button) => {
    if (button.dataset.bound === "true") {
      return;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const orderId = button.dataset.openConversation;
      if (!orderId) {
        return;
      }

      loadConversation(orderId, mode);
    });
  });
};

const bindConversationForm = () => {
  if (!conversationForm) {
    return;
  }

  conversationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeConversationOrderId) {
      return;
    }

    const formData = new FormData(conversationForm);
    const message = String(formData.get("message") || "").trim();

    if (!message) {
      return;
    }

    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({
        orderId: activeConversationOrderId,
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return;
    }

    conversationForm.reset();
    await loadConversation(activeConversationOrderId, activeConversationMode);
  });
};

if (adminSearch) {
  adminSearch.addEventListener("input", applyAdminFilters);
}

if (adminFilter) {
  adminFilter.addEventListener("change", applyAdminFilters);
}

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
  params.set("v", "t3ch-18");
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
      nextParams.set("v", "t3ch-18");
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
      `category.html?category=${encodeURIComponent(category)}&v=t3ch-18`
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

  const createPendingOrder = async (userId, userEmail) => {
    const quantity = Math.min(99, Math.max(1, Number(qtyInput.value) || 1));
    const total = Number((price * quantity).toFixed(2));

    const { data, error } = await supabaseClient
      .from("orders")
      .insert({
        user_id: userId,
        user_email: userEmail,
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
        session.user.id,
        session.user.email || ""
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
bindConversationForm();

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
    const isAdmin = isAdminUser(user);
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
      accountStatus.textContent = isAdmin ? "Admin" : "Connecte";
    }
    updateAdminEntries(isAdmin);

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
    if (isAdmin) {
      loadAdminOrders();
    }

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
  updateAdminEntries(false);

  renderOrders([]);
};

const handleSupabaseAuth = async () => {
  if (!needsUserBootstrap) {
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
  } else if (currentPath.endsWith("/admin.html")) {
    if (!currentUser) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `login.html?returnTo=${returnTo}`;
      return;
    }

    if (!isAdminUser(currentUser)) {
      window.location.href = "account.html";
      return;
    }

    if (accountName) {
      accountName.textContent = "Admin";
    }
    loadAdminOrders();
  } else if (currentUser) {
    updateAdminEntries(isAdminUser(currentUser));
    if (currentPath.endsWith("/login.html") || currentPath.endsWith("/signup.html")) {
      window.location.href = getReturnToUrl();
      return;
    }
  } else {
    updateAdminEntries(false);
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



