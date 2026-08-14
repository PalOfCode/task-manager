// ============================================================
// TASK MANAGER - COMPLETE SCRIPT.JS
// ============================================================
// Authentication
// Register / Login / Logout
// Forgot Password / Reset Password
// User-wise Task Storage
// Add / Edit / Delete
// Complete / Uncomplete
// Search / Filter
// Dashboard Statistics
// Dashboard Analytics
// Due Date Analytics
// Toast Notifications
// Empty Task Screen
// Modal Animation
// Profile Support
// ============================================================


document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // GLOBAL
    // ========================================================

    let editingTaskId = null;


    // ========================================================
    // CURRENT PAGE
    // ========================================================

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    // ========================================================
    // LOGIN STATUS
    // ========================================================

    const isLoggedIn =
        localStorage.getItem("loggedIn") === "true";


    // ========================================================
    // PROTECTED PAGES
    // ========================================================

    const protectedPages = [
        "dashboard.html",
        "profile.html",
        "settings.html"
    ];


    if (
        protectedPages.includes(currentPage) &&
        !isLoggedIn
    ) {

        window.location.replace("login.html");

        return;
    }


    // ========================================================
    // TOAST NOTIFICATION
    // ========================================================

    function showToast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(
                ".toast-message"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement("div");


        toast.className =
            "toast-message " + type;


        const icon =
            type === "error"
                ? "!"
                : "✓";


        toast.innerHTML = `

            <span class="toast-icon">
                ${icon}
            </span>

            <span class="toast-text">
                ${escapeHTML(message)}
            </span>

        `;


        document.body.appendChild(toast);


        setTimeout(function () {

            toast.classList.add("hide");

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
    // USERS
    // ========================================================

    function getUsers() {

        const savedUsers =
            localStorage.getItem("users");


        if (!savedUsers) {
            return [];
        }


        try {

            const users =
                JSON.parse(savedUsers);


            return Array.isArray(users)
                ? users
                : [];


        } catch (error) {

            console.error(
                "Users error:",
                error
            );


            return [];
        }
    }


    // ========================================================
    // SAVE USERS
    // ========================================================

    function saveUsers(users) {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    // ========================================================
    // CURRENT USER ID
    // ========================================================

    function getCurrentUserId() {

        return localStorage.getItem(
            "currentUserId"
        );

    }


    // ========================================================
    // CURRENT USER
    // ========================================================

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
                // VALIDATION
                // ====================================================

                if (!name) {

                    showToast(
                        "Please enter your name.",
                        "error"
                    );


                    nameInput.focus();


                    return;
                }


                if (!email) {

                    showToast(
                        "Please enter your email.",
                        "error"
                    );


                    emailInput.focus();


                    return;
                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showToast(
                        "Please enter a valid email.",
                        "error"
                    );


                    emailInput.focus();


                    return;
                }


                if (
                    password.length < 6
                ) {

                    showToast(
                        "Password must be at least 6 characters.",
                        "error"
                    );


                    passwordInput.focus();


                    return;
                }


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


                // ====================================================
                // GET USERS
                // ====================================================

                const users =
                    getUsers();


                // ====================================================
                // CHECK DUPLICATE EMAIL
                // ====================================================

                const existingUser =
                    users.find(
                        function (user) {

                            return (
                                user.email &&
                                user.email
                                    .toLowerCase() ===
                                email
                            );

                        }
                    );


                if (existingUser) {

                    showToast(
                        "This email is already registered.",
                        "error"
                    );


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
                // NEW ACCOUNT WILL NOT AUTO LOGIN
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


                showToast(
                    "Account created successfully!"
                );


                setTimeout(
                    function () {

                        window.location.replace(
                            "login.html"
                        );

                    },
                    800
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


                const rememberMe =
                    document.getElementById(
                        "rememberMe"
                    );


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value;


                // ====================================================
                // VALIDATION
                // ====================================================

                if (!email) {

                    showToast(
                        "Please enter your email.",
                        "error"
                    );


                    emailInput.focus();


                    return;
                }


                if (!password) {

                    showToast(
                        "Please enter your password.",
                        "error"
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

                    showToast(
                        "No account found. Please register first.",
                        "error"
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
                                    .toLowerCase() ===
                                email
                            );

                        }
                    );


                if (!user) {

                    showToast(
                        "Invalid email address.",
                        "error"
                    );


                    return;
                }


                // ====================================================
                // PASSWORD
                // ====================================================

                if (
                    user.password !==
                    password
                ) {

                    showToast(
                        "Incorrect password.",
                        "error"
                    );


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
                    user.name
                );


                localStorage.setItem(
                    "userEmail",
                    user.email
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

            }
        );

    }


    // ========================================================
    // FORGOT PASSWORD / RESET PASSWORD
    // ========================================================

    const forgotPasswordForm =
        document.getElementById(
            "forgotPasswordForm"
        );


    if (forgotPasswordForm) {

        forgotPasswordForm.addEventListener(
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


                // ====================================================
                // CHECK INPUTS
                // ====================================================

                if (
                    !emailInput ||
                    !newPasswordInput ||
                    !confirmPasswordInput
                ) {

                    showToast(
                        "Reset password form is incomplete.",
                        "error"
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

                if (!email) {

                    showToast(
                        "Please enter your email.",
                        "error"
                    );


                    emailInput.focus();


                    return;
                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showToast(
                        "Please enter a valid email.",
                        "error"
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

                    showToast(
                        "Password must be at least 6 characters.",
                        "error"
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

                    showToast(
                        "New password and confirm password do not match.",
                        "error"
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

                    showToast(
                        "No registered account found.",
                        "error"
                    );


                    return;
                }


                // ====================================================
                // FIND USER BY EMAIL
                // ====================================================

                const userIndex =
                    users.findIndex(
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


                // ====================================================
                // USER NOT FOUND
                // ====================================================

                if (
                    userIndex === -1
                ) {

                    showToast(
                        "No account found with this email.",
                        "error"
                    );


                    return;
                }


                // ====================================================
                // UPDATE PASSWORD
                // ====================================================

                users[userIndex].password =
                    newPassword;


                // SAVE UPDATED USERS
                saveUsers(
                    users
                );


                // ====================================================
                // CLEAR OLD SESSION
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


                // ====================================================
                // SUCCESS
                // ====================================================

                showToast(
                    "Password reset successfully! Please login with your new password."
                );


                forgotPasswordForm.reset();


                // ====================================================
                // GO TO LOGIN
                // ====================================================

                setTimeout(
                    function () {

                        window.location.replace(
                            "login.html"
                        );

                    },
                    1000
                );

            }
        );

    }


    // ========================================================
    // DASHBOARD USER INFO
    // ========================================================

    const currentUser =
        getCurrentUser();


    if (currentUser) {

        const nameElement =
            document.querySelector(
                ".user-profile strong"
            );


        const avatarElement =
            document.querySelector(
                ".user-profile .avatar"
            );


        if (nameElement) {

            nameElement.textContent =
                currentUser.name;

        }


        if (avatarElement) {

            avatarElement.textContent =
                currentUser.name
                    .charAt(0)
                    .toUpperCase();

        }

    }


    // ========================================================
    // TASK STORAGE
    // ========================================================

    function getTaskStorageKey() {

        const userId =
            getCurrentUserId();


        if (!userId) {
            return null;
        }


        return (
            "tasks_" +
            userId
        );

    }


    // ========================================================
    // GET TASKS
    // ========================================================

    function getTasks() {

        const key =
            getTaskStorageKey();


        if (!key) {
            return [];
        }


        const saved =
            localStorage.getItem(
                key
            );


        if (!saved) {
            return [];
        }


        try {

            const tasks =
                JSON.parse(saved);


            return Array.isArray(tasks)
                ? tasks
                : [];


        } catch (error) {

            console.error(
                "Task storage error:",
                error
            );


            return [];
        }

    }


    // ========================================================
    // SAVE TASKS
    // ========================================================

    function saveTasks(tasks) {

        const key =
            getTaskStorageKey();


        if (!key) {
            return;
        }


        localStorage.setItem(
            key,
            JSON.stringify(tasks)
        );

    }


    // ========================================================
    // TASK ELEMENTS
    // ========================================================

    const addTaskBtn =
        document.getElementById(
            "addTaskBtn"
        );


    const taskModal =
        document.getElementById(
            "taskModal"
        );


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const cancelTask =
        document.getElementById(
            "cancelTask"
        );


    const taskForm =
        document.getElementById(
            "taskForm"
        );


    const taskList =
        document.getElementById(
            "taskList"
        );


    const searchTasks =
        document.getElementById(
            "searchTasks"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const priorityFilter =
        document.getElementById(
            "priorityFilter"
        );


    const dueDateFilter =
        document.getElementById(
            "dueDateFilter"
        );


    const taskTitle =
        document.getElementById(
            "taskTitle"
        );


    const taskDescription =
        document.getElementById(
            "taskDescription"
        );


    const taskPriority =
        document.getElementById(
            "taskPriority"
        );


    const taskDueDate =
        document.getElementById(
            "taskDueDate"
        );


    const taskStatus =
        document.getElementById(
            "taskStatus"
        );


    // ========================================================
    // MODAL TITLE / BUTTON
    // ========================================================

    const modalTitle =
        document.getElementById(
            "modalTitle"
        ) ||
        document.querySelector(
            "#taskModal .modal-header h2"
        );


    const modalSubmitBtn =
        document.getElementById(
            "modalSubmitBtn"
        ) ||
        document.querySelector(
            "#taskForm button[type='submit']"
        );


    // ========================================================
    // OPEN ADD MODAL
    // ========================================================

    if (addTaskBtn) {

        addTaskBtn.addEventListener(
            "click",
            function () {

                openAddModal();

            }
        );

    }


    function openAddModal() {

        editingTaskId =
            null;


        if (taskForm) {

            taskForm.reset();

        }


        if (modalTitle) {

            modalTitle.textContent =
                "Add New Task";

        }


        if (modalSubmitBtn) {

            modalSubmitBtn.textContent =
                "Add Task";

        }


        const savedPriority =
            localStorage.getItem(
                "defaultPriority"
            );


        if (taskPriority) {

            taskPriority.value =
                savedPriority ||
                "Medium";

        }


        if (taskStatus) {

            taskStatus.value =
                "To Do";

        }


        if (taskModal) {

            taskModal.classList.add(
                "show"
            );

        }


        setTimeout(
            function () {

                if (taskTitle) {

                    taskTitle.focus();

                }

            },
            100
        );

    }


    // ========================================================
    // OPEN EDIT MODAL
    // ========================================================

    function openEditModal(
        taskId
    ) {

        const tasks =
            getTasks();


        const task =
            tasks.find(
                function (item) {

                    return Number(
                        item.id
                    ) ===
                    Number(taskId);

                }
            );


        if (!task) {

            showToast(
                "Task not found.",
                "error"
            );


            return;
        }


        editingTaskId =
            Number(task.id);


        if (taskTitle) {

            taskTitle.value =
                task.title || "";

        }


        if (taskDescription) {

            taskDescription.value =
                task.description || "";

        }


        if (taskPriority) {

            taskPriority.value =
                task.priority ||
                "Medium";

        }


        if (taskDueDate) {

            taskDueDate.value =
                task.dueDate || "";

        }


        if (taskStatus) {

            taskStatus.value =
                task.status ||
                "To Do";

        }


        if (modalTitle) {

            modalTitle.textContent =
                "Edit Task";

        }


        if (modalSubmitBtn) {

            modalSubmitBtn.textContent =
                "Save Changes";

        }


        if (taskModal) {

            taskModal.classList.add(
                "show"
            );

        }


        setTimeout(
            function () {

                if (taskTitle) {

                    taskTitle.focus();

                }

            },
            100
        );

    }


    // ========================================================
    // CLOSE MODAL
    // ========================================================

    function closeTaskModal() {

        if (taskModal) {

            taskModal.classList.remove(
                "show"
            );

        }


        if (taskForm) {

            taskForm.reset();

        }


        editingTaskId =
            null;


        if (modalTitle) {

            modalTitle.textContent =
                "Add New Task";

        }


        if (modalSubmitBtn) {

            modalSubmitBtn.textContent =
                "Add Task";

        }

    }


    // ========================================================
    // CLOSE BUTTON
    // ========================================================

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeTaskModal
        );

    }


    if (cancelTask) {

        cancelTask.addEventListener(
            "click",
            closeTaskModal
        );

    }


    // ========================================================
    // CLICK OUTSIDE MODAL
    // ========================================================

    if (taskModal) {

        taskModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    taskModal
                ) {

                    closeTaskModal();

                }

            }
        );

    }


    // ========================================================
    // ESC CLOSE
    // ========================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                taskModal &&
                taskModal.classList.contains(
                    "show"
                )
            ) {

                closeTaskModal();

            }

        }
    );


    // ========================================================
    // ADD / EDIT TASK
    // ========================================================

    if (taskForm) {

        taskForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    taskTitle.value.trim();


                const description =
                    taskDescription.value.trim();


                const priority =
                    taskPriority.value;


                const dueDate =
                    taskDueDate.value;


                const status =
                    taskStatus.value;


                // ====================================================
                // VALIDATION
                // ====================================================

                if (!title) {

                    showToast(
                        "Please enter a task title.",
                        "error"
                    );


                    taskTitle.focus();


                    return;
                }


                const tasks =
                    getTasks();


                // ====================================================
                // EDIT TASK
                // ====================================================

                if (
                    editingTaskId !== null
                ) {

                    const index =
                        tasks.findIndex(
                            function (task) {

                                return Number(
                                    task.id
                                ) ===
                                Number(
                                    editingTaskId
                                );

                            }
                        );


                    if (index === -1) {

                        showToast(
                            "Task not found.",
                            "error"
                        );


                        return;
                    }


                    tasks[index].title =
                        title;


                    tasks[index].description =
                        description;


                    tasks[index].priority =
                        priority;


                    tasks[index].dueDate =
                        dueDate;


                    tasks[index].status =
                        status;


                    saveTasks(
                        tasks
                    );


                    closeTaskModal();


                    displayTasks();


                    updateStatistics();


                    updateAnalytics();


                    showToast(
                        "Task updated successfully!"
                    );


                    return;
                }


                // ====================================================
                // ADD TASK
                // ====================================================

                const newTask = {

                    id:
                        Date.now(),

                    title:
                        title,

                    description:
                        description,

                    priority:
                        priority,

                    dueDate:
                        dueDate,

                    status:
                        status

                };


                tasks.push(
                    newTask
                );


                saveTasks(
                    tasks
                );


                closeTaskModal();


                displayTasks();


                updateStatistics();


                updateAnalytics();


                showToast(
                    "Task added successfully!"
                );

            }
        );

    }


    // ========================================================
    // DUE DATE HELPERS
    // ========================================================

    function getTodayString() {

        const now =
            new Date();


        return (
            now.getFullYear() +
            "-" +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                now.getDate()
            ).padStart(2, "0")
        );

    }


    function getDueDateStatus(
        task
    ) {

        if (!task.dueDate) {

            return "No Date";

        }


        if (
            task.status ===
            "Completed"
        ) {

            return "Completed";

        }


        const today =
            getTodayString();


        if (
            task.dueDate <
            today
        ) {

            return "Overdue";

        }


        if (
            task.dueDate ===
            today
        ) {

            return "Today";

        }


        return "Upcoming";

    }


    function getDueDateClass(
        task
    ) {

        const status =
            getDueDateStatus(
                task
            );


        if (
            status === "Overdue"
        ) {

            return "overdue";

        }


        if (
            status === "Today"
        ) {

            return "due-today";

        }


        if (
            status === "Upcoming"
        ) {

            return "upcoming";

        }


        if (
            status === "Completed"
        ) {

            return "date-completed";

        }


        return "no-date";

    }


    function getDueDateLabel(
        task
    ) {

        if (!task.dueDate) {

            return "No due date";

        }


        const status =
            getDueDateStatus(
                task
            );


        if (
            status === "Overdue"
        ) {

            return (
                "⚠️ Overdue · " +
                formatDate(
                    task.dueDate
                )
            );

        }


        if (
            status === "Today"
        ) {

            return "📅 Due Today";

        }


        if (
            status === "Completed"
        ) {

            return (
                "✓ " +
                formatDate(
                    task.dueDate
                )
            );

        }


        return (
            "📅 " +
            formatDate(
                task.dueDate
            )
        );

    }


    // ========================================================
    // DISPLAY TASKS
    // ========================================================

    function displayTasks() {

        if (!taskList) {
            return;
        }


        const tasks =
            getTasks();


        const search =
            searchTasks
                ? searchTasks.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "All Tasks";


        const selectedPriority =
            priorityFilter
                ? priorityFilter.value
                : "All Priorities";


        const selectedDueDate =
            dueDateFilter
                ? dueDateFilter.value
                : "All Dates";


        const filteredTasks =
            tasks.filter(
                function (task) {

                    const title =
                        String(
                            task.title || ""
                        ).toLowerCase();


                    const description =
                        String(
                            task.description || ""
                        ).toLowerCase();


                    const searchMatch =
                        title.includes(
                            search
                        ) ||
                        description.includes(
                            search
                        );


                    const statusMatch =
                        selectedStatus ===
                            "All Tasks" ||
                        task.status ===
                            selectedStatus;


                    const priorityMatch =
                        selectedPriority ===
                            "All Priorities" ||
                        task.priority ===
                            selectedPriority;


                    const dueStatus =
                        getDueDateStatus(
                            task
                        );


                    const dueDateMatch =
                        selectedDueDate ===
                            "All Dates" ||

                        (
                            selectedDueDate ===
                                "Overdue" &&
                            dueStatus ===
                                "Overdue"
                        ) ||

                        (
                            selectedDueDate ===
                                "Today" &&
                            dueStatus ===
                                "Today"
                        ) ||

                        (
                            selectedDueDate ===
                                "Upcoming" &&
                            dueStatus ===
                                "Upcoming"
                        ) ||

                        (
                            selectedDueDate ===
                                "No Date" &&
                            dueStatus ===
                                "No Date"
                        );


                    return (
                        searchMatch &&
                        statusMatch &&
                        priorityMatch &&
                        dueDateMatch
                    );

                }
            );


        taskList.innerHTML =
            "";


        // ====================================================
        // EMPTY SCREEN
        // ====================================================

        if (
            filteredTasks.length === 0
        ) {

            taskList.innerHTML = `

                <div class="empty-task">

                    <h3>

                        ${
                            tasks.length === 0
                                ? "No tasks yet"
                                : "No tasks found"
                        }

                    </h3>


                    <p>

                        ${
                            tasks.length === 0
                                ? "Create your first task by clicking the + Add Task button."
                                : "Try changing your search or filter."
                        }

                    </p>

                </div>

            `;


            return;
        }


        // ====================================================
        // CREATE TASK CARDS
        // ====================================================

        filteredTasks.forEach(
            function (task) {

                const taskItem =
                    document.createElement(
                        "div"
                    );


                taskItem.className =
                    "task-item";


                if (
                    task.status ===
                    "Completed"
                ) {

                    taskItem.classList.add(
                        "completed-task"
                    );

                }


                taskItem.innerHTML = `

                    <div class="task-check">

                        <input
                            type="checkbox"
                            class="complete-checkbox"
                            data-id="${task.id}"

                            ${
                                task.status ===
                                "Completed"
                                    ? "checked"
                                    : ""
                            }
                        >

                    </div>


                    <div class="task-info">

                        <h3>

                            ${escapeHTML(
                                task.title
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                task.description ||
                                ""
                            )}

                        </p>


                        <div class="task-meta">

                            <span
                                class="priority ${getPriorityClass(
                                    task.priority
                                )}"
                            >

                                ${escapeHTML(
                                    task.priority ||
                                    "Medium"
                                )}

                            </span>


                            <span
                                class="task-due-date ${getDueDateClass(
                                    task
                                )}"
                            >

                                ${escapeHTML(
                                    getDueDateLabel(
                                        task
                                    )
                                )}

                            </span>


                            <span
                                class="status ${getStatusClass(
                                    task.status
                                )}"
                            >

                                ${escapeHTML(
                                    task.status ||
                                    "To Do"
                                )}

                            </span>

                        </div>

                    </div>


                    <div class="task-actions">

                        <button
                            type="button"
                            class="edit-task"
                            data-id="${task.id}"
                            title="Edit Task"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="delete-task"
                            data-id="${task.id}"
                            title="Delete Task"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                taskList.appendChild(
                    taskItem
                );

            }
        );


        setupTaskButtons();

    }


    // ========================================================
    // DATE FORMAT
    // ========================================================

    function formatDate(
        dateString
    ) {

        if (!dateString) {
            return "No date";
        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // ========================================================
    // PRIORITY CLASS
    // ========================================================

    function getPriorityClass(
        priority
    ) {

        if (
            priority ===
            "High"
        ) {

            return "high";

        }


        if (
            priority ===
            "Low"
        ) {

            return "low";

        }


        return "medium";

    }


    // ========================================================
    // STATUS CLASS
    // ========================================================

    function getStatusClass(
        status
    ) {

        if (
            status ===
            "In Progress"
        ) {

            return "progress";

        }


        if (
            status ===
            "Completed"
        ) {

            return "completed-status";

        }


        return "todo";

    }


    // ========================================================
    // TASK BUTTON EVENTS
    // ========================================================

    function setupTaskButtons() {

        // ====================================================
        // EDIT
        // ====================================================

        document
            .querySelectorAll(
                ".edit-task"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            openEditModal(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        // ====================================================
        // DELETE
        // ====================================================

        document
            .querySelectorAll(
                ".delete-task"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteTask(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        // ====================================================
        // COMPLETE
        // ====================================================

        document
            .querySelectorAll(
                ".complete-checkbox"
            )
            .forEach(
                function (checkbox) {

                    checkbox.addEventListener(
                        "change",
                        function () {

                            toggleTask(
                                checkbox.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // ========================================================
    // DELETE TASK
    // ========================================================

    function deleteTask(
        taskId
    ) {

        const confirmed =
            confirm(
                "Delete this task?"
            );


        if (!confirmed) {
            return;
        }


        let tasks =
            getTasks();


        const before =
            tasks.length;


        tasks =
            tasks.filter(
                function (task) {

                    return Number(
                        task.id
                    ) !==
                    Number(taskId);

                }
            );


        if (
            tasks.length ===
            before
        ) {

            showToast(
                "Task not found.",
                "error"
            );


            return;
        }


        saveTasks(
            tasks
        );


        displayTasks();


        updateStatistics();


        updateAnalytics();


        showToast(
            "Task deleted successfully!"
        );

    }


    // ========================================================
    // COMPLETE / UNCOMPLETE
    // ========================================================

    function toggleTask(
        taskId
    ) {

        const tasks =
            getTasks();


        const task =
            tasks.find(
                function (item) {

                    return Number(
                        item.id
                    ) ===
                    Number(taskId);

                }
            );


        if (!task) {

            showToast(
                "Task not found.",
                "error"
            );


            return;
        }


        if (
            task.status !==
            "Completed"
        ) {

            task.previousStatus =
                task.status ||
                "To Do";


            task.status =
                "Completed";


            showToast(
                "Task completed successfully!"
            );

        } else {

            task.status =
                task.previousStatus ||
                "To Do";


            delete task.previousStatus;


            showToast(
                "Task marked as active."
            );

        }


        saveTasks(
            tasks
        );


        displayTasks();


        updateStatistics();


        updateAnalytics();

    }


    // ========================================================
    // SEARCH
    // ========================================================

    if (searchTasks) {

        searchTasks.addEventListener(
            "input",
            displayTasks
        );

    }


    // ========================================================
    // STATUS FILTER
    // ========================================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            displayTasks
        );

    }


    // ========================================================
    // PRIORITY FILTER
    // ========================================================

    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            displayTasks
        );

    }


    // ========================================================
    // DUE DATE FILTER
    // ========================================================

    if (dueDateFilter) {

        dueDateFilter.addEventListener(
            "change",
            displayTasks
        );

    }


    // ========================================================
    // DASHBOARD STATISTICS
    // ========================================================

    function updateStatistics() {

        const tasks =
            getTasks();


        const total =
            tasks.length;


        const pending =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "To Do"
                    );

                }
            ).length;


        const progress =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "In Progress"
                    );

                }
            ).length;


        const completed =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "Completed"
                    );

                }
            ).length;


        const overdue =
            tasks.filter(
                function (task) {

                    return (
                        task.status !==
                            "Completed" &&
                        getDueDateStatus(
                            task
                        ) ===
                            "Overdue"
                    );

                }
            ).length;


        const totalElement =
            document.getElementById(
                "totalTasks"
            );


        const pendingElement =
            document.getElementById(
                "pendingTasks"
            );


        const progressElement =
            document.getElementById(
                "progressTasks"
            );


        const completedElement =
            document.getElementById(
                "completedTasks"
            );


        const overdueElement =
            document.getElementById(
                "overdueTasks"
            );


        if (totalElement) {

            totalElement.textContent =
                total;

        }


        if (pendingElement) {

            pendingElement.textContent =
                pending;

        }


        if (progressElement) {

            progressElement.textContent =
                progress;

        }


        if (completedElement) {

            completedElement.textContent =
                completed;

        }


        if (overdueElement) {

            overdueElement.textContent =
                overdue;

        }

    }


    // ========================================================
    // DASHBOARD ANALYTICS
    // ========================================================

    function updateAnalytics() {

        const tasks =
            getTasks();


        const total =
            tasks.length;


        const completed =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "Completed"
                    );

                }
            ).length;


        const active =
            tasks.filter(
                function (task) {

                    return (
                        task.status !==
                        "Completed"
                    );

                }
            ).length;


        const overdue =
            tasks.filter(
                function (task) {

                    return (
                        task.status !==
                            "Completed" &&
                        getDueDateStatus(
                            task
                        ) ===
                            "Overdue"
                    );

                }
            ).length;


        const upcoming =
            tasks.filter(
                function (task) {

                    return (
                        task.status !==
                            "Completed" &&
                        getDueDateStatus(
                            task
                        ) ===
                            "Upcoming"
                    );

                }
            ).length;


        const high =
            tasks.filter(
                function (task) {

                    return (
                        task.priority ===
                        "High"
                    );

                }
            ).length;


        const medium =
            tasks.filter(
                function (task) {

                    return (
                        task.priority ===
                        "Medium"
                    );

                }
            ).length;


        const low =
            tasks.filter(
                function (task) {

                    return (
                        task.priority ===
                        "Low"
                    );

                }
            ).length;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        total
                    ) *
                    100
                );


        // ====================================================
        // PROGRESS
        // ====================================================

        const completionPercent =
            document.getElementById(
                "completionPercent"
            );


        const completionProgress =
            document.getElementById(
                "completionProgress"
            );


        const completedAnalytics =
            document.getElementById(
                "completedAnalytics"
            );


        const remainingAnalytics =
            document.getElementById(
                "remainingAnalytics"
            );


        if (completionPercent) {

            completionPercent.textContent =
                percentage +
                "%";

        }


        if (completionProgress) {

            completionProgress.style.width =
                percentage +
                "%";

        }


        if (completedAnalytics) {

            completedAnalytics.textContent =
                completed;

        }


        if (remainingAnalytics) {

            remainingAnalytics.textContent =
                active;

        }


        // ====================================================
        // PRIORITY
        // ====================================================

        const highPriorityCount =
            document.getElementById(
                "highPriorityCount"
            );


        const mediumPriorityCount =
            document.getElementById(
                "mediumPriorityCount"
            );


        const lowPriorityCount =
            document.getElementById(
                "lowPriorityCount"
            );


        if (highPriorityCount) {

            highPriorityCount.textContent =
                high;

        }


        if (mediumPriorityCount) {

            mediumPriorityCount.textContent =
                medium;

        }


        if (lowPriorityCount) {

            lowPriorityCount.textContent =
                low;

        }


        // ====================================================
        // SUMMARY
        // ====================================================

        const summaryTotal =
            document.getElementById(
                "summaryTotal"
            );


        const summaryActive =
            document.getElementById(
                "summaryActive"
            );


        const summaryUpcoming =
            document.getElementById(
                "summaryUpcoming"
            );


        const summaryOverdue =
            document.getElementById(
                "summaryOverdue"
            );


        if (summaryTotal) {

            summaryTotal.textContent =
                total;

        }


        if (summaryActive) {

            summaryActive.textContent =
                active;

        }


        if (summaryUpcoming) {

            summaryUpcoming.textContent =
                upcoming;

        }


        if (summaryOverdue) {

            summaryOverdue.textContent =
                overdue;

        }


        // ====================================================
        // RECENT / UPCOMING
        // ====================================================

        renderRecentTasks(
            tasks
        );


        renderUpcomingTasks(
            tasks
        );

    }


    // ========================================================
    // RECENT TASKS
    // ========================================================

    function renderRecentTasks(
        tasks
    ) {

        const container =
            document.getElementById(
                "recentTasks"
            );


        if (!container) {
            return;
        }


        const recent =
            [...tasks]
                .sort(
                    function (a, b) {

                        return (
                            Number(b.id) -
                            Number(a.id)
                        );

                    }
                )
                .slice(
                    0,
                    5
                );


        if (
            recent.length ===
            0
        ) {

            container.innerHTML = `

                <div class="analytics-empty">

                    No tasks created yet.

                </div>

            `;


            return;
        }


        container.innerHTML =
            recent.map(
                function (task) {

                    return `

                        <div class="analytics-task">

                            <div class="analytics-task-main">

                                <p class="analytics-task-title">

                                    ${escapeHTML(
                                        task.title ||
                                        "Untitled Task"
                                    )}

                                </p>


                                <p class="analytics-task-date">

                                    ${
                                        task.dueDate
                                            ? "Due " +
                                              formatDate(
                                                  task.dueDate
                                              )
                                            : "No due date"
                                    }

                                </p>

                            </div>


                            <span
                                class="analytics-task-priority ${getPriorityClass(
                                    task.priority
                                )}"
                            >

                                ${escapeHTML(
                                    task.priority ||
                                    "Medium"
                                )}

                            </span>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // ========================================================
    // UPCOMING TASKS
    // ========================================================

    function renderUpcomingTasks(
        tasks
    ) {

        const container =
            document.getElementById(
                "upcomingTasks"
            );


        if (!container) {
            return;
        }


        const upcoming =
            tasks
                .filter(
                    function (task) {

                        return (
                            task.status !==
                                "Completed" &&
                            task.dueDate &&
                            (
                                getDueDateStatus(
                                    task
                                ) ===
                                    "Today" ||
                                getDueDateStatus(
                                    task
                                ) ===
                                    "Upcoming"
                            )
                        );

                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            a.dueDate.localeCompare(
                                b.dueDate
                            )
                        );

                    }
                )
                .slice(
                    0,
                    5
                );


        if (
            upcoming.length ===
            0
        ) {

            container.innerHTML = `

                <div class="analytics-empty">

                    No upcoming tasks.

                </div>

            `;


            return;
        }


        container.innerHTML =
            upcoming.map(
                function (task) {

                    return `

                        <div class="analytics-task">

                            <div class="analytics-task-main">

                                <p class="analytics-task-title">

                                    ${escapeHTML(
                                        task.title ||
                                        "Untitled Task"
                                    )}

                                </p>


                                <p class="analytics-task-date">

                                    ${
                                        getDueDateStatus(
                                            task
                                        ) ===
                                            "Today"
                                            ? "🟠 Due Today"
                                            : "📅 " +
                                              formatDate(
                                                  task.dueDate
                                              )
                                    }

                                </p>

                            </div>


                            <span
                                class="analytics-task-priority ${getPriorityClass(
                                    task.priority
                                )}"
                            >

                                ${escapeHTML(
                                    task.priority ||
                                    "Medium"
                                )}

                            </span>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
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


                showToast(
                    "Logged out successfully!"
                );


                setTimeout(
                    function () {

                        window.location.replace(
                            "login.html"
                        );

                    },
                    500
                );

            }
        );

    }


    // ========================================================
    // PROFILE
    // ========================================================

    if (currentUser) {

        const profileNames =
            document.querySelectorAll(
                "[data-user-name], .profile-name"
            );


        profileNames.forEach(
            function (element) {

                element.textContent =
                    currentUser.name;

            }
        );


        const profileEmails =
            document.querySelectorAll(
                "[data-user-email], .profile-email"
            );


        profileEmails.forEach(
            function (element) {

                element.textContent =
                    currentUser.email;

            }
        );


        const profileAvatars =
            document.querySelectorAll(
                ".profile-avatar"
            );


        profileAvatars.forEach(
            function (element) {

                element.textContent =
                    currentUser.name
                        .charAt(0)
                        .toUpperCase();

            }
        );

    }
    // ========================================================
// PROFILE - LOAD / UPDATE / CHANGE PASSWORD
// ========================================================

function loadProfilePage() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }


    // ====================================================
    // HEADER
    // ====================================================

    const headerName =
        document.getElementById("headerName");

    const headerAvatar =
        document.getElementById("headerAvatar");


    // ====================================================
    // PROFILE CARD
    // ====================================================

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileAvatar =
        document.getElementById("profileAvatar");


    // ====================================================
    // PROFILE FORM
    // ====================================================

    const profileNameInput =
        document.getElementById(
            "profileNameInput"
        );

    const profileEmailInput =
        document.getElementById(
            "profileEmailInput"
        );


    // ====================================================
    // HEADER NAME
    // ====================================================

    if (headerName) {

        headerName.textContent =
            user.name || "User";

    }


    // ====================================================
    // HEADER AVATAR
    // ====================================================

    if (headerAvatar) {

        headerAvatar.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();

    }


    // ====================================================
    // PROFILE NAME
    // ====================================================

    if (profileName) {

        profileName.textContent =
            user.name || "User";

    }


    // ====================================================
    // PROFILE EMAIL
    // ====================================================

    if (profileEmail) {

        profileEmail.textContent =
            user.email || "";

    }


    // ====================================================
    // PROFILE AVATAR
    // ====================================================

    if (profileAvatar) {

        profileAvatar.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();

    }


    // ====================================================
    // NAME INPUT
    // ====================================================

    if (profileNameInput) {

        profileNameInput.value =
            user.name || "";

    }


    // ====================================================
    // EMAIL INPUT
    // ====================================================

    if (profileEmailInput) {

        profileEmailInput.value =
            user.email || "";

    }

}



// ========================================================
// UPDATE PROFILE
// ========================================================

const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (!user) {

                showToast(
                    "Your session has expired. Please login again.",
                    "error"
                );

                return;
            }


            const nameInput =
                document.getElementById(
                    "profileNameInput"
                );


            if (!nameInput) {

                return;

            }


            const newName =
                nameInput.value.trim();


            // ====================================================
            // NAME VALIDATION
            // ====================================================

            if (!newName) {

                showToast(
                    "Please enter your name.",
                    "error"
                );


                nameInput.focus();


                return;
            }


            if (newName.length < 2) {

                showToast(
                    "Name must contain at least 2 characters.",
                    "error"
                );


                nameInput.focus();


                return;
            }


            // ====================================================
            // GET USERS
            // ====================================================

            const users =
                getUsers();


            const userIndex =
                users.findIndex(
                    function (account) {

                        return String(account.id) ===
                            String(user.id);

                    }
                );


            if (userIndex === -1) {

                showToast(
                    "Account not found.",
                    "error"
                );


                return;
            }


            // ====================================================
            // UPDATE NAME
            // ====================================================

            users[userIndex].name =
                newName;


            saveUsers(
                users
            );


            // ====================================================
            // UPDATE SESSION
            // ====================================================

            localStorage.setItem(
                "userName",
                newName
            );


            // ====================================================
            // REFRESH PROFILE
            // ====================================================

            loadProfilePage();


            // ====================================================
            // SUCCESS
            // ====================================================

            showToast(
                "Profile updated successfully!"
            );

        }
    );

}



// ========================================================
// CHANGE PASSWORD
// ========================================================

const changePasswordForm =
    document.getElementById(
        "changePasswordForm"
    );


if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (!user) {

                showToast(
                    "Your session has expired. Please login again.",
                    "error"
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

                showToast(
                    "Password form is incomplete.",
                    "error"
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

            if (!oldPassword) {

                showToast(
                    "Please enter your current password.",
                    "error"
                );


                oldPasswordInput.focus();


                return;
            }



            // ====================================================
            // CHECK CURRENT PASSWORD
            // ====================================================

            if (
                user.password !==
                oldPassword
            ) {

                showToast(
                    "Current password is incorrect.",
                    "error"
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

                showToast(
                    "New password must be at least 6 characters.",
                    "error"
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

                showToast(
                    "New passwords do not match.",
                    "error"
                );


                confirmPasswordInput.focus();


                return;
            }



            // ====================================================
            // SAME PASSWORD
            // ====================================================

            if (
                oldPassword ===
                newPassword
            ) {

                showToast(
                    "New password must be different from the current password.",
                    "error"
                );


                newPasswordInput.focus();


                return;
            }



            // ====================================================
            // GET USERS
            // ====================================================

            const users =
                getUsers();


            const userIndex =
                users.findIndex(
                    function (account) {

                        return String(account.id) ===
                            String(user.id);

                    }
                );


            if (userIndex === -1) {

                showToast(
                    "Account not found.",
                    "error"
                );


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
            // CLEAR PASSWORD FORM
            // ====================================================

            changePasswordForm.reset();



            // ====================================================
            // SUCCESS MESSAGE
            // ====================================================

            showToast(
                "Password changed successfully!"
            );

        }
    );

}



// ========================================================
// PROFILE LOGOUT
// ========================================================

const profileLogoutBtn =
    document.getElementById(
        "profileLogoutBtn"
    );


if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener(
        "click",
        function () {

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


            showToast(
                "Logged out successfully!"
            );


            setTimeout(
                function () {

                    window.location.replace(
                        "login.html"
                    );

                },
                600
            );

        }
    );

}



// ========================================================
// INITIALIZE PROFILE PAGE
// ========================================================

if (
    currentPage ===
    "profile.html"
) {

    loadProfilePage();

}

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    if (
        currentPage ===
        "dashboard.html"
    ) {

        displayTasks();


        updateStatistics();


        updateAnalytics();

    }

});