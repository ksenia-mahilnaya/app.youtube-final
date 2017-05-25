function ontouch(el, callback){
    const touchsurface = el;
    let dir;
    let swipeType;
    let startX;
    let startY;
    let distX;
    let distY;
    let dist = 0;
    const threshold = 150;
    const restraint = 100;
    const allowedTime = 500;
    let elapsedTime;
    let startTime;
    let mouseisdown = false;
    let detecttouch = !!('ontouchstart' in window) || !!('ontouchstart' in document.documentElement) || !!window.ontouchstart || !!window.Touch || !!window.onmsgesturechange || (window.DocumentTouch && window.document instanceof window.DocumentTouch);
    let handletouch = callback || function(evt, dir, phase, swipetype, distance){};

    touchsurface.addEventListener('touchstart', function(e){
        const touchobj = e.changedTouches[0];
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();// record time when finger first makes contact with surface
        handletouch(e, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
        e.preventDefault();

    }, false);

    touchsurface.addEventListener('touchmove', function(e){
        const touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX ;// get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        if (Math.abs(distX) > Math.abs(distY)){ // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
            dir = (distX < 0)? 'left' : 'right';
            handletouch(e, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
        }
        else{ // else consider this a vertical movement
            dir = (distY < 0)? 'up' : 'down';
            handletouch(e, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
        }
        e.preventDefault();// prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        const touchobj = e.changedTouches[0];
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipeType = dir; // set swipeType to either "left" or "right"
            }
            else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipeType = dir; // set swipeType to either "top" or "down"
            }
        }
        // fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
        handletouch(e, dir, 'end', swipeType, (dir =='left' || dir =='right')? distX : distY);
        e.preventDefault();
    }, false);

    touchsurface.addEventListener('mousedown', function(e){
        const touchobj = e;
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();// record time when finger first makes contact with surface
        handletouch(e, 'none', 'start', swipeType, 0);// fire callback function with params dir="none", phase="start", swipetype="none" etc
        mouseisdown = true;
        e.preventDefault();

    }, false);

    document.body.addEventListener('mousemove', function(e){
        if (mouseisdown){
            const touchobj = e;
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY;// get vertical dist traveled by finger while in contact with surface
            if (Math.abs(distX) > Math.abs(distY)){ // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
                dir = (distX < 0)? 'left' : 'right';
                handletouch(e, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
            }
            else{ // else consider this a vertical movement
                dir = (distY < 0)? 'up' : 'down';
                handletouch(e, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
            }
            e.preventDefault(); // prevent scrolling when inside DIV
        }
    }, false);

    document.body.addEventListener('mouseup', function(e){
        if (mouseisdown){
            const touchobj = e;
            elapsedTime = new Date().getTime() - startTime;// get time elapsed
            if (elapsedTime <= allowedTime){ // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                    swipeType = dir; // set swipeType to either "left" or "right"
                }
                else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    swipeType = dir; // set swipeType to either "top" or "down"
                }
            }
            // fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
            handletouch(e, dir, 'end', swipeType, (dir =='left' || dir =='right')? distX : distY);
            mouseisdown = false;
            e.preventDefault();
        }
    }, false);
}

module.exports = {
    ontouch,
};

