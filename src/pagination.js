const { loadItems } = require('./items');
let pgToken;

function pagination() {
    const paginDiv = document.getElementById('pagination-div');
    const container = document.getElementsByClassName('container');
    const paginContainer = document.createElement('div');
    const buttonNext = document.createElement('button');
    const buttonPrev = document.createElement('button');
    buttonNext.className = 'button-next';
    buttonPrev.className = 'button-prev';
    paginContainer.className = 'pagin-container';

    if (document.getElementsByClassName('button-prev').length === 0) {
        container[0].appendChild(buttonPrev);
    }
    paginDiv.appendChild(paginContainer);
    if (document.getElementsByClassName('button-next').length === 0) {
        container[0].appendChild(buttonNext);
    }

    paginContainer.appendChild(document.createElement('span'));
    paginContainer.appendChild(document.createElement('span'));
    paginContainer.appendChild(document.createElement('span'));
    paginContainer.appendChild(document.createElement('span'));

    const spans = document.querySelectorAll('div.pagin-container span');
    spans.forEach(function(item, index) {
        item.setAttribute('data-index', index + 1);
    });


    const el = document.getElementById('swipegallery'); // reference gallery's main DIV container
    const ul = el.getElementsByTagName('ul')[0];
    const width = document.documentElement.clientWidth;
    const gallerywidth = 1281;

    spans.forEach(function(item, index) {
        item.addEventListener('click', function() {
            ul.style.left = -index * gallerywidth + 'px';
            activeItem(item, index, spans);
        });
    });

    buttonNext.addEventListener('click', function() {
        const gallerywidth = 1281;
        let liscount = document.getElementsByTagName("li").length;
        const currentItem = document.getElementsByClassName('item-active');
        let curIndex = +currentItem[0].dataset.index;
        const paginContainer = document.getElementsByClassName('pagin-container');
        pgToken = paginContainer[0].getAttribute('current-pgToken');
        if (curIndex === liscount) {
            const request = gapi.client.youtube.search.list({
                part: "snippet",
                type: "video",
                q: document.getElementById("search").value,
                maxResults: 16,
                pageToken: pgToken,
                order: "viewCount"
            });

            request.execute(function (response) {
                const result = response.result;
                const videoCount = document.getElementsByClassName("video-item").length;
                pgToken = result.nextPageToken;
                loadItems(result.items, videoCount);
                liscount = document.getElementsByTagName("li").length;
                ul.style.width = gallerywidth * liscount + 'px' ;
            });
            pagination();
        }

        ul.style.left = -curIndex * gallerywidth + 'px';
        const spans = document.querySelectorAll('div.pagin-container span');
        activeItem(spans[curIndex], curIndex, spans);
    });

    buttonPrev.addEventListener('click', function() {
        const currentItem = document.getElementsByClassName('item-active');
        let curIndex = +currentItem[0].dataset.index;
        if ((curIndex - 2) !== -1) {
        ul.style.left =  -(curIndex - 2) * gallerywidth + 'px';
        const spans = document.querySelectorAll('div.pagin-container span');

            spans[curIndex - 2].classList.add('item-active');
            spans[curIndex - 1].classList.remove('item-active');
            spans[curIndex - 2].innerHTML = `${curIndex - 1}`;
            spans[curIndex - 1].innerHTML = '';
            spans[curIndex - 2].parentElement.classList.remove('disable');
            spans[curIndex - 2].parentElement.classList.add('active');
            if (spans[curIndex - 2].parentElement !== spans[curIndex - 1].parentElement) {
                spans[curIndex - 1].parentElement.classList.remove('active');
                spans[curIndex - 1].parentElement.classList.add('disable');
            }
            spans[curIndex - 2].parentElement.classList.remove('disable');
            spans[curIndex - 2].parentElement.classList.add('active');
        }


    });
}

function activeItem(item, index, spans) {
    spans.forEach(function(i) {
        i.classList.remove('item-active');
        i.parentElement.classList.remove('active');
        i.parentElement.classList.add('disable');
        i.innerHTML = '';
    });
    item.parentElement.classList.remove('disable');
    item.parentElement.classList.add('active');
    item.classList.add('item-active');
    item.innerHTML = `${index + 1}`;
}

module.exports = { pagination, activeItem, };
