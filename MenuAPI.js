// Your global variables
let iconCartSpan = document.querySelector('.cart-subscript');
const menuContainer = document.querySelector('.menu-container');

let categories = [
    "lamb", "goat", "beef", "pork", "side", "pasta", "vegan",
    "starter", "dessert", "chicken", "seafood", "breakfast",
    "vegetarian", "miscellaneous",

];

// Generate categories categories on page load
function renderPillsAndTabs() {
    let pillsDiv = document.getElementById("v-pills-tab");
    let tabsDiv = document.getElementById("pills-tabContent");
    if (categories.length === 0) {
        menuContainer.innerHTML = `MENU WILL BE UPDATED SOON`;
        return;
    }
    // Reset innerHTML
    pillsDiv.innerHTML = "";
    tabsDiv.innerHTML = "";

    // First category
    const firstCategory = categories[0];
    pillsDiv.innerHTML += `<button class="nav-link active" id="v-pills-${firstCategory}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${firstCategory}" type="button" role="tab" aria-controls="v-pills-${firstCategory}" aria-selected="true">${firstCategory}</button>`;
    tabsDiv.innerHTML += `<div class="tab-pane fade show active" id="v-pills-${firstCategory}" role="tabpanel" aria-labelledby="v-pills-${firstCategory}-tab"></div>`;

    // Loop for remaining categories
    for (let i = 1; i < categories.length; i++) {
        const category = categories[i];
        pillsDiv.innerHTML += `<button class="nav-link" id="v-pills-${category}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${category}" type="button" role="tab" aria-controls="v-pills-${category}" aria-selected="false">${category}</button>`;
        tabsDiv.innerHTML += `<div class="tab-pane fade" id="v-pills-${category}" role="tabpanel" aria-labelledby="v-pills-${category}-tab"></div>`;
    }
}
renderPillsAndTabs();

// API to get meals for categories
async function getMealsByCategory(category) {
    if (category.toLowerCase() === "chinese") {
        return [
            { strMeal: "Kung Pao Chicken", strMealThumb: "../Images/chinesefood/image.png", idMeal: "c1" },
            { strMeal: "Mapo Tofu", strMealThumb: "../Images/chinesefood/download (3).jpeg", idMeal: "c2" },
            { strMeal: "Dim Sum", strMealThumb: "../Images/chinesefood/download (4).jpeg", idMeal: "c3" },
            { strMeal: "Peking Duck", strMealThumb: "../Images/chinesefood/download (5).jpeg", idMeal: "c4" },
            { strMeal: "Hot and Sour Soup", strMealThumb: "../Images/chinesefood/download (6).jpeg", idMeal: "c5" },
            { strMeal: "Spring Rolls", strMealThumb: "../Images/chinesefood/download (7).jpeg", idMeal: "c6" }
        ];
    } else {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.meals || [];
    }
}

// Create meal objects with random prices
async function getMealDataByCategory(category) {
    const meals = await getMealsByCategory(category);
    if (!meals || meals.length === 0) {
        // fallback
        return Array.from({ length: 6 }).map((_, i) => ({
            name: `${category} Dish ${i + 1}`,
            imgSrc: "../Images/readmeImages/menupage.png",
            id: `${category}_sample_${i + 1}`,
            price: (100 + i * 20)
        }));
    }
    return meals.map(meal => ({
        name: meal.strMeal,
        imgSrc: meal.strMealThumb,
        id: meal.idMeal,
        price: (Math.floor(Math.random() * 270) + 80)
    }));
}

// Render meal cards with black text
function renderMeals(mealData) {
    return mealData.map(meal => `
        <div class="col-sm-6 col-xl-4 item">
            <div class="card">
                <div class="card-thumbnail">
                    <div class="black-overlay">
                        <img src="${meal.imgSrc}" alt="${meal.name}" class="card-img-top" />
                    </div>
                    <button class="btn btn-warning add-to-cart-button"
                        data-product-id="${meal.id}"
                        data-product-name="${meal.name}"
                        data-product-price="${meal.price}"
                        data-product-img-source="${meal.imgSrc}">
                        + Add to Cart
                    </button>
                </div>
                <div class="card-body">
                    <h3 style="color: black;">${meal.name}</h3>
                    <p class="meal-price" style="color: black;">₹${meal.price}</p>
                    <div class="star-rating">
                        <button class="star-button" onclick="rateItem(this, 1)"><i class="fas fa-star"></i></button>
                        <button class="star-button" onclick="rateItem(this, 2)"><i class="fas fa-star"></i></button>
                        <button class="star-button" onclick="rateItem(this, 3)"><i class="fas fa-star"></i></button>
                        <button class="star-button" onclick="rateItem(this, 4)"><i class="fas fa-star"></i></button>
                        <button class="star-button" onclick="rateItem(this, 5)"><i class="fas fa-star"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

// Load meals into tabs with pagination
async function loadCategoryPage(curpage, category) {
    const allMeals = await getMealDataByCategory(category);
    const pagedMeals = allMeals.slice((curpage - 1) * 6, curpage * 6);
    const html = `<div class="row g-4">${renderMeals(pagedMeals)}</div>` + createPagination(curpage, allMeals, category);
    const pane = document.getElementById(`v-pills-${category}`);
    if (pane) {
        pane.innerHTML = html;
    }
}

// Create pagination navigation
function createPagination(curpage, allMeals, category) {
    const totalPages = Math.ceil(allMeals.length / 6);
    let nav = `<nav><ul class="pagination justify-content-center">`;
    // Previous button
    if (curpage > 1) {
        nav += `<li><button class="btn btn-primary prev" aria-label="Previous" onclick="loadCategoryPage(${curpage - 1}, '${category}')"><i class="fas fa-angle-left"></i></button></li>`;
    } else {
        nav += `<li><button class="btn btn-primary prev" aria-label="Previous" disabled><i class="fas fa-angle-left"></i></button></li>`;
    }
    // Page numbers
    for (let p = 1; p <= totalPages; p++) {
        if (p === curpage) {
            nav += `<li><button class="btn active" onclick="loadCategoryPage(${p}, '${category}')">${p}</button></li>`;
        } else {
            nav += `<li><button class="btn" onclick="loadCategoryPage(${p}, '${category}')">${p}</button></li>`;
        }
    }
    // Next button
    if (curpage < totalPages) {
        nav += `<li><button class="btn btn-primary next" aria-label="Next" onclick="loadCategoryPage(${curpage + 1}, '${category}')"><i class="fas fa-angle-right"></i></button></li>`;
    } else {
        nav += `<li><button class="btn btn-primary next" aria-label="Next" disabled><i class="fas fa-angle-right"></i></button></li>`;
    }
    nav += `</ul></nav>`;
    return nav;
}

// Initialize all categories
async function initialize() {
    renderPillsAndTabs();
    for (const category of categories) {
        await loadCategoryPage(1, category);
    }
}
initialize();

// Cart functionality
function getCartItems() {
    const items = localStorage.getItem("cartItems");
    return items ? JSON.parse(items) : [];
}

function setCartItems(items) {
    localStorage.setItem("cartItems", JSON.stringify(items));
}

// Add to cart event handler
function setupCart() {
    document.querySelector('.menu-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-button')) {
            const name = e.target.dataset.productName;
            const imgSrc = e.target.dataset.productImgSource;
            const price = e.target.dataset.productPrice;

            const cart = getCartItems();
            const item = cart.find(it => it.name === name);
            if (item) {
                item.quantity += 1;
            } else {
                cart.push({ name, imgSrc, quantity: 1, price });
            }
            setCartItems(cart);
            // Update cart count
            const totalCount = cart.reduce((sum, it) => sum + it.quantity, 0);
            iconCartSpan.innerText = totalCount;
        const existingCartItem = cartItems.find(item => item.id === clickedElement.dataset.productId);
}
    });
}
setupCart();
