if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    var styleEl = document.createElement('style');
    var styleSheet;
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
    styleSheet.insertRule(".modal { position:absolute; bottom:auto; }", 0);
}
