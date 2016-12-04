$(document.body).on('click', '[data-toggle=dropdown]', function() {
    var dropmenu = $(this).next('.dropdown-menu');

    dropmenu.css({
        visibility: "hidden",
        display: "block"
    });

    // Necessary to remove class each time so we don't unwantedly use dropup's offset top
    dropmenu.parent().removeClass("dropup");

    // Determine whether bottom of menu will be below window at current scroll position
    if (dropmenu.offset().top + dropmenu.outerHeight() > $(window).innerHeight() + $(window).scrollTop()) {
        dropmenu.parent().addClass("dropup");
    }

    // Return dropdown menu to fully hidden state
    dropmenu.removeAttr("style");
});
