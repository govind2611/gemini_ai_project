document.getElementById("aiForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("response");
  const submitButton = document.querySelector("button[type='submit']");
  const loader = document.createElement("div");
  loader.className = "loader";
  document.querySelector(".container").appendChild(loader);

  responseDiv.style.display = "none";
  submitButton.style.display = "none";
  loader.style.display = "block";

  try {
    const response = await fetch("https://gemini-ai-project.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    if (response.ok) {
      const formattedText = formatResponse(data.result);
      responseDiv.innerHTML = formattedText;
    } else {
      responseDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
    }
  } catch (error) {
    responseDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }

  loader.style.display = "none";
  responseDiv.style.display = "block";
  submitButton.style.display = "inline-block";
});

/**
 * Formats the response text by converting Markdown-like symbols to HTML.
 * @param {string} text - The response text to format.
 * @returns {string} - The formatted HTML string.
 */
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (match, p1, p2) => {
      const trimmedText = p1.trim();
      const trimmedUrl = p2.trim();
      return `<a href="${trimmedUrl}" target="_blank">${trimmedText}</a>`;
    })
    .replace(/\s+/g, " ")
    .trim();
}
