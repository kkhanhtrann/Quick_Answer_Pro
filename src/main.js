const { invoke } = window.__TAURI__.tauri;

// Element selectors
const dropImage = document.getElementById("picture-drop");
const file = document.getElementById("loading-input");
const image = document.getElementById("picture-view");
const outsideBody = document.getElementById("whole-app");
const questionAns = document.getElementById("ans-box");
const loader = document.getElementById("loader");

let loadMsgEl;
let questionImg;
let response;

// Function to greet
async function greet() {
  //greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

// Event listener for DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  loadMsgEl = document.querySelector("#loading-msg");
  // Add event listener to the form submission
  document.querySelector("#question-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission
    loadMsgEl.textContent = "Loading ..."
    submit_question(); // Call submit_question function
  });
});

// Event listener for return to original page
window.addEventListener("DOMContentLoaded", () => {
  // Retrieve response from sessionStorage
  response = sessionStorage.getItem("response");

  if (response) {
    // Display the response in the questionAns element
    questionAns.textContent = response;
  }

  document.getElementById("home-button").addEventListener("click", () => {
    // Clean up the storage and return to the original page
    sessionStorage.removeItem("response");
    window.location.assign("index.html");
  });
});

// Function to send question
async function submit_question() {
  // Set box shadows to indicate processing
  dropImage.style.boxShadow = "inset 0 0 0 2000px rgba(34, 34, 34, 0.3)";
  image.style.boxShadow = "inset 0 0 0 2000px rgba(34, 34, 34, 0.3)";
  loader.style.display = "grid"; // Show loader

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Image = reader.result.replace("data:", "").replace(/^.+,/, "");
    try {
      // Use Tauri's invoke to call the "submit_question" command in Rust
      response = await invoke("submit_question", { imageBase64: base64Image });
      sessionStorage.setItem('response', response);
      window.location.assign("answer.html");
    } catch (error) {
      console.error('Error:', error);
      response = 'Failed to process image.';
      sessionStorage.setItem('response', response);
      window.location.assign("answer.html");
    }
  };
  reader.readAsDataURL(file.files[0]); // Read the file as a data URL
}

// ======================= DRAG AND DROP ======================= //

// Function to upload and display the image
function uploadImage() {
  let submitButton = document.getElementById("submit-button");
  submitButton.disabled = false; // Enable the submit button
  let imageLink = URL.createObjectURL(file.files[0]);
  image.style.backgroundImage = `url(${imageLink})`;

  // Remove the img element
  var imgElement = document.getElementById('uploadIcon');
  if (imgElement) {
    image.removeChild(imgElement);
  }

  // Remove the p element
  var pElement = image.querySelector('p');
  if (pElement) {
    image.removeChild(pElement);
  }
  image.style.border = 0;
  dropImage.style.backgroundColor = "#E5E5E5"; // Reset background color
}

// Event listener for file input change
file.addEventListener("change", uploadImage);

// Drag and drop event listeners
dropImage.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropImage.style.backgroundColor = "#A8ACFF"; // Change background color on drag over
});

dropImage.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropImage.style.backgroundColor = "#E5E5E5"; // Reset background color on drag leave
});

dropImage.addEventListener("drop", (e) => {
  e.preventDefault();
  file.files = e.dataTransfer.files; // Set file input files to dropped files
  uploadImage(); // Call uploadImage function
});

outsideBody.addEventListener("dragover", (e) => {
  e.preventDefault();
});

outsideBody.addEventListener("drop", (e) => {
  e.preventDefault();
  file.files = e.dataTransfer.files; // Set file input files to dropped files
  uploadImage(); // Call uploadImage function
});

["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(
  eventType => document.addEventListener("dragover", (e) => {
    e.preventDefault();
  }));


["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(
  eventType => document.addEventListener("drop", (e) => {
    e.preventDefault();
    file.files = e.dataTransfer.files; // Set file input files to dropped files
    uploadImage(); // Call uploadImage function
  }));