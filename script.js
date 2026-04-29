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
const accountDetail = document.querySelector("[data-account-detail]");
const accountDetailEmpty = document.querySelector("[data-account-detail-empty]");
const adminOrders = document.querySelector("[data-admin-orders]");
const adminEntries = document.querySelectorAll("[data-admin-entry]");
const adminStats = document.querySelector("[data-admin-stats]");
const adminSearch = document.querySelector("[data-admin-search]");
const adminFilter = document.querySelector("[data-admin-filter]");
const adminPaymentFilter = document.querySelector("[data-admin-payment-filter]");
const adminDateFilter = document.querySelector("[data-admin-date-filter]");
const adminDetail = document.querySelector("[data-admin-detail]");
const adminDetailEmpty = document.querySelector("[data-admin-detail-empty]");
const adminNotePanel = document.querySelector("[data-admin-note-panel]");
const adminNoteField = document.querySelector("[data-admin-note]");
const adminNoteSaveButton = document.querySelector("[data-admin-note-save]");
const conversationThread = document.querySelector("[data-conversation-thread]");
const conversationForm = document.querySelector("[data-conversation-form]");
const conversationEmpty = document.querySelector("[data-conversation-empty]");
const conversationActions = document.querySelector("[data-conversation-actions]");
const markReadButton = document.querySelector("[data-mark-read]");
const logoutButton = document.querySelector("[data-logout]");
const sortModes = ["price-asc", "price-desc", "name-asc", "name-desc"];
const adminEmails = new Set([
  "yishiroof@gmail.com",
  "hichem.hichem041107@gmail.com",
]);
let activeConversationOrderId = "";
let activeConversationMode = "";
let activeConversationUnread = 0;
let currentAccountOrders = [];
let currentAdminOrders = [];
let currentAuthenticatedUser = null;
let ordersPollTimer = null;
let audioUnlocked = false;
let isConversationLoading = false;
let lastUnreadSnapshot = {
  buyer: 0,
  admin: 0,
};
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
  adminEmails.has(String(user?.email || "").trim().toLowerCase());

const isPendingOrderExpired = (order) => {
  if (order?.status !== "pending_payment" || !order?.created_at) {
    return false;
  }

  const createdAt = new Date(order.created_at).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt > 10 * 60 * 1000;
};

const getOrderStatusLabel = (status) => {
  if (status === "paid") {
    return "A faire";
  }

  if (status === "delivered") {
    return "Termine";
  }

  if (status === "processing") {
    return "En cours";
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

const getUnreadCount = (order, mode) =>
  mode === "admin"
    ? Number(order?.unread_for_admin || 0)
    : Number(order?.unread_for_buyer || 0);

const renderUnreadBadge = (count) =>
  count > 0 ? `<span class="message-badge">${count} nouveau${count > 1 ? "x" : ""}</span>` : "";

const formatFileSize = (size) => {
  const value = Number(size || 0);
  if (!value) {
    return "";
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} Mo`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} Ko`;
  }

  return `${value} o`;
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const parts = result.split(",");
      resolve(parts[1] || "");
    };
    reader.onerror = () => reject(new Error("Impossible de lire la piece jointe."));
    reader.readAsDataURL(file);
  });

const updateAdminEntries = (isAdmin) => {
  adminEntries.forEach((entry) => {
    entry.hidden = !isAdmin;
  });
};

const getUnreadTotal = (orders = [], mode) =>
  orders.reduce((total, order) => total + getUnreadCount(order, mode), 0);

const ensureNoticeStack = () => {
  let stack = document.querySelector("[data-live-notices]");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "live-notice-stack";
    stack.dataset.liveNotices = "true";
    document.body.appendChild(stack);
  }

  return stack;
};

const playNotificationTone = () => {
  if (!audioUnlocked || typeof window.AudioContext === "undefined") {
    return;
  }

  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.02;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
};

const showLiveNotice = (message) => {
  if (!message) {
    return;
  }

  const stack = ensureNoticeStack();
  const notice = document.createElement("article");
  notice.className = "live-notice";
  notice.innerHTML = `<strong>Nouveau message</strong><span>${message}</span>`;
  stack.appendChild(notice);
  playNotificationTone();

  const previousTitle = document.title;
  document.title = `• ${previousTitle}`;
  window.setTimeout(() => {
    if (document.title.startsWith("• ")) {
      document.title = previousTitle;
    }
  }, 2800);

  window.setTimeout(() => {
    notice.remove();
  }, 4800);
};

const unlockNotificationSound = () => {
  audioUnlocked = true;
  document.removeEventListener("pointerdown", unlockNotificationSound);
  document.removeEventListener("keydown", unlockNotificationSound);
};

document.addEventListener("pointerdown", unlockNotificationSound, { once: true });
document.addEventListener("keydown", unlockNotificationSound, { once: true });

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
    renderAccountDetail(null);
    return;
  }

  if (!orders.length) {
    const emptyCard = document.createElement("article");
    emptyCard.className = "account-order";
    emptyCard.innerHTML =
      "<strong>Aucune commande pour le moment</strong><span>Ton historique apparaitra ici apres tes premiers achats.</span>";
    accountOrders.appendChild(emptyCard);
    renderAccountDetail(null);
    return;
  }

  currentAccountOrders.forEach((order) => {
    const unreadCount = getUnreadCount(order, "buyer");
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
      ${unreadCount > 0 ? `<div class="message-meta-row">${renderUnreadBadge(unreadCount)}</div>` : ""}
      <div class="account-actions">
        <button type="button" class="button button-secondary" data-open-detail="${order.id}">Voir le detail</button>
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
    renderAdminDetail(null);
    return;
  }

  if (!orders.length) {
    const card = document.createElement("article");
    card.className = "account-order";
    card.innerHTML = "<strong>Aucune commande active pour le moment</strong>";
    adminOrders.appendChild(card);
    renderAdminDetail(null);
    return;
  }

  orders.forEach((order) => {
    const unreadCount = getUnreadCount(order, "admin");
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
      <div class="message-meta-row">
        ${renderUnreadBadge(unreadCount)}
        ${order.last_message_preview ? `<span class="message-preview">${order.last_message_preview}</span>` : ""}
      </div>
      <div class="admin-order-controls">
        <select data-admin-status="${order.id}">
          <option value="paid"${order.status === "paid" ? " selected" : ""}>A faire</option>
          <option value="processing"${order.status === "processing" ? " selected" : ""}>En cours</option>
          <option value="delivered"${order.status === "delivered" ? " selected" : ""}>Terminee</option>
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
  const pendingCount = orders.filter(
    (order) => order.status === "pending_payment"
  ).length;
  const unreadCount = getUnreadTotal(orders, "admin");
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_price || 0),
    0
  );
  const todayRevenue = orders.reduce((sum, order) => {
    const orderDate = new Date(order.created_at || "");
    const today = new Date();
    const isToday =
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();
    return isToday ? sum + Number(order.total_price || 0) : sum;
  }, 0);

  adminStats.innerHTML = `
    <article class="admin-stat-card">
      <span>Total commandes</span>
      <strong>${orders.length}</strong>
    </article>
    <article class="admin-stat-card">
      <span>A faire</span>
      <strong>${paidCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>En cours</span>
      <strong>${processingCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Terminees</span>
      <strong>${deliveredCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>En attente paiement</span>
      <strong>${pendingCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Non lus</span>
      <strong>${unreadCount}</strong>
    </article>
    <article class="admin-stat-card">
      <span>CA total</span>
      <strong>${formatPrice(totalRevenue)}</strong>
    </article>
    <article class="admin-stat-card">
      <span>CA du jour</span>
      <strong>${formatPrice(todayRevenue)}</strong>
    </article>
  `;
};

const renderAdminDetail = (order) => {
  if (!adminDetail || !adminDetailEmpty) {
    return;
  }

  if (!order) {
    adminDetail.hidden = true;
    adminDetail.innerHTML = "";
    adminDetailEmpty.hidden = false;
    if (adminNotePanel) {
      adminNotePanel.hidden = true;
    }
    return;
  }

  adminDetailEmpty.hidden = true;
  adminDetail.hidden = false;
  if (adminNotePanel) {
    adminNotePanel.hidden = false;
  }
  if (adminNoteField) {
    adminNoteField.value = order.admin_note || "";
    adminNoteField.dataset.orderId = order.id || "";
  }
  adminDetail.innerHTML = `
    <div class="admin-detail-item">
      <span>Produit</span>
      <strong>${order.product_title}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Commande</span>
      <strong>#${String(order.id || "").slice(0, 8)}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Client</span>
      <strong>${order.user_email || "Client inconnu"}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Categorie</span>
      <strong>${order.product_category || "-"}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Quantite</span>
      <strong>${order.quantity}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Paiement</span>
      <strong>${getPaymentMethodLabel(order.payment_method)}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Total</span>
      <strong>${formatPrice(Number(order.total_price || 0))}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Statut</span>
      <strong>${getOrderStatusLabel(order.status)}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Dernier message</span>
      <strong>${order.last_message_preview || "Aucun message"}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Messages non lus</span>
      <strong>${getUnreadCount(order, "admin")}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Derniere activite</span>
      <strong>${order.last_message_at ? formatOrderDate(order.last_message_at) : "Aucune"}</strong>
    </div>
    <div class="admin-detail-item">
      <span>Date</span>
      <strong>${formatOrderDate(order.created_at)}</strong>
    </div>
  `;
};

const renderAccountDetail = (order) => {
  if (!accountDetail || !accountDetailEmpty) {
    return;
  }

  if (!order) {
    accountDetail.hidden = true;
    accountDetail.innerHTML = "";
    accountDetailEmpty.hidden = false;
    return;
  }

  accountDetailEmpty.hidden = true;
  accountDetail.hidden = false;
  accountDetail.innerHTML = `
    <div class="account-detail-item">
      <span>Produit</span>
      <strong>${order.product_title}</strong>
    </div>
    <div class="account-detail-item">
      <span>Commande</span>
      <strong>#${String(order.id || "").slice(0, 8)}</strong>
    </div>
    <div class="account-detail-item">
      <span>Categorie</span>
      <strong>${order.product_category || "-"}</strong>
    </div>
    <div class="account-detail-item">
      <span>Prix unitaire</span>
      <strong>${formatPrice(Number(order.unit_price || 0))}</strong>
    </div>
    <div class="account-detail-item">
      <span>Quantite</span>
      <strong>${order.quantity}</strong>
    </div>
    <div class="account-detail-item">
      <span>Total</span>
      <strong>${formatPrice(Number(order.total_price || 0))}</strong>
    </div>
    <div class="account-detail-item">
      <span>Paiement</span>
      <strong>${getPaymentMethodLabel(order.payment_method)}</strong>
    </div>
    <div class="account-detail-item">
      <span>Statut</span>
      <strong>${getOrderStatusLabel(order.status)}</strong>
    </div>
    <div class="account-detail-item">
      <span>Dernier message</span>
      <strong>${order.last_message_preview || "Aucun message"}</strong>
    </div>
    <div class="account-detail-item">
      <span>Date</span>
      <strong>${formatOrderDate(order.created_at)}</strong>
    </div>
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
      filterValue === "all"
        ? true
        : filterValue === "unread"
          ? getUnreadCount(order, "admin") > 0
          : String(order.status) === filterValue;
    const paymentValue = String(adminPaymentFilter?.value || "all");
    const dateValue = String(adminDateFilter?.value || "");
    const matchesPayment =
      paymentValue === "all" ? true : String(order.payment_method) === paymentValue;
    const orderDateIso = order.created_at
      ? new Date(order.created_at).toISOString().slice(0, 10)
      : "";
    const matchesDate = dateValue ? orderDateIso === dateValue : true;
    const haystack = [
      order.product_title,
      order.user_email,
      order.id,
      getOrderStatusLabel(order.status),
      getPaymentMethodLabel(order.payment_method),
      order.product_category,
      order.created_at,
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesStatus &&
      matchesPayment &&
      matchesDate &&
      (!searchValue || haystack.includes(searchValue))
    );
  });

  renderAdminOrders(filteredOrders);
  bindConversationButtons("admin");

  if (activeConversationOrderId) {
    const activeOrder =
      filteredOrders.find((order) => order.id === activeConversationOrderId) ||
      currentAdminOrders.find((order) => order.id === activeConversationOrderId) ||
      null;
    renderAdminDetail(activeOrder);
  }
};

const loadAccountOrders = async (user, notify = false) => {
  if (!supabaseClient || !accountOrders || !user) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("orders")
    .select(
      "id, product_title, product_category, unit_price, quantity, total_price, payment_method, status, created_at, unread_for_buyer, last_message_preview"
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

  const orders = data || [];
  renderOrders(orders);
  bindConversationButtons("buyer");
  if (notify) {
    maybeNotifyAboutUnread(orders, "buyer");
  } else {
    lastUnreadSnapshot.buyer = getUnreadTotal(orders, "buyer");
  }

  if (activeConversationMode === "buyer" && activeConversationOrderId) {
    const activeOrder = orders.find((order) => order.id === activeConversationOrderId);
    renderAccountDetail(activeOrder || null);
    activeConversationUnread = getUnreadCount(activeOrder, "buyer");
    if (markReadButton) {
      markReadButton.disabled = activeConversationUnread <= 0;
      markReadButton.textContent =
        activeConversationUnread > 0
          ? `Marquer comme lu (${activeConversationUnread})`
          : "Messages deja lus";
    }
  }
};

const loadAdminOrders = async (notify = false) => {
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

  const orders = result.orders || [];
  renderAdminOrders(orders);
  renderAdminStats(orders);
  bindConversationButtons("admin");
  if (notify) {
    maybeNotifyAboutUnread(orders, "admin");
  } else {
    lastUnreadSnapshot.admin = getUnreadTotal(orders, "admin");
  }

  if (activeConversationOrderId) {
    const activeOrder = orders.find(
      (order) => order.id === activeConversationOrderId
    );
    renderAdminDetail(activeOrder || null);
    activeConversationUnread = getUnreadCount(activeOrder, "admin");
    if (markReadButton) {
      markReadButton.disabled = activeConversationUnread <= 0;
      markReadButton.textContent =
        activeConversationUnread > 0
          ? `Marquer comme lu (${activeConversationUnread})`
          : "Messages deja lus";
    }
  }

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
      ${message.message ? `<p>${message.message}</p>` : ""}
      ${renderAttachmentMarkup(message)}
      <span>${formatOrderDate(message.created_at)}</span>
    `;
    conversationThread.appendChild(item);
  });

  conversationThread.scrollTop = conversationThread.scrollHeight;
};

const appendConversationMessage = (message) => {
  if (!conversationThread) {
    return;
  }

  const hasPlaceholder = conversationThread.querySelector(".message-bubble strong");
  if (
    hasPlaceholder &&
    conversationThread.children.length === 1 &&
    /Chargement|Aucun message/.test(conversationThread.textContent || "")
  ) {
    conversationThread.innerHTML = "";
  }

  const item = document.createElement("article");
  item.className = `message-bubble${message.author_role === "admin" ? " is-admin" : " is-buyer"}`;
  item.innerHTML = `
    <strong>${message.author_role === "admin" ? "Admin" : message.user_email || "Client"}</strong>
    ${message.message ? `<p>${message.message}</p>` : ""}
    ${renderAttachmentMarkup(message)}
    <span>${formatOrderDate(message.created_at)}</span>
  `;
  conversationThread.appendChild(item);
  conversationThread.scrollTop = conversationThread.scrollHeight;
};

const renderAttachmentMarkup = (message) => {
  if (!message?.attachment_url) {
    return "";
  }

  const fileName = message.attachment_name || "piece-jointe";
  const fileSize = formatFileSize(message.attachment_size);
  const isImage = String(message.attachment_type || "").startsWith("image/");

  return `
    <div class="attachment-card">
      ${
        isImage
          ? `<a href="${message.attachment_url}" target="_blank" rel="noreferrer"><img src="${message.attachment_url}" alt="${fileName}" /></a>`
          : ""
      }
      <a href="${message.attachment_url}" target="_blank" rel="noreferrer">
        ${fileName}${fileSize ? ` • ${fileSize}` : ""}
      </a>
    </div>
  `;
};

const loadConversation = async (orderId, mode, options = {}) => {
  if (!conversationThread || !conversationForm) {
    return;
  }

  if (isConversationLoading) {
    return;
  }

  const { silent = false } = options;

  activeConversationOrderId = orderId;
  activeConversationMode = mode;
  const sourceOrders = mode === "admin" ? currentAdminOrders : currentAccountOrders;
  const activeOrder = sourceOrders.find((order) => order.id === orderId) || null;
  activeConversationUnread = getUnreadCount(activeOrder, mode);

  if (mode === "admin") {
    renderAdminDetail(activeOrder);
  } else {
    renderAccountDetail(activeOrder);
  }

  if (conversationEmpty) {
    conversationEmpty.textContent = `Discussion ouverte pour la commande #${String(orderId).slice(0, 8)}.`;
  }

  if (conversationActions) {
    conversationActions.hidden = false;
  }
  if (markReadButton) {
    markReadButton.disabled = activeConversationUnread <= 0;
    markReadButton.textContent =
      activeConversationUnread > 0
        ? `Marquer comme lu (${activeConversationUnread})`
        : "Messages deja lus";
  }

  conversationThread.hidden = false;
  conversationForm.hidden = false;
  if (!silent) {
    conversationThread.innerHTML =
      '<article class="message-bubble"><strong>Chargement...</strong></article>';
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  isConversationLoading = true;

  try {
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
  } finally {
    isConversationLoading = false;
  }
};

const markConversationAsRead = async () => {
  if (!supabaseClient || !activeConversationOrderId || !activeConversationMode) {
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const response = await fetch("/api/messages/mark-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token || ""}`,
    },
    body: JSON.stringify({ orderId: activeConversationOrderId }),
  });

  if (!response.ok) {
    return;
  }

  activeConversationUnread = 0;
  if (markReadButton) {
    markReadButton.disabled = true;
    markReadButton.textContent = "Messages deja lus";
  }

  if (activeConversationMode === "admin") {
    await loadAdminOrders();
  } else {
    await loadAccountOrders(session?.user);
  }
};

const maybeNotifyAboutUnread = (orders, mode) => {
  const nextTotal = getUnreadTotal(orders, mode);
  const previousTotal = lastUnreadSnapshot[mode] || 0;

  if (nextTotal > previousTotal) {
    const delta = nextTotal - previousTotal;
    showLiveNotice(
      mode === "admin"
        ? `${delta} nouveau${delta > 1 ? "x" : ""} message${delta > 1 ? "s" : ""} client.`
        : `${delta} nouvelle${delta > 1 ? "s" : ""} reponse${delta > 1 ? "s" : ""} du shop.`
    );
  }

  lastUnreadSnapshot[mode] = nextTotal;
};

const stopOrdersPolling = () => {
  if (ordersPollTimer) {
    window.clearInterval(ordersPollTimer);
    ordersPollTimer = null;
  }
};

const startOrdersPolling = () => {
  stopOrdersPolling();

  if (!supabaseClient || !currentAuthenticatedUser) {
    return;
  }

  const isAdmin = isAdminUser(currentAuthenticatedUser);
  ordersPollTimer = window.setInterval(async () => {
    if (document.hidden) {
      return;
    }

    if (isAdmin) {
      await loadAdminOrders(true);
    } else {
      await loadAccountOrders(currentAuthenticatedUser, true);
    }

    if (activeConversationOrderId && activeConversationMode) {
      await loadConversation(activeConversationOrderId, activeConversationMode, {
        silent: true,
      });
    }
  }, 20000);
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

  document.querySelectorAll("[data-open-detail]").forEach((button) => {
    if (button.dataset.bound === "true") {
      return;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const orderId = button.dataset.openDetail;
      const order = currentAccountOrders.find((item) => item.id === orderId) || null;
      renderAccountDetail(order);
    });
  });
};

const bindConversationForm = () => {
  if (!conversationForm) {
    return;
  }

  const messageField = conversationForm.querySelector('textarea[name="message"]');
  const attachmentField = conversationForm.querySelector('input[name="attachment"]');

  if (messageField && !messageField.dataset.enterBound) {
    messageField.dataset.enterBound = "true";
    messageField.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }

      event.preventDefault();

      const submitButton = conversationForm.querySelector('button[type="submit"]');
      if (submitButton && !submitButton.disabled) {
        submitButton.click();
      }
    });
  }

  conversationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeConversationOrderId) {
      return;
    }

    const formData = new FormData(conversationForm);
    const message = String(formData.get("message") || "").trim();
    const attachmentFile = attachmentField?.files?.[0] || null;

    if (!message && !attachmentFile) {
      return;
    }

    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    let attachmentPayload = null;

    if (attachmentFile) {
      const fileData = await fileToBase64(attachmentFile);
      const uploadResponse = await fetch("/api/messages/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          orderId: activeConversationOrderId,
          fileName: attachmentFile.name,
          fileType: attachmentFile.type,
          fileData,
        }),
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        return;
      }

      attachmentPayload = uploadResult.attachment || null;
    }

    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({
        orderId: activeConversationOrderId,
        message,
        attachmentUrl: attachmentPayload?.url || "",
        attachmentName: attachmentPayload?.name || "",
        attachmentType: attachmentPayload?.type || "",
        attachmentSize: attachmentPayload?.size || 0,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return;
    }

    const optimisticMessage = {
      author_role: activeConversationMode === "admin" ? "admin" : "buyer",
      user_email: session?.user?.email || "",
      message,
      attachment_url: attachmentPayload?.url || "",
      attachment_name: attachmentPayload?.name || "",
      attachment_type: attachmentPayload?.type || "",
      attachment_size: attachmentPayload?.size || 0,
      created_at: new Date().toISOString(),
    };

    conversationForm.reset();
    appendConversationMessage(optimisticMessage);
    if (activeConversationMode === "admin") {
      loadAdminOrders();
    } else {
      loadAccountOrders(session?.user);
    }
  });
};

if (markReadButton) {
  markReadButton.addEventListener("click", async () => {
    if (!activeConversationOrderId || activeConversationUnread <= 0) {
      return;
    }

    markReadButton.disabled = true;
    await markConversationAsRead();
    markReadButton.disabled = false;
  });
}

if (adminNoteSaveButton && adminNoteField) {
  adminNoteSaveButton.addEventListener("click", async () => {
    const orderId = adminNoteField.dataset.orderId || "";
    if (!orderId || !supabaseClient) {
      return;
    }

    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    adminNoteSaveButton.disabled = true;
    adminNoteSaveButton.textContent = "Sauvegarde...";

    const response = await fetch("/api/orders/update-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({
        orderId,
        adminNote: adminNoteField.value,
      }),
    });

    adminNoteSaveButton.disabled = false;
    adminNoteSaveButton.textContent = "Sauvegarder la note";

    if (!response.ok) {
      return;
    }

    await loadAdminOrders();
  });
}

if (adminSearch) {
  adminSearch.addEventListener("input", applyAdminFilters);
}

if (adminFilter) {
  adminFilter.addEventListener("change", applyAdminFilters);
}

if (adminPaymentFilter) {
  adminPaymentFilter.addEventListener("change", applyAdminFilters);
}

if (adminDateFilter) {
  adminDateFilter.addEventListener("change", applyAdminFilters);
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
  params.set("v", "t3ch-19");
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
      nextParams.set("v", "t3ch-19");
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
      `category.html?category=${encodeURIComponent(category)}&v=t3ch-19`
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
    checkoutFeedback.style.color = "";
    checkoutFeedback.dataset.state = isError ? "error" : "default";
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
  feedback.style.color = "";
  feedback.dataset.state = isError ? "error" : "success";
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
    currentAuthenticatedUser = user;
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

        stopOrdersPolling();
        window.location.href = "login.html";
      });
    }

    loadAccountOrders(user);
    if (isAdmin) {
      loadAdminOrders();
    }
    startOrdersPolling();

    return;
  }

  currentAuthenticatedUser = null;
  stopOrdersPolling();

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
    currentAuthenticatedUser = currentUser;
    loadAdminOrders();
    startOrdersPolling();
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



