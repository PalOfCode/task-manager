// ============================================================
// TASK MANAGER - AUTHENTICATION
// Register | Login | Logout | Forgot Password | Profile
// Multiple Account System
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // USER STORAGE
    // ========================================================

    function getUsers() {

        const data =
            localStorage.getItem("users");

        if (!data) {
            return [];
        }

        try {

            const users =
                JSON.parse(data);

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Users data error:",
                error
            );

            return [];
        }
    }


    function saveUsers(users) {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    }



    // ========================================================
    // CURRENT USER
    // ========================================================

    function getCurrentUserId() {

        return localStorage.getItem(
            "currentUserId"
        );
    }


    function getCurrentUser() {

        const userId =
            getCurrentUserId();

        if (!userId) {
            return null;
        }

        const users =
            getUsers();

        return users.find(
            function (user) {

                return String(user.id) ===
                    String(userId);

            }
        ) || null;
    }



    // ========================================================
    // LOGIN STATUS
    // ========================================================

    function isLoggedIn() {

        return (
            localStorage.getItem(
                "loggedIn"
            ) === "true"
        );
    }


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
    // REGISTER
    // ========================================================

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

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


                // ====================================================
                // CHECK FORM
                // ====================================================

                if (
                    !nameInput ||
                    !emailInput ||
                    !passwordInput ||
                    !confirmPasswordInput
                ) {

                    alert(
                        "Registration form is incomplete."
                    );

                    return;
                }


                // ====================================================
                // GET VALUES
                // ====================================================

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



                // ====================================================
                // NAME VALIDATION
                // ====================================================

                if (
                    name.length < 2
                ) {

                    alert(
                        "Please enter your full name."
                    );

                    nameInput.focus();

                    return;
                }



                // ====================================================
                // EMAIL VALIDATION
                // ====================================================

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    emailInput.focus();

                    return;
                }



                // ====================================================
                // PASSWORD VALIDATION
                // ====================================================

                if (
                    password.length < 6
                ) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    passwordInput.focus();

                    return;
                }



                // ====================================================
                // CONFIRM PASSWORD
                // ====================================================

                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Passwords do not match."
                    );

                    confirmPasswordInput.focus();

                    return;
                }



                // ====================================================
                // GET ALL USERS
                // ====================================================

                const users =
                    getUsers();



                // ====================================================
                // CHECK EXISTING EMAIL
                // ====================================================

                const existingUser =
                    users.find(
                        function (user) {

                            return (
                                user.email &&
                                user.email
                                    .trim()
                                    .toLowerCase() ===
                                email
                            );

                        }
                    );


                if (existingUser) {

                    alert(
                        "This email is already registered. Please use another email."
                    );

                    emailInput.focus();

                    return;
                }



                // ====================================================
                // CREATE USER
                // ====================================================

                const newUser = {

                    id:
                        Date.now().toString(),

                    name:
                        name,

                    email:
                        email,

                    password:
                        password

                };


                users.push(
                    newUser
                );


                saveUsers(
                    users
                );



                // ====================================================
                // CLEAR LOGIN SESSION
                // ====================================================

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



                // ====================================================
                // SUCCESS
                // ====================================================

                alert(
                    "Account created successfully!"
                );


                window.location.replace(
                    "login.html"
                );

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
            function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "email"
                    );


                const passwordInput =
                    document.getElementById(
                        "password"
                    );


                // ====================================================
                // CHECK FORM
                // ====================================================

                if (
                    !emailInput ||
                    !passwordInput
                ) {

                    alert(
                        "Login form is incomplete."
                    );

                    return;
                }


                // ====================================================
                // GET VALUES
                // ====================================================

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;



                // ====================================================
                // VALIDATION
                // ====================================================

                if (
                    email === ""
                ) {

                    alert(
                        "Please enter your email."
                    );

                    emailInput.focus();

                    return;
                }


                if (
                    password === ""
                ) {

                    alert(
                        "Please enter your password."
                    );

                    passwordInput.focus();

                    return;
                }



                // ====================================================
                // GET USERS
                // ====================================================

                const users =
                    getUsers();


                if (
                    users.length === 0
                ) {

                    alert(
                        "No account found. Please create an account first."
                    );

                    return;
                }



                // ====================================================
                // FIND USER
                // ====================================================

                const user =
                    users.find(
                        function (account) {

                            return (
                                account.email &&
                                account.email
                                    .trim()
                                    .toLowerCase() ===
                                email
                            );

                        }
                    );


                if (!user) {

                    alert(
                        "Incorrect email address."
                    );

                    emailInput.focus();

                    return;
                }



                // ====================================================
                // PASSWORD CHECK
                // ====================================================

                if (
                    user.password !==
                    password
                ) {

                    alert(
                        "Incorrect password."
                    );

                    passwordInput.focus();

                    return;
                }



                // ====================================================
                // LOGIN SUCCESS
                // ====================================================

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
                    user.email
                );



                // ====================================================
                // REMEMBER ME
                // ====================================================

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



                // ====================================================
                // GO DASHBOARD
                // ====================================================

                window.location.replace(
                    "dashboard.html"
                );

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


                    window.location.replace(
                        "login.html"
                    );

                }
            );

        }
    );



    // ========================================================
    // FORGOT PASSWORD / RESET PASSWORD
    // ========================================================

    const forgotForm =
        document.getElementById(
            "forgotPasswordForm"
        );


    if (forgotForm) {

        forgotForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                // ====================================================
                // INPUTS
                // ====================================================

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

                    alert(
                        "Password reset form is incomplete."
                    );

                    return;
                }



                // ====================================================
                // VALUES
                // ====================================================

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const newPassword =
                    newPasswordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;



                // ====================================================
                // EMAIL VALIDATION
                // ====================================================

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    emailInput.focus();

                    return;
                }



                // ====================================================
                // PASSWORD VALIDATION
                // ====================================================

                if (
                    newPassword.length < 6
                ) {

                    alert(
                        "New password must contain at least 6 characters."
                    );

                    newPasswordInput.focus();

                    return;
                }



                // ====================================================
                // CONFIRM PASSWORD
                // ====================================================

                if (
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New passwords do not match."
                    );

                    confirmPasswordInput.focus();

                    return;
                }



                // ====================================================
                // GET USERS
                // ====================================================

                const users =
                    getUsers();


                if (
                    users.length === 0
                ) {

                    alert(
                        "No account found. Please create an account first."
                    );

                    return;
                }



                // ====================================================
                // FIND USER
                // ====================================================

                const userIndex =
                    users.findIndex(
                        function (account) {

                            return (
                                account.email &&
                                account.email
                                    .trim()
                                    .toLowerCase() ===
                                email
                            );

                        }
                    );


                if (
                    userIndex === -1
                ) {

                    alert(
                        "No account found with this email."
                    );

                    emailInput.focus();

                    return;
                }



                // ====================================================
                // UPDATE PASSWORD
                // ====================================================

                users[userIndex].password =
                    newPassword;


                saveUsers(
                    users
                );



                // ====================================================
                // CLEAR CURRENT SESSION
                // ====================================================

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



                // ====================================================
                // SUCCESS
                // ====================================================

                alert(
                    "Password reset successfully! Please login with your new password."
                );


                window.location.replace(
                    "login.html"
                );

            }
        );

    }



    // ========================================================
    // PROFILE PAGE
    // ========================================================

    const profilePage =
        document.getElementById(
            "profilePage"
        );


    const profileSection =
        document.querySelector(
            ".profile-section"
        );


    const profileForm =
        document.getElementById(
            "profileForm"
        );


    const changePasswordForm =
        document.getElementById(
            "changePasswordForm"
        );


    const isProfilePage =
        profilePage ||
        profileSection ||
        profileForm ||
        changePasswordForm;


    if (isProfilePage) {

        if (!requireLogin()) {
            return;
        }


        const user =
            getCurrentUser();


        if (!user) {

            localStorage.removeItem(
                "loggedIn"
            );


            localStorage.removeItem(
                "currentUserId"
            );


            window.location.replace(
                "login.html"
            );

            return;
        }



        // ====================================================
        // PROFILE ELEMENTS
        // ====================================================

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



        // ====================================================
        // DISPLAY PROFILE
        // ====================================================

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


            profileEmailInput.readOnly =
                true;
        }


        if (profileAvatar) {

            profileAvatar.textContent =
                getInitial(
                    user.name
                );
        }


        if (headerName) {

            headerName.textContent =
                user.name || "User";
        }


        if (headerAvatar) {

            headerAvatar.textContent =
                getInitial(
                    user.name
                );
        }

    }



    // ========================================================
    // UPDATE PROFILE
    // ========================================================

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!isLoggedIn()) {

                    alert(
                        "Please login first."
                    );

                    window.location.replace(
                        "login.html"
                    );

                    return;
                }


                const currentUser =
                    getCurrentUser();


                if (!currentUser) {

                    alert(
                        "User account not found."
                    );

                    return;
                }


                const nameInput =
                    document.getElementById(
                        "profileNameInput"
                    );


                if (!nameInput) {

                    alert(
                        "Name field not found."
                    );

                    return;
                }


                const newName =
                    nameInput.value.trim();


                if (
                    newName.length < 2
                ) {

                    alert(
                        "Please enter a valid name."
                    );

                    nameInput.focus();

                    return;
                }



                // ====================================================
                // UPDATE USERS ARRAY
                // ====================================================

                const users =
                    getUsers();


                const index =
                    users.findIndex(
                        function (user) {

                            return String(
                                user.id
                            ) ===
                            String(
                                currentUser.id
                            );

                        }
                    );


                if (index === -1) {

                    alert(
                        "User account not found."
                    );

                    return;
                }


                users[index].name =
                    newName;


                saveUsers(
                    users
                );


                localStorage.setItem(
                    "userName",
                    newName
                );



                // ====================================================
                // UPDATE PAGE
                // ====================================================

                const profileName =
                    document.getElementById(
                        "profileName"
                    );


                const profileAvatar =
                    document.getElementById(
                        "profileAvatar"
                    );


                const headerName =
                    document.getElementById(
                        "headerName"
                    );


                const headerAvatar =
                    document.getElementById(
                        "headerAvatar"
                    );


                if (profileName) {

                    profileName.textContent =
                        newName;
                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        getInitial(
                            newName
                        );
                }


                if (headerName) {

                    headerName.textContent =
                        newName;
                }


                if (headerAvatar) {

                    headerAvatar.textContent =
                        getInitial(
                            newName
                        );
                }


                alert(
                    "Profile updated successfully!"
                );

            }
        );

    }



    // ========================================================
    // CHANGE PASSWORD
    // ========================================================

    if (changePasswordForm) {

        changePasswordForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!isLoggedIn()) {

                    alert(
                        "Please login first."
                    );

                    window.location.replace(
                        "login.html"
                    );

                    return;
                }


                const currentUser =
                    getCurrentUser();


                if (!currentUser) {

                    window.location.replace(
                        "login.html"
                    );

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

                    alert(
                        "Password form is incomplete."
                    );

                    return;
                }


                const oldPassword =
                    oldPasswordInput.value;


                const newPassword =
                    newPasswordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;



                // ====================================================
                // CURRENT PASSWORD
                // ====================================================

                if (
                    oldPassword !==
                    currentUser.password
                ) {

                    alert(
                        "Current password is incorrect."
                    );

                    oldPasswordInput.focus();

                    return;
                }



                // ====================================================
                // NEW PASSWORD
                // ====================================================

                if (
                    newPassword.length < 6
                ) {

                    alert(
                        "New password must contain at least 6 characters."
                    );

                    newPasswordInput.focus();

                    return;
                }



                // ====================================================
                // CONFIRM
                // ====================================================

                if (
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New passwords do not match."
                    );

                    confirmPasswordInput.focus();

                    return;
                }



                // ====================================================
                // UPDATE PASSWORD
                // ====================================================

                const users =
                    getUsers();


                const index =
                    users.findIndex(
                        function (user) {

                            return String(
                                user.id
                            ) ===
                            String(
                                currentUser.id
                            );

                        }
                    );


                if (index === -1) {

                    alert(
                        "User account not found."
                    );

                    return;
                }


                users[index].password =
                    newPassword;


                saveUsers(
                    users
                );


                alert(
                    "Password changed successfully!"
                );


                changePasswordForm.reset();

            }
        );

    }



    // ========================================================
    // DASHBOARD USER NAME
    // ========================================================

    const dashboardName =
        document.querySelector(
            ".user-profile strong"
        );


    const dashboardAvatar =
        document.querySelector(
            ".user-profile .avatar"
        );


    if (
        isLoggedIn()
    ) {

        const user =
            getCurrentUser();


        if (user) {

            if (dashboardName) {

                dashboardName.textContent =
                    user.name || "User";
            }


            if (dashboardAvatar) {

                dashboardAvatar.textContent =
                    getInitial(
                        user.name
                    );
            }

        }

    }



    // ========================================================
    // GET INITIAL
    // ========================================================

    function getInitial(name) {

        if (
            !name ||
            name.trim() === ""
        ) {

            return "U";
        }


        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    }

});