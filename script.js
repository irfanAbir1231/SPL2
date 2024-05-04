// Function to add selected category as a rounded box
function addSelectedCategory(category) {
    const selectedCategoriesContainer = document.getElementById('selectedCategoriesContainer');
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('selectedCategory');
    categoryElement.innerHTML = `
        <span>${category}</span>
        <span onclick="removeSelectedCategory('${category}')">&#10006;</span>
    `;
    selectedCategoriesContainer.appendChild(categoryElement);
}

// Function to remove selected category
function removeSelectedCategory(category) {
    const selectedCategoriesContainer = document.getElementById('selectedCategoriesContainer');
    const categoryElement = document.querySelector(`.selectedCategory span:first-of-type[innerText="${category}"]`).parentNode;
    selectedCategoriesContainer.removeChild(categoryElement);
}

// Event listener for form submission
document.getElementById('complaintForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const selectedCategories = [...document.getElementById('category').selectedOptions].map(option => option.value);
    const complaint = document.getElementById('complaint').value;

    if (selectedCategories.length === 0) {
        alert('Please select at least one category.');
        return;
    }

    if (!complaint.trim()) {
        alert('Please enter your complaint.');
        return;
    }

    // Perform further actions (e.g., submit complaint)
    console.log('Selected Categories:', selectedCategories);
    console.log('Complaint:', complaint);

    // Clear form fields after submission (optional)
    document.getElementById('complaint').value = '';
    document.getElementById('category').selectedIndex = -1;
});

// Event listener for requesting a new category
document.getElementById('requestCategoryBtn').addEventListener('click', function() {
    const newCategory = document.getElementById('newCategory').value.trim();

    if (!newCategory) {
        alert('Please enter a category name.');
        return;
    }

    // Perform further actions (e.g., submit category request)
    console.log('Requested Category:', newCategory);

    // Clear input field after request (optional)
    document.getElementById('newCategory').value = '';

    // Add the new category to the selected categories container
    addSelectedCategory(newCategory);
});
