// ============================================================
// TASK MANAGER - GLOBAL THEME SYSTEM
// Dark Mode / Light Mode
// ============================================================

(function () {

    const savedTheme =
        localStorage.getItem("theme");


    // ========================================================
    // APPLY SAVED THEME
    // ========================================================

    if (savedTheme === "dark") {

        document.documentElement.classList.add(
            "dark-mode"
        );

    } else {

        document.documentElement.classList.remove(
            "dark-mode"
        );

    }


    // ========================================================
    // THEME TOGGLE FUNCTION
    // ========================================================

    window.toggleTheme = function (isDark) {

        if (isDark) {

            document.documentElement.classList.add(
                "dark-mode"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            document.documentElement.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    };


})();