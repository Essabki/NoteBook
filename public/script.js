/* ELEMENTS */
const avatar = document.getElementById("avatar");
const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");
const plus = document.getElementById("plus");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");
const textInput = document.getElementById("text");
const list = document.getElementById("list");
const saveBtn = document.getElementById("save");
const toggle = document.getElementById("toggle");
const searchInput = document.getElementById("search");

/* STATE */
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let imageData = "";
let editIndex = null;

/* IMAGE UPLOAD */
avatar.onclick = () => imgInput.click();

imgInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imageData = reader.result;
    preview.src = imageData;
    plus.style.display = "none";
  };
  reader.readAsDataURL(file);
};

/* TEXT → LIST (FIX) */
function textToList(text) {
  const lines = text.split("\n");
  let html = "<ul style='padding-left:18px;margin-top:6px'>";
  lines.forEach(line => {
    if (line.trim() !== "") {
      html += `<li>${line}</li>`;
    }
  });
  html += "</ul>";
  return html;
}

/* SAVE NOTE */
saveBtn.onclick = () => {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    alert("Name and note required");
    return;
  }

  const note = {
    name,
    number: numberInput.value,
    text,
    imageData
  };

  if (editIndex !== null) {
    notes[editIndex] = note;
    editIndex = null;
  } else {
    notes.push(note);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  resetForm();
  render();
};

/* RENDER NOTES */
function render() {
  const q = searchInput.value.toLowerCase();
  list.innerHTML = "";

  notes
    .filter(n => n.name.toLowerCase().includes(q))
    .forEach((n, i) => {
      list.innerHTML += `
        <div class="note-item">
          <img src="${n.imageData || ''}">
          <div style="flex:1">
            <b>${n.name}</b><br>
            <small>${n.number}</small>
            ${textToList(n.text)}
          </div>
          <div class="actions">
            <button onclick="editNote(${i})">✏</button>
            <button onclick="deleteNote(${i})">🗑</button>
          </div>
        </div>
      `;
    });
}
/* DELETE NOTE */
function deleteNote(i) {
  notes.splice(i, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}
/* EDIT NOTE */
function editNote(i) {
  const n = notes[i];
  nameInput.value = n.name;
  numberInput.value = n.number;
  textInput.value = n.text;
  imageData = n.imageData;

  if (imageData) {
    preview.src = imageData;
    plus.style.display = "none";
  } else {
    preview.src = "";
    plus.style.display = "block";
  }
  editIndex = i;
}
/* RESET FORM */
function resetForm() {
  nameInput.value = "";
  numberInput.value = "";
  textInput.value = "";
  imageData = "";
  preview.src = "";
  plus.style.display = "block";
}
/* SEARCH */
searchInput.oninput = render;
/* DARK MODE */
toggle.onclick = () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};
/* INIT */
render();