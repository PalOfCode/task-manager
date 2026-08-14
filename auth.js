// ============================================================
// TASK MANAGER - FRONTEND AUTHENTICATION
// Backend API + JWT Authentication
//
// Register
// Login
// Logout
// Forgot Password
// Reset Password
// Profile
// Change Password
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // BACKEND API
    // ========================================================

    const API_BASE_URL = "http://localhost:5000/api";


    // ========================================================
    // TOAST MESSAGE
    // ========================================================

    function showToast(message, type = "success") {

        const oldToast =
            document.querySelector(".auth-toast");

        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement("div");

        toast.className =
            "auth-toast " + type;


        const icon =
            type === "error"
                ? "!"
                : "✓";


        toast.innerHTML = `
            <span class="auth-toast-icon">
                ${icon}
            </span>

            <span class="auth-toast-text">
                ${escapeHTML(message)}
            </span>
        `;


        toast.style.position = "fixed";
        toast.style.top = "25px";
        toast.style.right = "25px";
        toast.style.zIndex = "99999";
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "10px";
        toast.style.padding = "14px 20px";
        toast.style.borderRadius = "10px";
        toast.style.background =
            type === "error"
                ? "#dc3545"
                : "#198754";
        toast.style.color = "#ffffff";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.20)";


        document.body.appendChild(toast);


        setTimeout(function () {

            toast.style.opacity = "0";
            toast.style.transform =
                "translateY(-10px)";
            toast.style.transition =
                "all 0.3s ease";

        }, 2500);


        setTimeout(function () {

            toast.remove();

        }, 3000);

    }


    // ========================================================
    // ESCAPE HTML
    // ========================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;

    }


    // ========================================================
    // API REQUEST HELPER
    // ========================================================

    async function apiRequest(
        endpoint,
        options = {}
    ) {

        try {

            const response =
                await fetch(
                    API_BASE_URL + endpoint,
                    {
                        ...options,

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...(options.headers || {})
                        }
                    }
                );


            let data = {};

            try {

                data =
                    await response.json();

            } catch (error) {

                data = {};

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Something went wrong."
                );

            }


            return data;

        } catch (error) {

            console.error(
                "API Error:",
                error
            );


            if (
                error.name ===
                "TypeError"
            ) {

                throw new Error(
                    "Cannot connect to server. Please make sure the backend is running."
                );

            }


            throw error;

        }

    }


    // ========================================================
    // TOKEN
    // ========================================================

    function getToken() {

        return localStorage.getItem(
            "authToken"
        );

    }


    // ========================================================
    // CURRENT USER
    // ========================================================

    function getStoredUser() {

        const data =
            localStorage.getItem(
                "currentUser"
            );


        if (!data) {
            return null;
        }


        try {

            return JSON.parse(data);

        } catch (error) {

            return null;

        }

    }


    // ========================================================
    // SAVE LOGIN SESSION
    // ========================================================

    function saveLoginSession(
        token,
        user
    ) {

        localStorage.setItem(
            "authToken",
            token
        );


        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        // Keep these keys because
        // your existing dashboard/profile
        // code uses them.

        localStorage.setItem(
            "loggedIn",
            "true"
        );


        localStorage.setItem(
            "currentUserId",
            String(user.id)
        );


        localStorage.setItem(
            "userName",
            user.name || "User"
        );


        localStorage.setItem(
            "userEmail",
            user.email || ""
        );

    }


    // ========================================================
    // CLEAR LOGIN SESSION
    // ========================================================

    function clearLoginSession() {

        localStorage.removeItem(
            "authToken"
        );


        localStorage.removeItem(
            "currentUser"
        );


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


        localStorage.removeItem(
            "rememberMe"
        );

    }


    // ========================================================
    // LOGIN STATUS
    // ========================================================

    function isLoggedIn() {

        return Boolean(
            getToken()
        );

    }


    // ========================================================
    // REQUIRE LOGIN
    // ========================================================

    function requireLogin() {

        if (!isLoggedIn()) {

            window.location.replace(
                "login.html"
            );

            return false;

        }


        return true;

    }


    // ========================================================
    // GET INITIAL
    // ========================================================

    function getInitial(name) {

        if (
            !name ||
            String(name).trim() === ""
        ) {

            return "U";

        }


        return String(name)
            .trim()
            .charAt(0)
            .toUpperCase();

    }



    // ========================================================
    // REGISTER
    // ========================================================

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "name"
                    );


                const emailInput =
                    document.getElementById(
                        "registerEmail"
                    );


                const passwordInput =
                    document.getElementById(
                        "registerPassword"
                    );


                const confirmPasswordInput =
                    document.getElementById(
                        "confirmPassword"
                    );


                if (
                    !nameInput ||
                    !emailInput ||
                    !passwordInput ||
                    !confirmPasswordInput
                ) {

                    showToast(
                        "Registration form is incomplete.",
                        "error"
                    );

                    return;

                }


                const name =
                    nameInput.value.trim();


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;


                // ------------------------------------------------
                // NAME
                // ------------------------------------------------

                if (name.length < 2) {

                    showToast(
                        "Please enter your full name.",
                        "error"
                    );

                    nameInput.focus();

                    return;

                }


                // ------------------------------------------------
                // EMAIL
                // ------------------------------------------------

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;

                }


                // ------------------------------------------------
                // PASSWORD
                // ------------------------------------------------

                if (
                    password.length < 6
                ) {

                    showToast(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    passwordInput.focus();

                    return;

                }


                // ------------------------------------------------
                // CONFIRM PASSWORD
                // ------------------------------------------------

                if (
                    password !==
                    confirmPassword
                ) {

                    showToast(
                        "Passwords do not match.",
                        "error"
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                // ------------------------------------------------
                // DISABLE BUTTON
                // ------------------------------------------------

                const submitButton =
                    registerForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Creating Account...";

                }


                try {

                    const data =
                        await apiRequest(
                            "/auth/register",
                            {
                                method: "POST",

                                body:
                                    JSON.stringify({
                                        name,
                                        email,
                                        password
                                    })
                            }
                        );


                    showToast(
                        data.message ||
                        "Account created successfully!"
                    );


                    registerForm.reset();


                    setTimeout(
                        function () {

                            window.location.replace(
                                "login.html"
                            );

                        },
                        1000
                    );


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Create Account";

                    }

                }

            }
        );

    }



    // ========================================================
    // LOGIN
    // ========================================================

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "email"
                    );


                const passwordInput =
                    document.getElementById(
                        "password"
                    );


                if (
                    !emailInput ||
                    !passwordInput
                ) {

                    showToast(
                        "Login form is incomplete.",
                        "error"
                    );

                    return;

                }


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                if (email === "") {

                    showToast(
                        "Please enter your email.",
                        "error"
                    );

                    emailInput.focus();

                    return;

                }


                if (password === "") {

                    showToast(
                        "Please enter your password.",
                        "error"
                    );

                    passwordInput.focus();

                    return;

                }


                const submitButton =
                    loginForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Logging in...";

                }


                try {

                    const data =
                        await apiRequest(
                            "/auth/login",
                            {
                                method: "POST",

                                body:
                                    JSON.stringify({
                                        email,
                                        password
                                    })
                            }
                        );


                    saveLoginSession(
                        data.token,
                        data.user
                    );


                    const rememberMe =
                        document.getElementById(
                            "rememberMe"
                        );


                    if (
                        rememberMe &&
                        rememberMe.checked
                    ) {

                        localStorage.setItem(
                            "rememberMe",
                            "true"
                        );

                    } else {

                        localStorage.removeItem(
                            "rememberMe"
                        );

                    }


                    showToast(
                        data.message ||
                        "Login successful!"
                    );


                    setTimeout(
                        function () {

                            window.location.replace(
                                "dashboard.html"
                            );

                        },
                        600
                    );


                } catch (error) {

                    showToast(
                        error.message ||
                        "Invalid email or password.",
                        "error"
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Login";

                    }

                }

            }
        );

    }



    // ========================================================
    // LOGOUT
    // ========================================================

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn"
        );


    logoutButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    clearLoginSession();


                    window.location.replace(
                        "login.html"
                    );

                }
            );

        }
    );



    // ========================================================
    // FORGOT PASSWORD
    // ========================================================

    const forgotForm =
        document.getElementById(
            "forgotPasswordForm"
        );


    if (forgotForm) {

        forgotForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "forgotEmail"
                    );


                const newPasswordInput =
                    document.getElementById(
                        "newPassword"
                    );


                const confirmPasswordInput =
                    document.getElementById(
                        "confirmNewPassword"
                    );


                if (
                    !emailInput ||
                    !newPasswordInput ||
                    !confirmPasswordInput
                ) {

                    showToast(
                        "Password reset form is incomplete.",
                        "error"
                    );

                    return;

                }


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const newPassword =
                    newPasswordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;

                }


                if (
                    newPassword.length < 6
                ) {

                    showToast(
                        "New password must contain at least 6 characters.",
                        "error"
                    );

                    newPasswordInput.focus();

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showToast(
                        "New passwords do not match.",
                        "error"
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                const submitButton =
                    forgotForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Resetting Password...";

                }


                try {

                    // ------------------------------------------------
                    // STEP 1:
                    // Request reset token
                    // ------------------------------------------------

                    const requestData =
                        await apiRequest(
                            "/auth/forgot-password",
                            {
                                method: "POST",

                                body:
                                    JSON.stringify({
                                        email
                                    })
                            }
                        );


                    // ------------------------------------------------
                    // IMPORTANT:
                    // This backend is currently a local/demo system.
                    // It returns the reset token directly.
                    //
                    // Production:
                    // Send the token through email instead.
                    // ------------------------------------------------

                    const resetToken =
                        requestData.resetToken;


                    if (!resetToken) {

                        throw new Error(
                            "No reset token received. Please check the email address."
                        );

                    }


                    // ------------------------------------------------
                    // STEP 2:
                    // Reset password
                    // ------------------------------------------------

                    const resetData =
                        await apiRequest(
                            "/auth/reset-password",
                            {
                                method: "POST",

                                body:
                                    JSON.stringify({
                                        token:
                                            resetToken,

                                        newPassword:
                                            newPassword
                                    })
                            }
                        );


                    // ------------------------------------------------
                    // CLEAR SESSION
                    // ------------------------------------------------

                    clearLoginSession();


                    showToast(
                        resetData.message ||
                        "Password reset successfully!"
                    );


                    forgotForm.reset();


                    setTimeout(
                        function () {

                            window.location.replace(
                                "login.html"
                            );

                        },
                        1200
                    );


                } catch (error) {

                    showToast(
                        error.message ||
                        "Password reset failed.",
                        "error"
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Reset Password";

                    }

                }

            }
        );

    }



    // ========================================================
    // PROFILE PAGE
    // ========================================================

    const profileForm =
        document.getElementById(
            "profileForm"
        );


    const changePasswordForm =
        document.getElementById(
            "changePasswordForm"
        );


    const profileSection =
        document.querySelector(
            ".profile-section"
        );


    const isProfilePage =
        profileForm ||
        changePasswordForm ||
        profileSection;


    if (isProfilePage) {

        if (!requireLogin()) {
            return;
        }


        loadProfile();

    }



    // ========================================================
    // LOAD PROFILE
    // ========================================================

    async function loadProfile() {

        try {

            const data =
                await apiRequest(
                    "/profile",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                "Bearer " +
                                getToken()
                        }
                    }
                );


            const user =
                data.user;


            // Update stored user

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );


            localStorage.setItem(
                "currentUserId",
                String(user.id)
            );


            localStorage.setItem(
                "userName",
                user.name || "User"
            );


            localStorage.setItem(
                "userEmail",
                user.email || ""
            );


            updateProfileUI(user);


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );


            if (
                error.message.includes(
                    "Invalid or expired token"
                ) ||
                error.message.includes(
                    "Authentication"
                )
            ) {

                clearLoginSession();

                window.location.replace(
                    "login.html"
                );

            }

        }

    }



    // ========================================================
    // UPDATE PROFILE UI
    // ========================================================

    function updateProfileUI(user) {

        const profileName =
            document.getElementById(
                "profileName"
            );


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        const profileAvatar =
            document.getElementById(
                "profileAvatar"
            );


        const profileNameInput =
            document.getElementById(
                "profileNameInput"
            );


        const profileEmailInput =
            document.getElementById(
                "profileEmailInput"
            );


        const headerName =
            document.getElementById(
                "headerName"
            );


        const headerAvatar =
            document.getElementById(
                "headerAvatar"
            );


        const settingsUserName =
            document.getElementById(
                "settingsUserName"
            );


        const settingsAvatar =
            document.getElementById(
                "settingsAvatar"
            );


        const dashboardName =
            document.querySelector(
                ".user-profile strong"
            );


        const dashboardAvatar =
            document.querySelector(
                ".user-profile .avatar"
            );


        if (profileName) {

            profileName.textContent =
                user.name || "User";

        }


        if (profileEmail) {

            profileEmail.textContent =
                user.email || "";

        }


        if (profileNameInput) {

            profileNameInput.value =
                user.name || "";

        }


        if (profileEmailInput) {

            profileEmailInput.value =
                user.email || "";

            profileEmailInput.disabled =
                true;

        }


        if (profileAvatar) {

            profileAvatar.textContent =
                getInitial(user.name);

        }


        if (headerName) {

            headerName.textContent =
                user.name || "User";

        }


        if (headerAvatar) {

            headerAvatar.textContent =
                getInitial(user.name);

        }


        if (settingsUserName) {

            settingsUserName.textContent =
                user.name || "User";

        }


        if (settingsAvatar) {

            settingsAvatar.textContent =
                getInitial(user.name);

        }


        if (dashboardName) {

            dashboardName.textContent =
                user.name || "User";

        }


        if (dashboardAvatar) {

            dashboardAvatar.textContent =
                getInitial(user.name);

        }

    }



    // ========================================================
    // UPDATE PROFILE
    // ========================================================

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (!requireLogin()) {
                    return;
                }


                const nameInput =
                    document.getElementById(
                        "profileNameInput"
                    );


                if (!nameInput) {

                    showToast(
                        "Name field not found.",
                        "error"
                    );

                    return;

                }


                const name =
                    nameInput.value.trim();


                if (name.length < 2) {

                    showToast(
                        "Please enter a valid name.",
                        "error"
                    );

                    nameInput.focus();

                    return;

                }


                const submitButton =
                    profileForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Saving...";

                }


                try {

                    const data =
                        await apiRequest(
                            "/profile",
                            {
                                method: "PUT",

                                headers: {
                                    Authorization:
                                        "Bearer " +
                                        getToken()
                                },

                                body:
                                    JSON.stringify({
                                        name
                                    })
                            }
                        );


                    const user =
                        data.user;


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(user)
                    );


                    localStorage.setItem(
                        "userName",
                        user.name
                    );


                    updateProfileUI(
                        user
                    );


                    showToast(
                        data.message ||
                        "Profile updated successfully!"
                    );


                } catch (error) {

                    showToast(
                        error.message,
                        "error"
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Save Changes";

                    }

                }

            }
        );

    }



    // ========================================================
    // CHANGE PASSWORD
    // ========================================================

    if (changePasswordForm) {

        changePasswordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (!requireLogin()) {
                    return;
                }


                const oldPasswordInput =
                    document.getElementById(
                        "oldPassword"
                    );


                const newPasswordInput =
                    document.getElementById(
                        "newPassword"
                    );


                const confirmPasswordInput =
                    document.getElementById(
                        "confirmNewPassword"
                    );


                if (
                    !oldPasswordInput ||
                    !newPasswordInput ||
                    !confirmPasswordInput
                ) {

                    showToast(
                        "Password form is incomplete.",
                        "error"
                    );

                    return;

                }


                const currentPassword =
                    oldPasswordInput.value;


                const newPassword =
                    newPasswordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;


                if (
                    currentPassword === ""
                ) {

                    showToast(
                        "Please enter your current password.",
                        "error"
                    );

                    oldPasswordInput.focus();

                    return;

                }


                if (
                    newPassword.length < 6
                ) {

                    showToast(
                        "New password must contain at least 6 characters.",
                        "error"
                    );

                    newPasswordInput.focus();

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showToast(
                        "New passwords do not match.",
                        "error"
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                const submitButton =
                    changePasswordForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Changing Password...";

                }


                try {

                    const data =
                        await apiRequest(
                            "/profile/password",
                            {
                                method: "PUT",

                                headers: {
                                    Authorization:
                                        "Bearer " +
                                        getToken()
                                },

                                body:
                                    JSON.stringify({
                                        currentPassword,
                                        newPassword
                                    })
                            }
                        );


                    showToast(
                        data.message ||
                        "Password changed successfully!"
                    );


                    changePasswordForm.reset();


                } catch (error) {

                    showToast(
                        error.message ||
                        "Unable to change password.",
                        "error"
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Change Password";

                    }

                }

            }
        );

    }



    // ========================================================
    // DASHBOARD USER
    // ========================================================

    function updateDashboardUser() {

        const user =
            getStoredUser();


        if (!user) {
            return;
        }


        const dashboardName =
            document.querySelector(
                ".user-profile strong"
            );


        const dashboardAvatar =
            document.querySelector(
                ".user-profile .avatar"
            );


        if (dashboardName) {

            dashboardName.textContent =
                user.name || "User";

        }


        if (dashboardAvatar) {

            dashboardAvatar.textContent =
                getInitial(user.name);

        }

    }


    updateDashboardUser();



    // ========================================================
    // PROTECTED PAGE CHECK
    // ========================================================

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const protectedPages = [
        "dashboard.html",
        "profile.html",
        "settings.html"
    ];


    if (
        protectedPages.includes(
            currentPage
        )
    ) {

        if (!isLoggedIn()) {

            window.location.replace(
                "login.html"
            );

            return;

        }

    }



    // ========================================================
    // LOGIN PAGE REDIRECT
    // ========================================================

    if (
        currentPage ===
        "login.html"
    ) {

        if (isLoggedIn()) {

            // Do not automatically redirect
            // if user intentionally opened login.
            //
            // Keeping this disabled makes
            // account testing easier.

        }

    }



    // ========================================================
    // REGISTER PAGE
    // ========================================================

    if (
        currentPage ===
        "register.html"
    ) {

        // Register page remains accessible.

    }



    // ========================================================
    // EXPORT HELPERS
    // ========================================================

    window.TaskManagerAuth = {

        getToken:
            getToken,

        getCurrentUser:
            getStoredUser,

        isLoggedIn:
            isLoggedIn,

        logout:
            clearLoginSession,

        showToast:
            showToast

    };


});