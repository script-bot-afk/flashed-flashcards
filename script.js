// ==========================
// ELEMENTS
// ==========================

const saveButton =
  document.getElementById("saveCard");

const cardContainer =
  document.getElementById(
    "cardContainer"
  );

const generateButton =
  document.getElementById(
    "generateAI"
  );

// ==========================
// STORAGE
// ==========================

let flashcards =
  JSON.parse(
    localStorage.getItem(
      "flashcards"
    )
  ) || [];

renderCards();

// ==========================
// MANUAL FLASHCARD CREATION
// ==========================

saveButton?.addEventListener(
  "click",
  () => {

    const subject =
      document.getElementById(
        "subject"
      ).value;

    const question =
      document.getElementById(
        "question"
      ).value.trim();

    const answer =
      document.getElementById(
        "answer"
      ).value.trim();

    if (
      !question ||
      !answer
    ) {
      alert(
        "Fill out both fields!"
      );
      return;
    }

    flashcards.push({
      subject,
      question,
      answer
    });

    saveFlashcards();

    document.getElementById(
      "question"
    ).value = "";

    document.getElementById(
      "answer"
    ).value = "";

    renderCards();
  }
);

// ==========================
// AI FLASHCARD GENERATION
// ==========================

generateButton?.addEventListener(
  "click",
  async () => {

    const notes =
      document
        .getElementById(
          "studyNotes"
        )
        .value
        .trim();

    if (!notes) {
      alert(
        "Paste some notes first!"
      );
      return;
    }

    try {

      generateButton.textContent =
        "Generating...";

      generateButton.disabled =
        true;

      const response =
        await fetch(
          "https://api.x.ai/v1/chat/completions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                "Bearer xai-2lZyN2AE5cKL1z1F0FfbuOAdWFtaB3W12D7WaiO2cHcS8bJVwRcwmbjoY66OpPvhXVg23yjJTjjlrtK9"
            },

            body: JSON.stringify({
              model:
                "grok-3-mini",

              messages: [
                {
                  role: "system",

                  content: `
You generate study flashcards.

Return ONLY raw JSON.

No markdown.
No explanation.
No extra text.

Example format:

[
  {
    "question":"What is photosynthesis?",
    "answer":"The process plants use to convert sunlight into energy."
  }
]
`
                },

                {
                  role: "user",

                  content:
                    `Turn these study notes into flashcards:

${notes}`
                }
              ],

              temperature:
                0.5
            })
          }
        );

      if (!response.ok) {
        throw new Error(
          "API request failed"
        );
      }

      const data =
        await response.json();

      const rawText =
        data.choices?.[0]
          ?.message?.content;

      if (!rawText) {
        throw new Error(
          "No AI response"
        );
      }

      // Remove markdown wrappers if model adds them
      const cleanedText =
        rawText
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      const aiCards =
        JSON.parse(
          cleanedText
        );

      aiCards.forEach(
        card => {

          flashcards.push({
            subject:
              "AI Generated",

            question:
              card.question,

            answer:
              card.answer
          });
        }
      );

      saveFlashcards();
      renderCards();

      alert(
        `Generated ${aiCards.length} flashcards!`
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to generate flashcards."
      );

    } finally {

      generateButton.textContent =
        "Generate Flashcards";

      generateButton.disabled =
        false;
    }
  }
);

// ==========================
// RENDER FLASHCARDS
// ==========================

function renderCards() {

  if (!cardContainer)
    return;

  cardContainer.innerHTML =
    "";

  flashcards.forEach(
    card => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "flashcard";

      let flipped =
        false;

      renderFront();

      div.addEventListener(
        "click",
        () => {

          flipped =
            !flipped;

          flipped
            ? renderBack()
            : renderFront();
        }
      );

      function renderFront() {

        div.innerHTML = `
          <p class="subject-label">
            ${card.subject}
          </p>

          <h3>
            ${card.question}
          </h3>

          <p>
            Click to reveal answer
          </p>
        `;
      }

      function renderBack() {

        div.innerHTML = `
          <p class="subject-label">
            ${card.subject}
          </p>

          <h3>
            Answer
          </h3>

          <p>
            ${card.answer}
          </p>
        `;
      }

      cardContainer.appendChild(
        div
      );
    }
  );
}

// ==========================
// SAVE STORAGE
// ==========================

function saveFlashcards() {

  localStorage.setItem(
    "flashcards",
    JSON.stringify(
      flashcards
    )
  );
}
