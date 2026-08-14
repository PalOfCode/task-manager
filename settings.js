// ============================================================
// TASK MANAGER - SETTINGS.JS
// ============================================================
// Dark Mode
// Light Mode
// Notifications
// Default Priority
// Clear User Tasks
// Settings User Info
// Logout
// Toast Messages
// ============================================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ====================================================
        // TOAST FUNCTION
        // ====================================================

        function showSettingsToast(
            message,
            type = "success"
        ) {


            // Remove old toast

            const oldToast =
                document.querySelector(
                    ".settings-toast"
                );


            if (oldToast) {

                oldToast.remove();

            }


            // Create toast

            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                "settings-toast " +
                type;


            const icon =
                type === "error"
                    ? "!"
                    : "✓";


            toast.innerHTML = `

                <span class="toast-icon">
                    ${icon}
                </span>

                <span class="toast-text">
                    ${message}
                </span>

            `;


            document.body.appendChild(
                toast
            );


            // Show

            setTimeout(
                function () {

                    toast.classList.add(
                        "show"
                    );

                },
                10
            );


            // Hide

            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );


            // Remove

            setTimeout(
                function () {

                    toast.remove();

                },
                3000
            );

        }



        // ====================================================
        // DARK MODE
        // ====================================================

        const darkModeToggle =
            document.getElementById(
                "darkModeToggle"
            );


        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        // ====================================================
        // APPLY THEME
        // ====================================================

        function applyTheme(
            theme
        ) {


            const html =
                document.documentElement;


            const body =
                document.body;


            if (
                theme === "dark"
            ) {


                // HTML

                html.classList.add(
                    "dark-mode"
                );


                // BODY

                body.classList.add(
                    "dark-mode"
                );


                // Checkbox

                if (
                    darkModeToggle
                ) {

                    darkModeToggle.checked =
                        true;

                }


            } else {


                // HTML

                html.classList.remove(
                    "dark-mode"
                );


                // BODY

                body.classList.remove(
                    "dark-mode"
                );


                // Checkbox

                if (
                    darkModeToggle
                ) {

                    darkModeToggle.checked =
                        false;

                }

            }

        }


        // ====================================================
        // INITIAL THEME
        // ====================================================

        if (
            savedTheme === "dark"
        ) {

            applyTheme(
                "dark"
            );

        } else {

            applyTheme(
                "light"
            );

        }



        // ====================================================
        // DARK MODE TOGGLE
        // ====================================================

        if (
            darkModeToggle
        ) {

            darkModeToggle.addEventListener(
                "change",
                function () {


                    if (
                        darkModeToggle.checked
                    ) {


                        localStorage.setItem(
                            "theme",
                            "dark"
                        );


                        applyTheme(
                            "dark"
                        );


                        showSettingsToast(
                            "Dark mode enabled."
                        );


                    } else {


                        localStorage.setItem(
                            "theme",
                            "light"
                        );


                        applyTheme(
                            "light"
                        );


                        showSettingsToast(
                            "Light mode enabled."
                        );

                    }

                }
            );

        }



        // ====================================================
        // NOTIFICATIONS
        // ====================================================

        const notificationToggle =
            document.getElementById(
                "notificationToggle"
            );


        const savedNotifications =
            localStorage.getItem(
                "notifications"
            );


        // Default = ON

        if (
            notificationToggle
        ) {

            if (
                savedNotifications ===
                "false"
            ) {

                notificationToggle.checked =
                    false;

            } else {

                notificationToggle.checked =
                    true;

            }

        }



        // ====================================================
        // SAVE NOTIFICATION SETTING
        // ====================================================

        if (
            notificationToggle
        ) {

            notificationToggle.addEventListener(
                "change",
                function () {


                    const enabled =
                        notificationToggle.checked;


                    localStorage.setItem(
                        "notifications",
                        String(enabled)
                    );


                    if (
                        enabled
                    ) {

                        showSettingsToast(
                            "Task notifications enabled."
                        );

                    } else {

                        showSettingsToast(
                            "Task notifications disabled."
                        );

                    }

                }
            );

        }



        // ====================================================
        // DEFAULT PRIORITY
        // ====================================================

        const defaultPriority =
            document.getElementById(
                "defaultPriority"
            );


        const savedPriority =
            localStorage.getItem(
                "defaultPriority"
            );


        if (
            defaultPriority
        ) {


            if (
                savedPriority ===
                "Low" ||
                savedPriority ===
                "Medium" ||
                savedPriority ===
                "High"
            ) {

                defaultPriority.value =
                    savedPriority;

            } else {

                defaultPriority.value =
                    "Medium";

            }

        }



        // ====================================================
        // SAVE DEFAULT PRIORITY
        // ====================================================

        if (
            defaultPriority
        ) {

            defaultPriority.addEventListener(
                "change",
                function () {


                    localStorage.setItem(
                        "defaultPriority",
                        defaultPriority.value
                    );


                    showSettingsToast(
                        "Default priority saved."
                    );

                }
            );

        }



        // ====================================================
        // CURRENT USER
        // ====================================================

        function getSettingsUser() {


            const userId =
                localStorage.getItem(
                    "currentUserId"
                );


            if (
                !userId
            ) {

                return null;

            }


            const usersString =
                localStorage.getItem(
                    "users"
                );


            if (
                !usersString
            ) {

                return null;

            }


            try {


                const users =
                    JSON.parse(
                        usersString
                    );


                if (
                    !Array.isArray(users)
                ) {

                    return null;

                }


                return users.find(
                    function (user) {

                        return String(
                            user.id
                        ) ===
                        String(
                            userId
                        );

                    }
                ) || null;


            } catch (error) {


                console.error(
                    "Unable to load user:",
                    error
                );


                return null;

            }

        }



        // ====================================================
        // LOAD USER INFORMATION
        // ====================================================

        const settingsUser =
            getSettingsUser();


        if (
            settingsUser
        ) {


            const settingsUserName =
                document.getElementById(
                    "settingsUserName"
                );


            const settingsAvatar =
                document.getElementById(
                    "settingsAvatar"
                );


            if (
                settingsUserName
            ) {

                settingsUserName.textContent =
                    settingsUser.name ||
                    "User";

            }


            if (
                settingsAvatar
            ) {

                settingsAvatar.textContent =
                    (
                        settingsUser.name ||
                        "U"
                    )
                    .charAt(0)
                    .toUpperCase();

            }

        }



        // ====================================================
        // CLEAR ALL TASKS
        // ====================================================

        const clearTasksBtn =
            document.getElementById(
                "clearTasksBtn"
            );


        if (
            clearTasksBtn
        ) {

            clearTasksBtn.addEventListener(
                "click",
                function () {


                    const userId =
                        localStorage.getItem(
                            "currentUserId"
                        );


                    if (
                        !userId
                    ) {

                        showSettingsToast(
                            "Please login first.",
                            "error"
                        );


                        return;

                    }


                    // ==================================================
                    // USER-SPECIFIC TASK STORAGE
                    // ==================================================

                    const userTaskKey =
                        "tasks_" +
                        userId;


                    const existingTasks =
                        localStorage.getItem(
                            userTaskKey
                        );


                    if (
                        !existingTasks
                    ) {

                        showSettingsToast(
                            "There are no tasks to clear."
                        );


                        return;

                    }


                    let tasks = [];


                    try {

                        tasks =
                            JSON.parse(
                                existingTasks
                            );

                    } catch (
                        error
                    ) {

                        tasks = [];

                    }


                    if (
                        !Array.isArray(tasks) ||
                        tasks.length === 0
                    ) {

                        showSettingsToast(
                            "There are no tasks to clear."
                        );


                        return;

                    }


                    // ====================================================
// CLEAR ALL TASKS
// ====================================================

if (clearTasksBtn) {

    clearTasksBtn.addEventListener(
        "click",
        function () {

            const userId =
                localStorage.getItem(
                    "currentUserId"
                );


            if (!userId) {

                showSettingsToast(
                    "Please login first.",
                    "error"
                );

                return;
            }


            const userTaskKey =
                "tasks_" + userId;


            const existingTasks =
                localStorage.getItem(
                    userTaskKey
                );


            if (!existingTasks) {

                showSettingsToast(
                    "There are no tasks to clear."
                );

                return;
            }


            let tasks = [];


            try {

                tasks =
                    JSON.parse(
                        existingTasks
                    );

            } catch (error) {

                tasks = [];

            }


            if (
                !Array.isArray(tasks) ||
                tasks.length === 0
            ) {

                showSettingsToast(
                    "There are no tasks to clear."
                );

                return;
            }


            // ================================================
            // DIRECT DELETE - NO ALERT / NO CONFIRM
            // ================================================

            localStorage.removeItem(
                userTaskKey
            );


            localStorage.removeItem(
                "tasks"
            );


            // ================================================
            // SUCCESS TOAST
            // ================================================

            showSettingsToast(
                "All tasks have been deleted successfully."
            );


            // ================================================
            // GO DASHBOARD
            // ================================================

            setTimeout(
                function () {

                    window.location.replace(
                        "dashboard.html"
                    );

                },
                700
            );

        }
    );

}


                    // ==================================================
                    // DELETE
                    // ==================================================

                    localStorage.removeItem(
                        userTaskKey
                    );


                    // Also remove old shared storage
                    // if it exists.

                    localStorage.removeItem(
                        "tasks"
                    );


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    showSettingsToast(
                        "All tasks have been deleted successfully."
                    );


                    // ==================================================
                    // GO DASHBOARD
                    // ==================================================

                    setTimeout(
                        function () {

                            window.location.replace(
                                "dashboard.html"
                            );

                        },
                        700
                    );

                }
            );

        }



        // ====================================================
        // LOGOUT FUNCTION
        // ====================================================

        function logoutFromSettings() {


            localStorage.removeItem(
                "loggedIn"
            );


            localStorage.removeItem(
                "currentUserId"
            );


            localStorage.removeItem(
                "userName"
            );


            localStorage.removeItem(
                "userEmail"
            );


            showSettingsToast(
                "Logged out successfully."
            );


            setTimeout(
                function () {

                    window.location.replace(
                        "login.html"
                    );

                },
                700
            );

        }



        // ====================================================
        // SIDEBAR LOGOUT
        // ====================================================

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (
            logoutBtn
        ) {

            logoutBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logoutFromSettings();

                }
            );

        }



        // ====================================================
        // SETTINGS LOGOUT
        // ====================================================

        const settingsLogoutBtn =
            document.getElementById(
                "settingsLogoutBtn"
            );


        if (
            settingsLogoutBtn
        ) {

            settingsLogoutBtn.addEventListener(
                "click",
                function () {

                    logoutFromSettings();

                }
            );

        }



    }
);