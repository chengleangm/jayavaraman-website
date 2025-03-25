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
    container.innerHTML = '';

    try {
        const response = await fetch('img/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => /\.(jpg|jpeg|png)$/i.test(href));

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
            container.style.opacity = '1';
        }, 150);
    } catch (error) {
        console.error('Error loading images:', error);
        container.innerHTML = '<div class="error-message">Oops! Something went wrong. Please try again later.</div>';
        container.style.opacity = '1';
    }
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
});