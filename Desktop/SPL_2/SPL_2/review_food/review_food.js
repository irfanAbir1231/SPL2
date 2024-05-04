function handleClick(event) {
    // Get the parent element
    const parent = event.target.parentElement;

    // Get all the stars in the parent element
    const stars = parent.querySelectorAll('.fa-star');

    // Get the index of the clicked star
    const index = Array.from(stars).indexOf(event.target);

    // Update the stars
    stars.forEach((star, i) => {
        if (i <= index) {
            // This star and all the stars before it should be checked
            star.classList.add('checked');
        } else {
            // This star and all the stars after it should be unchecked
            star.classList.remove('checked');
        }
    });
}

// Get all the stars
const stars = document.querySelectorAll('.fa-star');

// Add the event listener to each star
stars.forEach(star => {
    star.addEventListener('click', handleClick);
});