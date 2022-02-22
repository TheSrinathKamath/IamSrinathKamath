function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function copyToClipboard(text, tooltipId) {
    console.log('copied', text)
    navigator.clipboard.writeText(text);
    var tooltip = document.getElementById(tooltipId);
    tooltip.innerHTML = "Copied!";
}

function resetToolTipOnMouseOut() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}