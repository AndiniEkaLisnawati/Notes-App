import { notesData } from "./NotesData.js";
class AppBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h1>Notes App</h1>`;
    }
}
customElements.define('app-bar', AppBar);



class Welcome extends HTMLElement {
    connectedCallback() {
        const inputName = prompt("Insert your name:");
        
        // Menangani kasus di mana pengguna tidak memasukkan nama
        const name = inputName ? inputName : "Guest";
        
        this.innerHTML = `<h2>Hello, ${name}!</h2>`;
        
        // Menambahkan beberapa styling
        this.style.textAlign = "center";
        this.style.color = "#333";
        this.style.fontFamily = "Arial, sans-serif";
    }
}

customElements.define('my-welcome', Welcome);

class CurrentDate extends HTMLElement {
    connectedCallback() {
        const today = new Date(); // Mendapatkan tanggal saat ini
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Opsi format tanggal
        const formattedDate = today.toLocaleDateString('id-ID', options); // Format tanggal sesuai lokal

        this.innerHTML = `Tanggal: ${formattedDate}`; // Menampilkan tanggal
    }
}

customElements.define('current-date', CurrentDate); // Mendaftarkan custom element

// Ambil elemen dari DOM
const noteForm = document.getElementById('note-form');
const notesContainer = document.getElementById('notes-container');

// Data dummy dari notes.js
const dataDummy = notesData;

// Fungsi untuk menampilkan catatan
function displayNotes() {
    notesContainer.innerHTML = ''; // Kosongkan kontainer sebelum menampilkan catatan
    notesData.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
        `;
        notesContainer.appendChild(noteItem);
    });
}

// Event listener untuk menangani pengiriman formulir
noteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah pengiriman formulir yang default

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    // Tambahkan catatan baru ke data
    notesData.push({ title, body });

    // Reset formulir
    noteForm.reset();

    // Tampilkan catatan yang diperbarui
    displayNotes();
});

// Tampilkan catatan awal (jika ada)
displayNotes();