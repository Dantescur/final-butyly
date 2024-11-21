import "./style.css";

const form = document.getElementById("url-form") as HTMLFormElement;
const originalUrlInput = document.getElementById(
	"originalUrl",
) as HTMLInputElement;
const expirationInput = document.getElementById(
	"expiration",
) as HTMLInputElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;
const shortUrlSpan = document.getElementById("shortUrl") as HTMLSpanElement;
const expiresInSpan = document.getElementById("expiresIn") as HTMLSpanElement;
const shortUrlLink = document.getElementById(
	"shortUrlLink",
) as HTMLAnchorElement;

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const originalUrl = originalUrlInput.value;
	const expiration = expirationInput.value;

	try {
		const response = await fetch("http://localhost:3000/shorten", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				originalUrl,
				expiration,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			resultDiv.style.display = "block";
			shortUrlSpan.textContent = data.shortUrl;
			shortUrlLink.href = data.shortUrl;
			expiresInSpan.textContent = data.expiresIn;
		} else {
			alert(`Error: ${data.error}`);
		}
	} catch (error) {
		console.error("Error:", error);
		alert("An unexpected error occurred. Please try again later.");
	}
});
