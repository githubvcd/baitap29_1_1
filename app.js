let allProducts = [];
let filteredProducts = [];

// Load data from JSON file
async function loadProducts() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Hide loading message
        document.getElementById('loading').style.display = 'none';
        
        // Populate category filter
        populateCategoryFilter();
        
        // Display products
        displayProducts();
        
        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        document.getElementById('loading').style.display = 'none';
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = `Lỗi tải sản phẩm: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}

// Populate category dropdown
function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category.name))];
    const select = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Set up event listeners for filters
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('minPrice').addEventListener('input', filterProducts);
    document.getElementById('maxPrice').addEventListener('input', filterProducts);
}

// Filter products based on search and category
function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchText) ||
                            product.description.toLowerCase().includes(searchText);
        const matchesCategory = category === '' || product.category.name === category;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts();
}

// Display products
function displayProducts() {
    const productsList = document.getElementById('productsList');
    const noResults = document.getElementById('noResults');
    const stats = document.getElementById('stats');

    // Update stats
    const totalProducts = allProducts.length;
    const displayedProducts = filteredProducts.length;
    stats.textContent = `Hiển thị ${displayedProducts} trong ${totalProducts} sản phẩm`;

    if (filteredProducts.length === 0) {
        productsList.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    productsList.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openModal(${product.id})">
            <img src="${product.images[0]}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/280x200?text=Không+có+hình'">
            <div class="product-info">
                <div class="product-category">${product.category.name}</div>
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-date">${new Date(product.creationAt).toLocaleDateString('vi-VN')}</div>
            </div>
        </div>
    `).join('');
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    filteredProducts = [...allProducts];
    displayProducts();
}

// Open modal with product details
function openModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').src = product.images[0];
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = `$${product.price}`;
    document.getElementById('modalCategory').textContent = product.category.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalDate').textContent = `Tạo lúc: ${new Date(product.creationAt).toLocaleDateString('vi-VN')}`;

    document.getElementById('productModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Load products when page loads
window.addEventListener('DOMContentLoaded', loadProducts);
