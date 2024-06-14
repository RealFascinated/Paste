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
