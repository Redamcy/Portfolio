const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const sections = document.querySelectorAll('section');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

const activePage = () => {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    sections.forEach(section => {
        section.classList.remove('active');
    });

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('active')) {
            activePage();

            link.classList.add('active');
            sections[idx].classList.add('active');
        }
    });
});

logoLink.addEventListener('click', () => {
    if (!navLinks[0].classList.contains('active')) {
        activePage();

        navLinks[0].classList.add('active');
        sections[0].classList.add('active');
    }
});

const resumeBtns = document.querySelectorAll('.resume-btn');

resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        resumeBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        btn.classList.add('active');

        resumeDetails.forEach(detail => {
            detail.classList.remove('active');
        });

        resumeDetails[idx].classList.add('active');
    });
});

/*-----------------MIXITUP FILTER------------------*/
let mixerPortfolio = mixitup('.work__container', {
    selectors: {
        target: '.work__card'
    },
    animation: {
        duration: 300
    }
});

/*-----------Link Active Work--------------------*/
const linkWork = document.querySelectorAll('.work__item');

function activeWork() {
    linkWork.forEach(l => l.classList.remove('active-work'));
    this.classList.add('active-work');
}

linkWork.forEach(L => L.addEventListener("click", activeWork));

/*--------Work Popup------------*/
/*--------Work Popup------------*/
document.addEventListener("click", (e) => {
    const workCard = e.target.closest(".work__card");

    if (workCard) {
        togglePortfolioPopup();
        portfolioItemDetails(workCard);
    }
});

function togglePortfolioPopup() {
    document.querySelector(".portfolio__popup").classList.toggle("open");
}

document.querySelector(".portfolio__popup-close").addEventListener("click", togglePortfolioPopup);

document.querySelector(".portfolio__popup").addEventListener("click", (e) => {
    if (e.target.classList.contains("portfolio__popup")) {
        togglePortfolioPopup();
    }
});

document.addEventListener("keydown", (e) => {
    const portfolioPopup = document.querySelector(".portfolio__popup");

    if (e.key === "Escape" && portfolioPopup.classList.contains("open")) {
        togglePortfolioPopup();
    }
});

function portfolioItemDetails(portfolioItem) {
    const popupImage = document.querySelector(".pp__thumbnail img");
    const workImage = portfolioItem.querySelector(".work__img");
    const workTitle = portfolioItem.querySelector(".work__title").innerHTML;
    const itemDetails = portfolioItem.querySelector(".portfolio__item-details").innerHTML;

    popupImage.src = workImage.src;
    document.querySelector(".portfolio__popup-subtitle span").innerHTML = workTitle;
    document.querySelector(".portfolio__popup-body").innerHTML = itemDetails;

    /*
        Reset previous clickable data first.
        This prevents one project from accidentally keeping another project's link/gallery.
    */
    popupImage.removeAttribute("data-images");
    popupImage.removeAttribute("data-link");
    popupImage.classList.remove("popup-image-clickable");
    popupImage.style.cursor = "default";
    popupImage.removeAttribute("title");

    /*
        Case 1:
        If the item has a lightbox gallery, make the popup image open the lightbox.
    */
    const galleryLink = portfolioItem.querySelector(".open-lightbox");

    if (galleryLink) {
        popupImage.dataset.images = galleryLink.dataset.images;
        popupImage.classList.add("popup-image-clickable");
        popupImage.style.cursor = "pointer";
        popupImage.title = "Click to view gallery";
        return;
    }

    /*
        Case 2:
        If the item has a normal link, make the popup image open that link.
        This works for websites, YouTube, Google Drive, PDFs, etc.
    */
    const normalLink = portfolioItem.querySelector(".portfolio__item-details a");

    if (normalLink && normalLink.getAttribute("href") !== "#") {
        popupImage.dataset.link = normalLink.href;
        popupImage.classList.add("popup-image-clickable");
        popupImage.style.cursor = "pointer";
        popupImage.title = "Click to open project";
    }
}

/*-------- Image Lightbox Gallery ------------*/

const imageLightbox = document.getElementById("imageLightbox");
const lightboxMainImage = document.getElementById("lightboxMainImage");
const lightboxThumbnails = document.getElementById("lightboxThumbnails");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const popupPreviewImage = document.querySelector(".pp__thumbnail img");

let lightboxImages = [];
let currentImageIndex = 0;

/*
    Open lightbox when clicking a "view images" link.
    This only works for links that have class="open-lightbox".
*/
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("open-lightbox")) {
        e.preventDefault();

        const imagesData = e.target.dataset.images;

        if (!imagesData) return;

        lightboxImages = imagesData
            .split(",")
            .map(image => image.trim());

        currentImageIndex = 0;
        openImageLightbox();
    }
});

/*
    Open the same lightbox when clicking the popup preview image.
    This only works if the selected portfolio item has data-images.
*/
popupPreviewImage.addEventListener("click", () => {
    const imagesData = popupPreviewImage.dataset.images;
    const normalLink = popupPreviewImage.dataset.link;

    /*
        If this project has gallery images, open the lightbox.
    */
    if (imagesData) {
        lightboxImages = imagesData
            .split(",")
            .map(image => image.trim());

        currentImageIndex = 0;
        openImageLightbox();
        return;
    }

    /*
        If this project has a normal link, open it in a new tab.
    */
    if (normalLink) {
        window.open(normalLink, "_blank");
    }
});

function openImageLightbox() {
    imageLightbox.classList.add("open");
    showLightboxImage(currentImageIndex);
    createLightboxThumbnails();
}

function closeImageLightbox() {
    imageLightbox.classList.remove("open");
}

function showLightboxImage(index) {
    lightboxMainImage.src = lightboxImages[index];

    const thumbnails = lightboxThumbnails.querySelectorAll("img");

    thumbnails.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("active", thumbIndex === index);
    });
}

function createLightboxThumbnails() {
    lightboxThumbnails.innerHTML = "";

    lightboxImages.forEach((image, index) => {
        const thumbnail = document.createElement("img");
        thumbnail.src = image;
        thumbnail.alt = "Gallery thumbnail";

        if (index === currentImageIndex) {
            thumbnail.classList.add("active");
        }

        thumbnail.addEventListener("click", () => {
            currentImageIndex = index;
            showLightboxImage(currentImageIndex);
        });

        lightboxThumbnails.appendChild(thumbnail);
    });
}

lightboxClose.addEventListener("click", closeImageLightbox);

lightboxNext.addEventListener("click", () => {
    currentImageIndex++;

    if (currentImageIndex >= lightboxImages.length) {
        currentImageIndex = 0;
    }

    showLightboxImage(currentImageIndex);
});

lightboxPrev.addEventListener("click", () => {
    currentImageIndex--;

    if (currentImageIndex < 0) {
        currentImageIndex = lightboxImages.length - 1;
    }

    showLightboxImage(currentImageIndex);
});

imageLightbox.addEventListener("click", (e) => {
    if (e.target === imageLightbox) {
        closeImageLightbox();
    }
});

/*
    Optional keyboard support:
    Escape closes the lightbox.
    ArrowRight goes to next image.
    ArrowLeft goes to previous image.
*/
document.addEventListener("keydown", (e) => {
    if (!imageLightbox.classList.contains("open")) return;

    if (e.key === "Escape") {
        closeImageLightbox();
    }

    if (e.key === "ArrowRight") {
        currentImageIndex++;

        if (currentImageIndex >= lightboxImages.length) {
            currentImageIndex = 0;
        }

        showLightboxImage(currentImageIndex);
    }

    if (e.key === "ArrowLeft") {
        currentImageIndex--;

        if (currentImageIndex < 0) {
            currentImageIndex = lightboxImages.length - 1;
        }

        showLightboxImage(currentImageIndex);
    }
});
