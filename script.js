const thumbnails = document.querySelectorAll(".thumbnail");
const mainImage = document.getElementById("mainImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageTitle = document.getElementById("imageTitle");

let currentIndex = 0;
let isAutoplaying = false;
let autoplayInterval;
let previousThumbnails; // Store the previous set of thumbnails
let isNextButtonDisabled = false; // Track if the next button is disabled

// Define an array of initial image sources for the thumbnails
const allImages = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg",
  "images/7.jpg",
  "images/8.jpg",
  "images/9.jpg",
  "images/10.jpg",
  "images/11.jpg",
  "images/12.jpg",
];
const titres = [
  "welcome 1",
  "turkia 2",
  "hello 3",
  "green 4",
  "hi 5",
  "paris 6",
  "mer 7",
  "moon 8",
  "salut 9",
  "hello 10",
  "salut 11",
  "bye 12",
];

// Set the initial thumbnails' src attributes and add event listeners
thumbnails.forEach((thumbnail, index) => {
  thumbnail.src = allImages[index];
  thumbnail.dataset.title = titres[index];
  thumbnail.addEventListener("click", () => {
    currentIndex = index; // Set currentIndex to the index of the clicked thumbnail
    displayMainImage(thumbnail.src, thumbnail.dataset.title); // Display the clicked image and corresponding title
  });
});

function toggleToolbar() {
  const toolbar = document.getElementById("toolbar");
  const barreButtonIcon = document.querySelector(".barre i.fa");

  if (toolbar.style.display === "none") {
    toolbar.style.display = "block";
    barreButtonIcon.classList.remove("fa-arrow-right");
    barreButtonIcon.classList.add("fa-arrow-down");
  } else {
    toolbar.style.display = "none";
    barreButtonIcon.classList.remove("fa-arrow-down");
    barreButtonIcon.classList.add("fa-arrow-right");
  }

  const thumbnails = document.querySelector(".thumbnails");
  thumbnails.style.display =
    thumbnails.style.display === "none" ? "flex" : "none";

  prevBtn.style.display = prevBtn.style.display === "none" ? "block" : "none";
  nextBtn.style.display = nextBtn.style.display === "none" ? "block" : "none";
}

function prevImage() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = allImages.length - 1; // Return to the first image
  }
  displayMainImage(allImages[currentIndex], titres[currentIndex]);
  updateThumbnailsPage();
}

function nextImage() {
  if (currentIndex < allImages.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Return to the first image
  }
  displayMainImage(allImages[currentIndex], titres[currentIndex]);
  updateThumbnailsPage();
}

function toggleAutoplay() {
  if (isAutoplaying) {
    clearInterval(autoplayInterval);
  } else {
    autoplayInterval = setInterval(() => {
      nextImage();
    }, 2000); // Change slide every 2 seconds
  }
  isAutoplaying = !isAutoplaying;
}

let randomImageInterval = null; // Variable to store the interval reference

function switchToRandomImage() {
  if (!randomImageInterval) {
    // If random image switching is not already running
    const randomAutoplay = () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allImages.length);
        if (randomIndex === allImages.length-1){
          break;
        }
      } while (randomIndex <= currentIndex );
      currentIndex = randomIndex;
      displayMainImage(allImages[currentIndex], titres[currentIndex]);
      updateThumbnailsPage();
    };
    randomImageInterval = setInterval(randomAutoplay, 2000); // Start random image switching
  } else {
    // If random image switching is already running, stop it
    clearInterval(randomImageInterval);
    randomImageInterval = null;
  }
}

// Function to update all thumbnails with new images
function updateThumbnailsPage() {
  const startIndex =
    Math.floor(currentIndex / thumbnails.length) * thumbnails.length;
  thumbnails.forEach((thumbnail, index) => {
    const imageIndex = startIndex + index;
    if (imageIndex < allImages.length) {
      thumbnail.src = allImages[imageIndex];
      thumbnail.dataset.title = titres[imageIndex];
      thumbnail.style.display = "inline"; // Ensure thumbnail is visible
    } else {
      thumbnail.style.display = "none"; // Hide unused thumbnails
    }
  });
  nextBtn.disabled = startIndex + thumbnails.length >= allImages.length;
}

function prevPage() {
  currentIndex -= thumbnails.length;
  if (currentIndex < 0) {
    currentIndex = 0; // Reset index to avoid going beyond the start
  }
  updateThumbnailsPage();
}

function nextPage() {
  currentIndex += thumbnails.length;
  if (currentIndex >= allImages.length) {
    currentIndex = allImages.length - 1; // Reset index to avoid going beyond the end
  }
  updateThumbnailsPage();
}

// Event listener for previous button
prevBtn.addEventListener("click", prevPage);

// Event listener for next button
nextBtn.addEventListener("click", nextPage);

// Function to display main image
function displayMainImage(src, title) {
  mainImage.src = src;
  currentIndex = allImages.indexOf(src); // Update currentIndex based on the displayed image
  imageTitle.textContent = title; // Update the text content to the corresponding title
  mainImage.animate(
    [
      { transform: "translateY(300%)" }, // Start from above the viewport
      { transform: "translateY(0%)" }, // End at its natural position
    ],
    {
      duration: 500, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing function
      fill: "forwards", // Keep the final state after the animation finishes
    }
  );
}

console.log(currentIndex);
console.log(previousThumbnails);

// Add keydown event listener to handle space bar, left, and right arrow keys
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    toggleAutoplay();
    event.preventDefault(); // Prevent default space bar action
  } else if (event.code === "ArrowRight") {
    nextImage();
    event.preventDefault(); // Prevent default right arrow action
  } else if (event.code === "ArrowLeft") {
    prevImage();
    event.preventDefault(); // Prevent default left arrow action
  }
});

// Initialize the first page of thumbnails
updateThumbnailsPage();
