<style>
#container {
  margin: 10px auto;
  align-items: center;
  max-width: 1300px;
}
h1 {
  font-size: 50px;
}
h2 {
  font-size: 40px;
  margin: 10px;
  padding: 0;
  text-align: center;
}
h3 {
  margin: top 0;
}
header {
  text-align: center;
  margin: 0;
  padding: 0;
}
main {
  display: flex;
  flex-wrap: wrap;
}
#section1,
#section2 {
  width: 50%;
  padding: 20px;
  text-align: center;
}
#section2 div {
  margin: 20px;
}

#section3 {
  width: 100%;
  text-align: center;
  margin: 50px;
}
#divbottone {
  margin: 50px auto 0px auto;
}

input[type="text"] {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
li {
  list-style: none;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
}
#btnclear {
  background-color: #d9534f; /* Colore rosso */
  color: white;
}
#choiceSelect {
  padding: 10px;
  font-size: 14px;
  margin: 10px;
  width: 100px; /* Larghezza personalizzata */
  height: 40px; /* Altezza personalizzata */
  /* Aggiungi altri stili personalizzati, se necessario */
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
#download {
  width: 100%;
  margin: 40px auto;
  padding: 40px;
}
</style>

<template>
  <!-- <FileUpload
    :customUpload="true"
    @upload="onAdvancedUpload($event)"
    :multiple="true"
    :maxFileSize="100000000"
  >
    <template #empty>
      <p>Drag and drop files to here to upload.</p>
    </template>
  </FileUpload>
-->
  <div id="container">
    <header>
      <h1>FHIR DE-IDENTIFICATION</h1>
    </header>
    <h2>CONFIGURAZIONE</h2>
    <main>
      <section id="section1">
        <h3>INSERISCI ELEMENTI</h3>

        <input type="text" id="textInput" placeholder="Inserisci testo" />
        <label for="choiceSelect">Azione:</label>
        <select id="choiceSelect">
          <option value="delete">Delete</option>
          <option value="encryption">encrypt</option>
          <option value="decryption">decrypt</option>
          <option value="pseudoAnon">pseudo-anon</option>
        </select>
        <button id="submitButton" @click="aggiungiElemento">add</button>
        <button id="btnclear" @click="btnclear">clear</button>

        <ul id="choicesList">
          <p>elementi scelti:</p>
        </ul>
        <button id="salvaconfig" @click="salvaconfig">
          salva configurazione
        </button>
      </section>

      <section id="section2">
        <h3>SELEZIONA IL FILE DI CONFIGURAZIONE</h3>
        <div>
          <input type="file" ref="fileInput" @change="readFileContents" />
          <button
            @click="uploadFile"
            :disabled="!fileSelected"
            class="upload-button"
          >
            Carica File
          </button>
        </div>
      </section>

      <div id="divbottone" v-if="awesome">
        <button id="btnconfig" @click="awesome = !awesome">
          configurazione completata
        </button>
      </div>

      <section id="section3" v-else>
        <h2>DE-IDENTIFICAZIONE</h2>
        <div>
          <input @change="handleUpload" id="files" type="file" multiple />
          <label for="files"></label>
          <button id="handle" @click="handleUpload">elabora</button>
        </div>
        <div id="download">
          <button id="btndownload" @click="download">salva</button>
          <button @click="downloadFile">metadati</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
console.log(uuidv4());
//let key = CryptoJS.lib.WordArray.random(32).toString(

const awesome = ref(true);
let array = [];
let array2 = [];
let arrayAzione = [];
let i = 0;
let k = 0;
let cont = 0;
let arrayDiFile = [];
let dizionario = [];
let q=0;


//let fileContents;
const handleUpload = async (event) => {
  while (event != null) {
    const file = event.target.files[i];
    const fileName = file.name;
    i++;
    let fileContents = await readUploadedFileAsText(file);

    Object.entries(dictionary).forEach(([k, v]) => {
      array2 = k.split(" ");
      array.push(array2);
      arrayAzione.push(v);
    });
//console.log(array+ "   "+array2+"   "+arrayAzione)
    array.forEach((element) => {
      let azione = arrayAzione[q];
      console.log(array+ "   "+array2+"   "+arrayAzione+ "   "+ azione)
      funzione(fileContents, element, azione);
      q++;
    });
    console.log(cont);

    console.log(fileContents);
    download(fileContents, fileName);
    arrayAzione = [];
    array2 = [];
    array = [];
    q=0;
  }
  cont++;
};

function funzione(obj, key, azione) {
  // var length = Object.keys(obj.entry).length;

  if ("object" == typeof obj) {
    if (key[0] == "*") {
      let key2 = key.slice(1);
      allNodes(obj, key2, azione);
    } else {
      for (let el in obj.entry) {
        if (obj.entry[el].resource[key[0]]) {
          if (key.length == 1) {
            switch (azione) {
              case "delete":
                delete obj.entry[el].resource[key[0]];
                break;
              case "encryption":
                obj.entry[el].resource[key[0]] = CryptoJS.AES.encrypt(
                  JSON.stringify(obj.entry[el].resource[key[0]]),
                  "ciao"
                ).toString();
                break;
              case "decryption":
                var bytes = CryptoJS.AES.decrypt(
                  obj.entry[el].resource[key[0]],
                  "ciao"
                );
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                obj.entry[el].resource[key[0]] = JSON.parse(originalText);
                break;
              case "pseudoAnon":
                let nomevecchio = JSON.stringify(
                  obj.entry[el].resource[key[0]]
                );
                obj.entry[el].resource[key[0]] = uuidv4();
                let nomenuovo = obj.entry[el].resource[key[0]];
                dizionario[azione + ": " + nomenuovo] = nomevecchio;
                break;
            }
          } else {
            let key2 = key.slice(1);

            nodi(obj.entry[el].resource[key[0]], key2, azione);
          }
        }
        cont++;
      }
    }
  }
}

function nodi(obj, key, azione) {
  if ("object" == typeof obj) {
    if (key[0] == ">") {
      let key2 = key.slice(1);

      for (let el in obj) {

        cont++;
        if (key2[0] == el) {
          if (key2.length == 1) {
            switch (azione) {
              case "delete":
                console.log(obj[key2]);
                obj[key2[0]] = "cancella elemento";
                //delete obj[key2[0]]
                break;
              case "encryption":
                obj[key2[0]] = CryptoJS.AES.encrypt(
                  JSON.stringify(obj[key2[0]]),
                  "ciao"
                ).toString();
                break;
              case "decryption":
                var bytes = CryptoJS.AES.decrypt(obj[key2[0]], "ciao");
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                obj[key2[0]] = JSON.parse(originalText);
                break;
              case "pseudoAnon":
                let nomevecchio = JSON.stringify(
                  obj.entry[el].resource[key[0]]
                );
                obj.entry[el].resource[key[0]] = uuidv4();
                let nomenuovo = obj.entry[el].resource[key[0]];
                dizionario[nomenuovo] = nomevecchio;
                break;
            }
          }
          let key3 = key2.slice(1);
          nodi(obj[key2[0]], key3, azione);
        }
      }
    } else {
      allNodes(obj, key, azione);
    }
  }
}
function allNodes(obj, key, azione) {
  if ("object" == typeof obj) {
    for (let k in obj) {
      cont++;
      if (k == key[0]) {
        if (key.length == 1) {
          switch (azione) {
            case "delete":
              delete obj[k];
              break;
            case "encryption":
              obj[k] = CryptoJS.AES.encrypt(
                JSON.stringify(obj[k]),
                "ciao"
              ).toString();
              break;
            case "decryption":
              var bytes = CryptoJS.AES.decrypt(obj[k], "ciao");
              var originalText = bytes.toString(CryptoJS.enc.Utf8);
              obj[k] = JSON.parse(originalText);
              break;
            case "pseudoAnon":
              let nomevecchio = JSON.stringify(obj[k]);
              obj[k] = uuidv4();
              let nomenuovo = obj[k];
              dizionario[nomenuovo] = nomevecchio;
              break;
          }
        }
        let key2 = key.slice(1);
        if (key2[0] == ">") {
          nodi(obj[k], key2, azione);
        } else {
          allNodes(obj[k], key2, azione);
        }
      } else {
        allNodes(obj[k], key, azione);
      }
    }
  }
}

const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = (e) => {
      const inputFile = e.target.result;

      resolve(JSON.parse(inputFile));
    };
    temporaryFileReader.readAsText(inputFile);
  });
}; /*
function inpute() {
  const input1 = document.createElement("input");
  input1.type = "text";

  console.log(typeof input1);
  let scelta = document.getElementById("choiceSelect").value;
  if (scelta == "encrypt") {
    if (input1.placeholder) {
      console.log("non fare niente");
    } else {
      input1.placeholder = "Inserisci chiave";

      console.log(scelta);
      const miodiv2 = document.getElementById("miodiv2");
      miodiv2.appendChild(input1);
    }
  }
  if (scelta == "decrypt") {
  }
}
*/
let dictionary = {};

function aggiungiElemento() {
  const textInput = document.getElementById("textInput");
  const choiceSelect = document.getElementById("choiceSelect");

  const enteredText = textInput.value;
  const selectedChoice = choiceSelect.value;

  if (enteredText && selectedChoice) {
    dictionary[enteredText] = selectedChoice;

    console.log("Dizionario:", dictionary);

    const listItem = document.createElement("li");
    listItem.textContent = `${enteredText} - ${selectedChoice}`;
    choicesList.appendChild(listItem);
    // Svuota l'input di testo e reimposta il menu a tendina
    textInput.value = "";
    choiceSelect.selectedIndex = 0; // Imposta la selezione predefinita
  } else {
    alert(
      "Inserisci il testo e seleziona un'azione prima di premere il pulsante."
    );
  }
}

function download(jsonContent, fileName) {
  const fileContent = JSON.stringify(jsonContent, null, 2);
  var bott = document.getElementById("btndownload");
  bott.addEventListener("click", () => {
    var bb = new Blob([fileContent], { type: "application/json" });
    var a = document.createElement("a");
    a.download = "MODIFICATO" + fileName;
    a.href = window.URL.createObjectURL(bb);
    a.click();
  });
}
function salvaconfig() {
  if (dictionary == null) {
  }
  var jsonData = JSON.stringify(dictionary);
  var blob = new Blob([jsonData], { type: "application/json" });
  // Crea un elemento link temporaneo
  var a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Imposta l'URL del link con il contenuto del Blob
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "configuration.json";

  a.click();
  window.URL.revokeObjectURL(url);
}

function btnclear() {
  dictionary = {};
  let ul = document.querySelector("ul");
  ul.innerHTML = " ";
}
let fileinputo;


function readFileContents(fileInput) {
  const selectedFile = fileInput.value.files[0];
  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContents = event.target.result;
      console.log("Contenuto del file:", fileContents); // Stampa il contenuto nella console
    };

    reader.readAsText(selectedFile);
  }
}

const fileInput = ref(null);
const fileSelected = ref(false);

function openFileInput() {
  fileInput.value.click();
}

function handleFileChange() {
  const selectedFile = fileInput.value.files[0];
  if (selectedFile) {
    fileSelected.value = true;
  }
}
function downloadFile() {
  // Converte l'array in una stringa formattata
  const formattedLines = Object.entries(dizionario).map(
    ([key, value]) => `${key}, originale: ${value}`
  );

  // Unisci le righe in una singola stringa con un ritorno a capo tra ciascuna riga
  const txtContent = formattedLines.join("\n");

  // Crea un elemento HTML "a" per il download
  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
  link.download = "info.txt";
  link.style.display = "none";
  document.body.appendChild(link);

  // Simula il click sull'elemento "a" per avviare il download
  link.click();

  // Rimuovi l'elemento "a" dopo il download
  document.body.removeChild(link);
}
</script>
