
export function createElement(tagName: string, innerHTML?: string, classes: string[] = []): HTMLElement {
    const element = document.createElement(tagName);

    if (!!classes.length)
        element.className += ` ${[...new Set(classes)].join(' ')}`;

    if (!!innerHTML)
        element.innerHTML = innerHTML;

    return element;
}

export function getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`No element with id ${id}`);
    return element;
}

export function unfade(element: HTMLElement, loadTimer = 100) {
    let op = 0.1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op >= 1) {
            op = 1;
            clearInterval(timer);
            element.style.removeProperty('opacity');
        }
        else {
            element.style.opacity = op.toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }
    }, loadTimer);
}

export function fade(element: HTMLElement, loadTimer = 100, callback?: () => void) {
    let op = 1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op <= 0.1) {
            op = 0.1;
            clearInterval(timer);
            element.style.display = 'none';
            element.style.removeProperty('opacity');
            if (!!callback)
                callback();
        }
        else {
            element.style.opacity = op.toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }
    }, loadTimer);
}