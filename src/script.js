import "./style.css";

// Komponen Loading Indicator
class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.style.display = "none";
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 20px;
                    color: #333;
                    z-index: 1000;
                }
            </style>
            <div class="loading">Loading...</div>
        `;
  }

  show() {
    this.style.display = "block";
  }

  hide() {
    this.style.display = "none";
  }
}

customElements.define("loading-indicator", LoadingIndicator);

// Komponen lainnya
class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}
customElements.define("app-bar", AppBar);

class Welcome extends HTMLElement {
  connectedCallback() {
    const inputName = prompt("Insert your name:");
    const name = inputName ? inputName : "Guest";
    this.innerHTML = `<h2>Hello, ${name} ini catatanmu!</h2>`;
    this.style.textAlign = "center";
    this.style.color = "#333";
    this.style.fontFamily = "Arial, sans-serif";
  }
}
customElements.define("my-welcome", Welcome);

class CurrentDate extends HTMLElement {
  connectedCallback() {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("id-ID", options);
    this.innerHTML = `Tanggal: ${formattedDate}`;
  }
}
customElements.define("current-date", CurrentDate);

const noteForm = document.getElementById("note-form");
const notesContainer = document.getElementById("notes-container");
const loadingIndicator = document.querySelector("loading-indicator");

async function fetchNotes() {
  try {
    loadingIndicator.show();
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  } finally {
    loadingIndicator.hide();
  }
}

async function displayNotes() {
  const notes = await fetchNotes();
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
        `;
    notesContainer.appendChild(noteItem);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const noteId = event.target.getAttribute("data-id");
      await deleteNote(noteId);
      displayNotes();
    });
  });
}
async function deleteNote(noteId) {
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
      method: "DELETE",
    });

    // Memeriksa apakah respons berhasil
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.message); // Menampilkan pesan dari respons
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  try {
    loadingIndicator.show();
    await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });
    document.getElementById("title").value = "";
    document.getElementById("body").value = "";
    displayNotes();
  } catch (error) {
    console.error("Error adding note:", error);
  } finally {
    loadingIndicator.hide();
  }
});

// Initial fetch and display of notes
displayNotes();