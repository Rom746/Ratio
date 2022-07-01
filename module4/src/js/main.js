import '../css/style.scss'
import { burgerMenu } from './header'
import { API } from './api'

burgerMenu();

console.log(111);

const createMainPage = async () => {
    const api = new API();
    const bannerContent = await api.get('/blog/featured/');

    if (bannerContent instanceof Error) { return ;}

    filter(bannerContent);

    createBanner(bannerContent);
}

const filter = (data) => {
    data.title = data.title.split("FEATURED ARTICLE")[1];

    let date = new Date (data.createdAt * 1000);
    let dateOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      };
   
    data.createdAt = date.toLocaleString("en-US", dateOptions);

    data.readTime /= 60; 
}



const createBanner = async (banner) => {

    const inner = document.querySelector('.banner__inner');
    const content = document.querySelector('.banner__content');
    let background = document.createElement('div');

    background.className = 'banner__image';
    background.style.background = `linear-gradient(0deg, rgba(28, 28, 28, 0.1), rgba(28, 28, 28, 0.1)), url(${banner.image})`;
    background.style.backgroundRepeat = 'no-repeat';
    background.style.backgroundPosition = 'center';
    background.style.backgroundSize = 'cover';
    inner.append(background);


    if (content) {
        content.innerHTML = createArticlePreview(banner);
    }
}

const createArticlePreview = (content) => {
    console.log(content);
    return `
            <p class="preview-article__tag">${content.tag}</p>
            <a class="preview-article__link" href="/blog/${content.id}">
                <h3 class="preview-article__title">${content.title}</h3>
            </a>
            <div class="preview-article__row">
                <p class="preview-article__author">${content.author}</p>
                <p class="preview-article__date">${content.createdAt}</p>
                <p class="preview-article__read-time">(${content.readTime} mins read)</p>
            </div>
            <p class="preview-article__text">${content.description}</p>`;
}

createMainPage()