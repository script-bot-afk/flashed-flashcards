const saveButton = document.getElementById("saveCard");
const cardContainer =
  document.getElementById("cardContainer");

let flashcards =
  JSON.parse(localStorage.getItem("flashcards")) || [];

renderCards();

saveButton?.addEventListener("click", () => {

  const subject =
    document.getElementById("subject").value;

  const question =
    document.getElementById("question").value;

  const answer =
    document.getElementById("answer").value;

  if (!question || !answer) return;

  flashcards.push({
    subject,
    question,
    answer
  });

  localStorage.setItem(
    "flashcards",
    JSON.stringify(flashcards)
  );

  document.getElementById("question").value = "";
  document.getElementById("answer").value = "";

  renderCards();
});

function renderCards() {

  if (!cardContainer) return;

  cardContainer.innerHTML = "";

  flashcards.forEach(card => {

    const div = document.createElement("div");

    div.className = "flashcard";

    let flipped = false;

    div.innerHTML = `
      <p class="subject-label">
        ${card.subject}
      </p>

      <h3>${card.question}</h3>
      <p>Click to reveal answer</p>
    `;

    div.addEventListener("click", () => {

      flipped = !flipped;

      div.innerHTML = flipped
        ? `
        <p class="subject-label">
          ${card.subject}
        </p>

        <h3>Answer</h3>
        <p>${card.answer}</p>
      `
        : `
        <p class="subject-label">
          ${card.subject}
        </p>

        <h3>${card.question}</h3>
        <p>Click to reveal answer</p>
      `;
    });

    cardContainer.appendChild(div);
  });
}
