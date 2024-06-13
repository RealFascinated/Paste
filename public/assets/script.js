// Handle custom key binds behavior
document.addEventListener("keydown", function (event) {
  // Upload the paste when Ctrl + Enter is pressed
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    upload();
  }

  // Upload the paste when Ctrl + S is pressed
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    upload();
  }
});

// Upload the paste when the paste button is clicked
document.getElementById("paste-button").addEventListener("click", () => upload());

// Upload the paste to the server
const upload = async () => {
  var pasteInput = document.getElementById("paste-input");
  var paste = pasteInput.value;

  if (!paste || paste.trim() === "") {
    pasteInput.focus();
    toast("Please enter a paste to upload.");
    return;
  }

  console.log("Uploading paste...");
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: paste,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    window.location.href = "/" + data.key;
  } catch (error) {
    console.error("Error:", error);
    toast(`${error.message || "An error occurred while uploading the paste."}`);
  }
};

const toast = (message, duration = 3000) => {
  Toastify({
    text: message,
    duration: duration,
    gravity: "bottom",
    position: "right",
  }).showToast();
};
