const { loadItems } = require('./items');
const { ontouch } = require('./swipe');
const { pagination, activeItem } = require('./pagination');

let pgToken;
let liscount;
let curindex = 0;
let liLength;

window.addEventListener('load', function(){
    const form = document.createElement('form');
    const inputText = '<input type="text" id="search">';
    const inputSubmit = '<input type="submit" value="search">';
    const div = document.createElement('div');
    div.id = "swipegallery";
    div.className = "touchgallery";
    div.innerHTML = "<ul id='result'></ul>";

    document.body.insertBefore(form, document.body.firstChild);
    document.body.insertBefore(div, form.nextSibling);
    form.innerHTML = '<div class="input-border">' + inputText + inputSubmit + '</div>';

    const paginDiv = document.createElement('div');
    paginDiv.id = "pagination-div";
    const container = document.createElement('div');
    container.className = "container";
    document.body.insertBefore(container, div.nextSibling);
    container.appendChild(paginDiv);

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        document.getElementById("result").innerHTML = '';
        document.getElementById("pagination-div").innerHTML = '';
        //container.removeChild(buttonPrev);

            // prepare the request
            const request = gapi.client.youtube.search.list({
                part: "snippet",
                type: "video",
                q: document.getElementById("search").value,
                maxResults: 16,
                order: "viewCount"
            });
            // execute the request
            request.execute(function (response) {
                const result = response.result;
                pgToken = result.nextPageToken;
                loadItems(result.items, 0);
                liLength = document.getElementsByTagName("li").length;
                if (width < 656) {
                    liscount = liLength * 4;
                } else if ((width >= 656) && (width <= 975)) {
                    liscount = liLength * 2;
                } else {
                    liscount = liLength;
                }
                ul.style.width = gallerywidth * liscount * 4 + 'px' ;
                pagination();
                const firstSpan = document.querySelector('div span');
                firstSpan.classList.add('item-active');
                firstSpan.innerHTML = '1';
                const paginContainer = document.getElementsByClassName('pagin-container');
                paginContainer[0].setAttribute('current-pgToken', pgToken);
                resetVideoHeight();
            });
    });

    const el = document.getElementById('swipegallery'); // reference gallery's main DIV container
    const width = document.documentElement.clientWidth;
    let gallerywidth;

    if (width < 656) {
        gallerywidth = 320;
    } else if ((width >= 656) && (width <= 975)) {
        gallerywidth = 640;
    } else {
        gallerywidth = 1281;
    }

    const ul = el.getElementsByTagName('ul')[0];
    let ulLeft = 0;
    ul.style.width = gallerywidth * liscount + 'px' ;// set width of gallery to parent container's width * total li
    ontouch(el, function(evt, dir, phase, swipetype, distance){
        if (phase == 'start'){ // on touchstart
            ulLeft = parseInt(ul.style.left) || 0; // initialize ulLeft var with left position of UL

        }
        else if (phase == 'move' && (dir == 'left' || dir == 'right')){ //  on touchmove and if moving left or right
            let totaldist = distance + ulLeft;// calculate new left position of UL based on movement of finger
            ul.style.left = Math.min(totaldist, (curindex + 1) * gallerywidth) + 'px'; // set gallery to new left position
        }
        else if (phase == 'end'){ // on touchend
            if (swipetype == 'left' || swipetype == 'right'){ // if a successful left or right swipe is made
                curindex = (swipetype == 'left') ?  Math.min(curindex + 1, liscount - 1) : Math.max(curindex-1, 0);
            }
            ul.style.left = -curindex * gallerywidth + 'px'; // move UL to show the new image
            if (((width < 656) && (curindex === liscount - 4)) || ((width >= 656) && (width <= 975) && (curindex === liscount - 2)) || ((width > 975) && (curindex === liscount - 1))) {
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
                    liLength = document.getElementsByTagName("li").length;
                    if (width < 656) {
                        liscount = liLength * 4;
                    } else if ((width >= 656) && (width <= 975)) {
                        liscount = liLength * 2;
                    } else {
                        liscount = liLength;
                    }
                    ul.style.width = (width <= 1295) ? gallerywidth * (liscount + 1)  + 'px' : gallerywidth * liscount + 'px' ;
                });
                pagination();
            }
            const spans = document.querySelectorAll('div.pagin-container span');
            spans.forEach(function(item, index) {
                if (((width < 656) && (index === curindex / 4)) || ((width >= 656) && (width <= 975) && (index === curindex / 2)) || ((width > 975) && (index === curindex))){
                    activeItem(item, index, spans);
                }
            });
        }
    });// end ontouch
    window.addEventListener('resize', resetVideoHeight , false );

}, false);

function resetVideoHeight() {
    const touchgallery = document.getElementsByClassName('touchgallery');
    const width = document.documentElement.clientWidth;
    if (width < 656) {
        touchgallery[0].style.width = '320px';
    } else if ((width >= 656) && (width <= 975)) {
        touchgallery[0].style.width = '640px';
    } else if ((width >= 976) && (width <= 1295)) {
        touchgallery[0].style.width = '962px';
    } else {
        touchgallery[0].style.width = '1281px';
    }
}
