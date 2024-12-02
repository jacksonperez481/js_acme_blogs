function createElemWithText(elementName = "p", textContent = "", className) {
    // Create the element
    const element = document.createElement(elementName);

    // Set the text content
    element.textContent = textContent;

    // Add the class name if provided
    if (className) {
        element.className = className;
    }

    // Return the created element
    return element;
}

function createSelectOptions(users) {
    // Step 1: Return undefined if no parameter is provided or it's not an array
    if (!users || !Array.isArray(users)) return undefined;

    // Step 2: Map over the users array to create <option> elements
    const options = users.map(user => {
        const option = document.createElement("option"); // Create an <option> element
        option.value = user.id; // Set the value to the user's id
        option.textContent = user.name; // Set the text content to the user's name
        return option; // Return the created <option> element
    });

    // Step 3: Return the array of options
    return options;
}


function toggleCommentSection(postId) {
    if (!postId) return undefined; // Return undefined if no postId is provided

    // Select the section element with the matching data-post-id attribute
    const section = document.querySelector(`section[data-post-id="${postId}"]`);

    // Verify the section exists
    if (section) {
        section.classList.toggle("hide"); // Toggle the 'hide' class
    }

    // Return the section element
    return section;
}

function toggleCommentButton(postId) {
    if (!postId) return undefined; // Return undefined if no postId is provided

    // Select the button element with the matching data-post-id attribute
    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    // Verify the button exists
    if (button) {
        // Toggle the button text content
        button.textContent =
            button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    }

    // Return the button element
    return button;
}

function deleteChildElements(parentElement) {
    if (!parentElement || !(parentElement instanceof HTMLElement)) return undefined; // Validate input

    let child = parentElement.lastElementChild; // Get the last child element
    while (child) {
        parentElement.removeChild(child); // Remove the child element
        child = parentElement.lastElementChild; // Update the last child
    }

    return parentElement; // Return the parent element
}

// Shared event handler function
function handleClick(event) {
    const postId = event.target.dataset.postId; // Get the postId from the button
    toggleComments(event, postId); // Call toggleComments with event and postId
}

// addButtonListeners function
function addButtonListeners() {
    // Select all button elements within the main element
    const buttons = document.querySelectorAll("main button");

    // If no buttons are found, return an empty NodeList
    if (!buttons || buttons.length === 0) {
        console.log("No buttons found in the main element.");
        return buttons; // Return an empty NodeList
    }

    // Iterate through each button element
    buttons.forEach(button => {
        const postId = button.dataset.postId; // Check for the data-postId attribute
        if (postId) {
            button.addEventListener("click", (event) => toggleComments(event, postId));
        } else {
            console.log("Button skipped due to missing data-postId:", button);
        }
    });

    // Return the NodeList of buttons
    return buttons;
}



// removeButtonListeners function
function removeButtonListeners() {
    // Select all buttons within the main element
    const buttons = document.querySelectorAll("main button");

    // Remove event listener from each button with a valid postId
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", handleClick); // Use shared handler
        }
    });

    return buttons; // Return the NodeList of buttons
}

// Placeholder for toggleComments function
function toggleComments(event, postId) {
    event.target.listener = true; // For testing purposes
    console.log(`toggleComments called with postId: ${postId}`);
}

function createComments(comments) {
    if (!comments || !Array.isArray(comments)) return undefined; // Validate input

    // Create a DocumentFragment to hold the comments
    const fragment = document.createDocumentFragment();

    // Loop through the comments data
    comments.forEach(comment => {
        // Create an article element
        const article = document.createElement("article");

        // Create child elements using createElemWithText
        const h3 = createElemWithText("h3", comment.name);
        const bodyP = createElemWithText("p", comment.body);
        const emailP = createElemWithText("p", `From: ${comment.email}`);

        // Append the elements to the article
        article.append(h3, bodyP, emailP);

        // Append the article to the fragment
        fragment.appendChild(article);
    });

    return fragment; // Return the completed DocumentFragment
}

function populateSelectMenu(users) {
    if (!users || !Array.isArray(users)) return undefined; // Validate input

    // Select the #selectMenu element
    const selectMenu = document.getElementById("selectMenu");
    if (!selectMenu) return undefined; // Return undefined if menu is not found

    // Generate option elements using createSelectOptions
    const options = createSelectOptions(users);

    // Append each option to the select menu
    options.forEach(option => {
        selectMenu.appendChild(option);
    });

    return selectMenu; // Return the select menu element
}

async function getUsers() {
    const apiUrl = "https://jsonplaceholder.typicode.com/users";

    try {
        // Fetch user data from the API
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON data
        const users = await response.json();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return undefined; // Return undefined if an error occurs
    }
}

async function getUserPosts(userId) {
    if (!userId) return undefined; // Return undefined if no userId is provided

    const apiUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

    try {
        // Fetch posts data for the given userId
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON data
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error(`Error fetching posts for userId ${userId}:`, error);
        return undefined; // Return undefined if an error occurs
    }
}

async function getUser(userId) {
    if (!userId) return undefined; // Return undefined if no userId is provided

    const apiUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;

    try {
        // Fetch user data for the given userId
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON data
        const user = await response.json();
        return user;
    } catch (error) {
        console.error(`Error fetching user with userId ${userId}:`, error);
        return undefined; // Return undefined if an error occurs
    }
}

async function getPostComments(postId) {
    if (!postId) return undefined; // Return undefined if no postId is provided

    const apiUrl = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;

    try {
        // Fetch comments data for the given postId
        const response = await fetch(apiUrl);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON data
        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error(`Error fetching comments for postId ${postId}:`, error);
        return undefined; // Return undefined if an error occurs
    }
}

async function displayComments(postId) {
    if (!postId) return undefined; // Return undefined if no postId is provided

    // Create a section element
    const section = document.createElement("section");

    // Set attributes and classes for the section
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");

    try {
        // Fetch comments data for the given postId
        const comments = await getPostComments(postId);

        // Generate comment elements and append to the section
        const fragment = createComments(comments);
        section.appendChild(fragment);
    } catch (error) {
        console.error(`Error displaying comments for postId ${postId}:`, error);
    }

    return section; // Return the section element
}

async function createPosts(posts) {
    // Step 1: Log the posts data for debugging
    console.log("Posts data received in createPosts:", posts);

    // Step 2: Validate the input
    if (!posts || !Array.isArray(posts)) {
        console.error("Invalid or missing posts data.");
        return undefined;
    }

    // Step 3: Create a DocumentFragment to hold the articles
    const fragment = document.createDocumentFragment();

    // Step 4: Loop through the posts data
    for (const post of posts) {
        // Create an article element
        const article = document.createElement("article");

        // Create and append elements
        const title = createElemWithText("h2", post.title); // Post title
        const body = createElemWithText("p", post.body); // Post body
        const postId = createElemWithText("p", `Post ID: ${post.id}`); // Post ID

        // Fetch user data
        const user = await getUser(post.userId); // Get user info
        const author = createElemWithText("p", `Author: ${user.name} with ${user.company.name}`); // Author info
        const catchPhrase = createElemWithText("p", user.company.catchPhrase); // Company catchphrase

        // Create a button
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id; // Add post ID as data attribute

        // Fetch and append the comments section
        const commentsSection = await displayComments(post.id);

        // Append all elements to the article
        article.append(title, body, postId, author, catchPhrase, button, commentsSection);

        // Append the article to the fragment
        fragment.appendChild(article);
    }

    // Step 5: Log the number of articles created for debugging
    console.log("Number of articles created:", fragment.childNodes.length);

    // Step 6: Return the completed DocumentFragment
    return fragment;
}

async function displayPosts(posts) {
    // Select the main element
    const main = document.querySelector("main");
    if (!main) {
        console.error("Main element not found.");
        return undefined; // Return undefined if no main element exists
    }

    // Clear the main element's content
    main.innerHTML = "";

    // Determine what to append to the main element
    let element;
    if (posts && posts.length) {
        console.log(`Number of posts to display: ${posts.length}`);
        element = await createPosts(posts); // Generate articles for the posts
    } else {
        console.log("No posts data provided.");
        element = createElemWithText("p", "Select an Employee to display their posts.", "default-text");
    }

    // Append the element (document fragment or paragraph) to the main element
    main.appendChild(element);

    // Debugging: Check the child nodes of the main element
    console.log("Number of child nodes in main after appending:", main.childElementCount);

    // Return the appended element
    return element;
}


function toggleComments(event, postId) {
    // Step 1: Check if the event and postId are provided
    if (!event || !postId) {
        console.error("toggleComments: Missing event or postId.");
        return undefined;
    }

    // Step 2: Prevent the default action for the event
    if (event.preventDefault) {
        event.preventDefault(); // Ensure event.preventDefault is called safely
    } else {
        console.warn("toggleComments: event.preventDefault is not available.");
    }

    // Step 3: Call toggleCommentSection and toggleCommentButton
    const section = toggleCommentSection(postId); // Hide or show the comments section
    const button = toggleCommentButton(postId); // Update button text

    // Step 4: Log the results for debugging
    console.log("Section:", section);
    console.log("Button:", button);

    // Step 5: Return the results as an array
    return [section, button];
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
    if (!event || !event.target) {
        console.error("Invalid event or event.target is missing.");
        return undefined; // Ensure function exits if no valid event is provided
    }

    try {
        const selectMenu = event.target; // The event target is the select menu
        selectMenu.disabled = true; // Disable the select menu during processing

        const userId = parseInt(selectMenu.value) || 1; // Extract the userId from the select menu value
        console.log("User ID selected:", userId); // Debugging

        const posts = await getUserPosts(userId); // Fetch posts for the selected user
        console.log("Fetched posts:", posts); // Debugging

        if (!posts || !Array.isArray(posts)) {
            console.error("Failed to fetch valid posts.");
            selectMenu.disabled = false; // Re-enable the select menu
            return undefined; // Exit early if posts are invalid
        }

        const refreshPostsArray = await refreshPosts(posts); // Refresh posts on the page
        console.log("Results from refreshPosts:", refreshPostsArray); // Debugging

        selectMenu.disabled = false; // Re-enable the select menu after processing

        return [userId, posts, refreshPostsArray]; // Return the expected array
    } catch (error) {
        console.error("Error in selectMenuChangeEventHandler:", error);
        return undefined; // Return undefined in case of an error
    }
}




async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

function initApp() {
    initPage(); // Initialize the page content

    const selectMenu = document.getElementById("selectMenu");
    if (selectMenu) {
        selectMenu.addEventListener("change", selectMenuChangeEventHandler); // Add event listener for menu change
    }
}


document.addEventListener("DOMContentLoaded", initApp);





























