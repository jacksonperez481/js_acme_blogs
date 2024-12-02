function createElemWithText(elementName = "p", textContent = "", className) {
    // Create an element with the specified tag name
    const element = document.createElement(elementName);
    element.textContent = textContent; // Set its text content
    if (className) element.className = className;
    return element;
}

function createSelectOptions(users) {
    // confrim input
    if (!users || !Array.isArray(users)) return undefined;
    // create/ return an array of <option> elements
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

function toggleCommentSection(postId) {
    // Check if postId is provided
    if (!postId) return undefined;
    // Toggle the visibility of the section associated with the postId
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) section.classList.toggle("hide");
    return section;
}

function toggleCommentButton(postId) {
    // check if postid is provided
    if (!postId) return undefined;
    // toggle the button text associated with the postId
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button) {
        button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    }
    return button;
}

function deleteChildElements(parentElement) {
  
    if (!parentElement || !(parentElement instanceof HTMLElement)) return undefined;
    
    while (parentElement.lastElementChild) {
        parentElement.removeChild(parentElement.lastElementChild);
    }
    return parentElement;
}

function handleClick(event) {
    // get postid
    const postId = event.target.dataset.postId;
    
    toggleComments(event, postId);
}

function addButtonListeners() {
    // Select all buttons within the main element
    const buttons = document.querySelectorAll("main button");
    if (!buttons || buttons.length === 0) return buttons; 
    // add a click event listener to each button
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", event => toggleComments(event, postId));
        }
    });
    return buttons;
}

function removeButtonListeners() {
   
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) button.removeEventListener("click", handleClick);
    });
    return buttons;
}

function toggleComments(event, postId) {
    // confirm event and postid
    if (!event || !postId) return undefined;
    event.preventDefault(); 
    // toggle comment section
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

function createComments(comments) {
    // validate the comments input
    if (!comments || !Array.isArray(comments)) return undefined;
    // create and populate a DocumentFragment with comments
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const bodyP = createElemWithText("p", comment.body);
        const emailP = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, bodyP, emailP);
        fragment.appendChild(article);
    });
    return fragment;
}

function populateSelectMenu(users) {
    // confirm user input
    if (!users || !Array.isArray(users)) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    if (!selectMenu) return undefined; // ensure the selectMenu exists
    
    const options = createSelectOptions(users);
    options.forEach(option => {
        selectMenu.appendChild(option);
    });
    return selectMenu;
}

async function getUsers() {
    const apiUrl = "https://jsonplaceholder.typicode.com/users";
    //  get user data from API
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json(); // return fetched user data
    } catch (error) {
        console.error("Error fetching users:", error);
        return undefined;
    }
}

async function getUserPosts(userId) {
    //  confirm userid
    if (!userId) return undefined;
    const apiUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    // get posts for given userID
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching posts for userId ${userId}:`, error);
        return undefined;
    }
}

async function getUser(userId) {
    //  confirm userid
    if (!userId) return undefined;
    const apiUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
    //  get user data for given id
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching user with userId ${userId}:`, error);
        return undefined;
    }
}

async function getPostComments(postId) {
    // confirm postid
    if (!postId) return undefined;
    const apiUrl = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
    //  display comments for given postid
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching comments for postId ${postId}:`, error);
        return undefined;
    }
}

async function displayComments(postId) {
    // confirm postid
    if (!postId) return undefined;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    //  display comments for given postid
    try {
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.appendChild(fragment);
    } catch (error) {
        console.error(`Error displaying comments for postId ${postId}:`, error);
    }
    return section;
}

async function createPosts(posts) {
    // confirm posts data
    if (!posts || !Array.isArray(posts)) return undefined;
    const fragment = document.createDocumentFragment();
    // create articles for each post
    for (const post of posts) {
        const article = document.createElement("article");
        const title = createElemWithText("h2", post.title);
        const body = createElemWithText("p", post.body);
        const postId = createElemWithText("p", `Post ID: ${post.id}`);
        const user = await getUser(post.userId);
        const author = createElemWithText("p", `Author: ${user.name} with ${user.company.name}`);
        const catchPhrase = createElemWithText("p", user.company.catchPhrase);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        const commentsSection = await displayComments(post.id);
        article.append(title, body, postId, author, catchPhrase, button, commentsSection);
        fragment.appendChild(article);
    }
    return fragment;
}

async function displayPosts(posts) {
    const main = document.querySelector("main");
    if (!main) return undefined;
    main.innerHTML = "";
    const element = posts && posts.length
        ? await createPosts(posts)
        : createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    main.appendChild(element);
    return element;
}

async function refreshPosts(posts) {
    if (!posts || !Array.isArray(posts)) return undefined;
    const removeButtons = removeButtonListeners();
    const main = document.querySelector("main");
    if (!main) return undefined;
    const mainCleared = deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, mainCleared, fragment, addButtons];
}

async function selectMenuChangeEventHandler(event) {
    if (!event || !event.target) return undefined;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = parseInt(selectMenu.value) || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    if (selectMenu) {
        selectMenu.addEventListener("change", selectMenuChangeEventHandler);
    }
}

document.addEventListener("DOMContentLoaded", initApp);
