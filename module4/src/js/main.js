import '../css/style.scss'

const burgerMenu = () => {
    const menu = document.querySelector('.menu__list');
    const button = document.querySelector('.menu__button');
    const buttonLine = document.querySelector('.menu__button-line');
    const links = document.querySelectorAll('.menu__list-link');

    const toggleMenu = () => {
        buttonLine.classList.toggle('menu__button-line--active');
        menu.classList.toggle('menu__list--active');
        document.body.classList.toggle('--lock');
    }

    button.addEventListener('click', toggleMenu);
    links.forEach(link => link.addEventListener('click', toggleMenu));
}

burgerMenu();

