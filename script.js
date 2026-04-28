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
      nextParams.set("v", "t3ch-3");
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
