hljs.highlightAll(); // Highlight the code block
hljs.initLineNumbersOnLoad(); // Add line numbers to the code block

// Custom select all behavior to select all the content inside the <pre> block
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "a") {
    event.preventDefault(); // Prevent the default select all behavior

    // Select all the content inside the <pre> block
    const preBlock = document.querySelector("pre");
    const range = document.createRange();
    range.selectNodeContents(preBlock);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// Set the expires text
document.addEventListener("DOMContentLoaded", function () {
  const expires = document.getElementById("expires");
  if (expires != undefined) {
    const expiresContent = expires.textContent;
    if (expiresContent == 0) {
      const expiresParent = expires.parentElement;
      expiresParent.style.display = "none";
      return;
    }
    console.log(expiresContent);

    expires.textContent = moment.unix(Number(expiresContent) / 1000).fromNow();
  }
});
