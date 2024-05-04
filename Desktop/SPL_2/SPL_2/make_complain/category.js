// Sample categories array (replace with actual categories)
const categories = ['Electricity', 'Cleanliness', 'Maintenance', 'Security', 'Noise', 'Food'];

// Array to store selected categories
let selectedCategories = [];

// Function to display categories
function displayCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = '';
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'categories';
        checkbox.value = category;
        // Check if category is selected
        if (selectedCategories.includes(category)) {
            checkbox.checked = true;
        }
        const label = document.createElement('label');
        label.textContent = category;
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        categoriesContainer.appendChild(div);
    });
}

// Function to search categories
function searchCategories() {
    const searchInput = document.getElementById('searchCategories').value.toLowerCase();
    const filteredCategories = categories.filter(category => category.toLowerCase().includes(searchInput));
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = '';
    filteredCategories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'categories';
        checkbox.value = category;
        // Check if category is selected
        if (selectedCategories.includes(category)) {
            checkbox.checked = true;
        }
        const label = document.createElement('label');
        label.textContent = category;
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        categoriesContainer.appendChild(div);
    });
}

// Function to handle checkbox change
function handleCheckboxChange(checkbox) {
    if (checkbox.checked) {
        selectedCategories.push(checkbox.value);
    } else {
        selectedCategories = selectedCategories.filter(category => category !== checkbox.value);
    }
}

// Function to submit selected categories
function submitCategories() {
    if (selectedCategories.length === 0) {
        alert('Complain Submitted');
        return;
    }
    const complaint = localStorage.getItem('complaint');
    localStorage.removeItem('complaint');
    console.log('Complaint:', complaint);
    console.log('Selected Categories:', selectedCategories);
    // Optionally, perform further actions (e.g., submit complaint and selected categories)
}

window.onload = displayCategories;
