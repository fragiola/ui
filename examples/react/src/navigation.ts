// The examples link like real pages do (`?page=2`, `/docs`), because readers
// copy them. Followed where an example is shown, those links would replace
// the page with one that is not an example — `?page=2` drops the `id`, and
// in apps/playground the whole view. Links that open elsewhere (`target`)
// still work, and so does any link whose click was already handled
// (`defaultPrevented`): a host's own navigation handles its links first.
//
// Listening on the document, not on the example's root: popups are
// portalled out of it, and a navigation menu's links live in one.
export function keepNavigationInPlace() {
    document.addEventListener("click", (event) => {
        if (event.defaultPrevented) return;
        const link =
            event.target instanceof Element
                ? event.target.closest("a[href]")
                : null;
        if (link instanceof HTMLAnchorElement && !link.target) {
            event.preventDefault();
        }
    });
}
