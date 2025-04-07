function getDesignName(imagePath) {
    const fileName = imagePath.split('/').pop();
    return fileName
        .replace(/\.(jpg|jpeg|png)/i, '')
        .replace(/(Mockup|Copy|Of|The|\([^)]*\))/gi, '')
        .replace(/[-_0-9%]/g, ' ')
        .replace(/\b(Typography|Car|T-Shirts|Streetwear|Cloth)\b/gi, '')
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
}

function getCategory(imagePath) {
    const fileName = imagePath.toLowerCase();
    if (fileName.includes('graphic')) return 'graphic';
    if (fileName.includes('vintage')) return 'vintage';
    if (fileName.includes('minimal')) return 'minimal';
    return 'all';
}

async function loadTshirts(category = 'all') {
    const container = document.querySelector('.grid-container');
    container.style.opacity = '0';
    container.innerHTML = '<div class="loading-spinner"></div>'; // Add loading spinner

    try {
        const imagePaths = [
            'img/Artboard 3 Mockup.jpg',
            'img/Artboard 4 Mockup.jpg',
            'img/Artboard 5 Mockup.jpg',
            'img/BAYON-1.png',
            'img/Break The Rules Mockup (3) - Copy.jpg',
            'img/Break The Rules Mockup (4) - Copy.jpg',
            'img/Break The Rules Mockup.jpg',
            'img/Confident Mockup.jpg',
            'img/Cupid Sniper Streetwear Mockup (4) - Copy.jpg',
            'img/Dreams Cloth Mockup (2) - Copy.jpg',
            'img/Famous Mockup (2).jpg',
            'img/Famous Mockup (3) - Copy.jpg',
            'img/first poster-1.png',
            'img/Fourth poster.png',
            'img/Fullmoon Mockup (3).jpg',
            'img/Future Project Y2K Mockup (5) - Copy.jpg',
            'img/Future Project Y2K Mockup.jpg',
            'img/Global Drive Typography Car T-Shirts Mockup (3).jpg',
            'img/Global Drive Typography Car T-Shirts Mockup (4).jpg',
            'img/Global Drive Typography Car T-Shirts Mockup.jpg',
            'img/INTROVERT 12 Mockup.jpg',
            'img/INTROVERT Mockup - Copy (2).jpg',
            'img/INTROVERT Mockup (1) - Copy.jpg',
            'img/Keep Your Aim Well Mockup.jpg',
            'img/millennium Mockup (3).jpg',
            'img/millennium Mockup.jpg',
            'img/Next Gen Division Mockup (2).jpg',
            'img/Next Gen Division Mockup (3).jpg',
            'img/Overcome Every Challenge Mockup - Copy.jpg',
            'img/Oxygen Studio Mockup (3) - Copy.jpg',
            'img/Oxygen Studio Mockup (4) - Copy - Copy.jpg',
            'img/Oxygen Studio Mockup (6) - Copy - Copy - Copy.jpg',
            'img/Oxygen Studio Mockup (6).jpg',
            'img/Oxygen Studio Mockup.jpg',
            'img/Push the Burner Mockup.jpg',
            'img/RECKLESS CHILDS POSTER-1.png',
            'img/second poster-1.png',
            'img/Shark Clothing Mockup (5) - Copy - Copy - Copy.jpg',
            'img/Shark Clothing Mockup.jpg',
            'img/third poster.png',
            'img/Unidentified Flying Object Mockup - Copy (2).jpg',
            'img/Unidentified Flying Object Mockup.jpg',
            'img/Untitled-1.png',
            'img/Worldwide Project 1 Mockup.jpg',
            'img/Worldwide Project 2 Mockup (1).jpg',
            'img/Worldwide Project 2 Mockup.jpg',
            'img/Worldwide Project 4 Mockup.jpg',
            'img/Worldwide Project 5 Mockup.jpg',
            'img/Worldwide Project 6 Mockup.jpg',
            'img/Worldwide Project 7 Mockup.jpg',
            'img/Worldwide Project 8 Mockup.jpg',
            'img/Worldwide Project 9 Mockup.jpg',
            'img/Worldwide Project 10 Mockup.jpg',
            'img/Worldwide Project Mockup.jpg'
        ]; // Replace with actual image paths
        const links = imagePaths.filter(href => /\.(jpg|jpeg|png)$/i.test(href));

        if (links.length === 0) {
            container.innerHTML = '<div class="error-message">No designs available yet. More coming soon!</div>';
            container.style.opacity = '1';
            return;
        }

        const filteredLinks = category === 'all' 
            ? links 
            : links.filter(href => getCategory(href) === category);

        filteredLinks.forEach((href, index) => {
            const imagePath = 'img/' + href.split('/').pop();
            const designName = getDesignName(imagePath);
            const card = document.createElement('div');
            card.className = 't-shirt-card';
            card.dataset.category = getCategory(imagePath);
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="img-container">
                    <div class="loading-spinner"></div>
                    <img src="${imagePath}" 
                         alt="${designName}" 
                         loading="lazy"
                         onload="this.classList.add('loaded'); this.parentElement.classList.add('loaded')"
                         onerror="this.parentElement.classList.add('error'); this.nextElementSibling.style.display='block'"
                    >
                    <div class="error-text" style="display:none">Image unavailable</div>
                </div>
                <div class="card-content">
                    <h3>${designName}</h3>
                    <p>${getCategory(imagePath).charAt(0).toUpperCase() + getCategory(imagePath).slice(1)} Style</p>
                </div>
            `;
            container.appendChild(card);

            setTimeout(() => {
                card.classList.add('visible');
            }, 50 + index * 200);
        });

        setTimeout(() => {
            container.style.opacity = '1'; // Fade-in effect
        }, 150);
    } catch (error) {
        console.error('Error loading images:', error);
        container.innerHTML = '<div class="error-message">Oops! Something went wrong. Please try again later.</div>';
        container.style.opacity = '1';
    } finally {
        document.querySelector('.loading-spinner')?.remove(); // Remove spinner after loading
    }
}

function filterBySearch(query) {
    const cards = document.querySelectorAll('.t-shirt-card');
    cards.forEach(card => {
        const designName = card.querySelector('h3').textContent.toLowerCase();
        if (designName.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTshirts();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            loadTshirts(btn.dataset.category);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', () => {
        filterBySearch(searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        filterBySearch(searchInput.value);
    });
});