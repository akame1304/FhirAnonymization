<template>
  <div id="container">
    <header>
      <h1>FHIR DE-IDENTIFICATION</h1>
    </header>
    <h2>CONFIGURAZIONE</h2>
    <main>
      <section id="section1">
        <h3>INSERISCI ELEMENTI</h3>

        <input type="text" id="textInput" placeholder="Inserisci testo" />

        <select id="choiceSelect">
          <option value="Delete">Delete</option>
          <option value="Encryption">Encryption</option>
          <option value="Pseudonymization">Pseudonymization</option>
        </select>
        <button id="submitButton" @click="aggiungiElemento">add</button>
        <button id="btnclear" @click="btnClear">clear</button>
        <p>elementi scelti:</p>
        <ul id="choicesList"></ul>
        <button id="btnSalvaConfigurazione" @click="salvaConfigurazione">
          salva configurazione
        </button>
      </section>

      <section id="section2">
        <h3>SELEZIONA IL FILE DI CONFIGURAZIONE</h3>
        <div>
          <input
            id="inputConfig"
            type="file"
            @change="selezionaFile"
          />
        </div>
      </section>

      <div id="divbottone">
        <button id="btnconfig" @click="flag = true" :disabled="!btnshow">
          configurazione completata
        </button>
      </div>

      <section id="section3" v-show="flag">
        <h2>DE-IDENTIFICAZIONE</h2>
        <div>
          <input
            @change="handleUpload"
            id="files"
            type="file"
            webkitdirectory
          />

          <button id="handle" @click="Elabora" :disabled="!btnelabora">Elabora</button>
          <div class="loader" v-show="loading"></div>
        </div>
        <div id="download">
          <button id="btndownload" @click="downloadFileModificati" :disabled="!btnSalva">
            salva
          </button>
          <button @click="downloadFileMetadati" :disabled="!btnSalva">metadati</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";

let flag = ref(false);
let btnshow = ref(false);
let array = []; //è un array di array che contiene tutti i selettori richiesti dall'utente
let arrayFiles = []; //array con i file da modificare
let arraySelettore = [];
let arrayAzione = [];
let fileName = []; //array e contiene i nomi dei file
let dizionarioMetadati = {}; //dizionario che contiene i metadati
let dizionarioConfigurazione = {}; //dizionario che contiene la configurazione elemento + azione
let contatore = 0;
let contatoreAzione = 0;
let btnelabora = ref(false)
let btnSalva = ref(false)
let loading = ref(false);
let arraydiprova = []
let path;
let w=0;

const handleUpload = async (event) => {
  arrayFiles = []
  loading.value = true;
  //funzione che prende i file in input e permette di leggerne il contenuto
  for (let i = 0; i < event.target.files.length; i++) {
    const file = event.target.files[i];
    fileName.push(file.name);

    if (file instanceof Blob) {
      let fileContents = await readUploadedFileAsText(file);
      arrayFiles.push(fileContents);
    }
  }
  loading.value = false;
  btnelabora.value = true;//il bottone di elabora si attiva quando il dispositivo è pronto
};

function Elabora() {
  loading.value = true;

  // Imposta un ritardo per l'elaborazione asincrona (altrimenti l'interfaccia si blocca)
  setTimeout(() => {
    arrayFiles.forEach((el) => {
      let chiave = CryptoJS.lib.WordArray.random(32).toString();
      let pseudonimo = uuidv4();

      Object.entries(dizionarioConfigurazione).forEach(([selettore, azione]) => {
        arraySelettore = selettore.split(" ");
        array.push(arraySelettore);
        arrayAzione.push(azione);
      });

      array.forEach((element) => {
        let azione = arrayAzione[contatoreAzione];
        cercaSelettore(el, element, azione, chiave, pseudonimo);   
        contatoreAzione++;
      });

   
      contatore++;
      arrayAzione = [];
      arraySelettore = [];
      array = [];
      contatoreAzione = 0;
      w++
    });

    console.log(arrayFiles);
    loading.value = false;
    btnSalva.value = true
  }, 0); // Imposta il ritardo a 0 per l'elaborazione asincrona
}


function cercaSelettore(file, elemSelettore, azione, chiave, pseudonimo, percorso = []) {
  //prende in input il file, array di selettori( ad esempio "address > city"), azione e chiave

  if ("object" == typeof file) {
    if (elemSelettore[0] == "*") {
      //controlla se il primo elemento del selettore è *
      let elemSelettore2 = elemSelettore.slice(1);
      sottoNodi(file, elemSelettore2, azione, chiave);
    } else {
      for (let el in file.entry) {
        if (file.entry[el].resource[elemSelettore[0]]) {
          percorso =`file${w}.entry[${[el]}].resource.${[elemSelettore[0]]}`
          if (elemSelettore.length == 1) {
           
            
            switch (azione) {

              case "Delete":
              dizionarioMetadati[azione] = dizionarioMetadati[azione] || [];
          dizionarioMetadati[azione].push([percorso, file.entry[el].resource[elemSelettore[0]]]);
                delete file.entry[el].resource[elemSelettore[0]];
                break;

              case "Encryption":
              let nomevecchio1 = JSON.stringify(file.entry[el].resource[elemSelettore[0]] );
                file.entry[el].resource[elemSelettore[0]] =CryptoJS.AES.encrypt(JSON.stringify(file.entry[el].resource[elemSelettore[0]]),chiave).toString();
                let encryptionKey = `${azione}: ${chiave}`;
          dizionarioMetadati[encryptionKey] = dizionarioMetadati[encryptionKey] || [];
          dizionarioMetadati[encryptionKey].push([`\n`+percorso, nomevecchio1]);
          break;
              case "Pseudonymization":
              let nomevecchio = JSON.stringify(
                file.entry[el].resource[elemSelettore[0]]
                );
                file.entry[el].resource[elemSelettore[0]] = pseudonimo
                let pse = `${azione}: ${pseudonimo}`;
                dizionarioMetadati[pse] = dizionarioMetadati[pse] || [];
          dizionarioMetadati[pse].push([`\n`+percorso, nomevecchio]);
          
                break;
            }
          } else {
            let elemSelettore2 = elemSelettore.slice(1);

            nodi(
              file.entry[el].resource[elemSelettore[0]],
              elemSelettore2,
              azione,
              chiave,pseudonimo, percorso
            );
          }
        }
      }
    }
  }
  
}

function nodi(file, elemSelettore, azione, chiave,pseudonimo, percorso) {
  if ("object" == typeof file) {
    if (elemSelettore[0] == ">") {
      let elemSelettore2 = elemSelettore.slice(1);

      for (let el in file) {
        if (elemSelettore2[0] == el) {
          console.log(percorso)
          let percorso1 = percorso + `.${el}`;

          if (elemSelettore2.length == 1) {
            switch (azione) {
              case "Delete":
              dizionarioMetadati[azione]=file[elemSelettore2[0]] 
                delete file[elemSelettore2[0]];
                break;
              case "Encryption":
              dizionarioMetadati[azione] = dizionarioMetadati[azione] || [];
                let nomevecchio1 = JSON.stringify(file[el]);
                file[el] = CryptoJS.AES.encrypt(
                  JSON.stringify(file[el]),
                  chiave
                ).toString();
                let encryptionKey = `${azione}: ${chiave}`;
                dizionarioMetadati[encryptionKey] = dizionarioMetadati[encryptionKey] || [];
                dizionarioMetadati[encryptionKey].push([`\n` + percorso1, nomevecchio1]);
                break;
              case "Pseudonymization":
              dizionarioMetadati[azione] = dizionarioMetadati[azione] || [];
                file[el] = pseudonimo;
                let pse = `${azione}: ${pseudonimo}`;
                let nomevecchio = JSON.stringify(file[el]);
                dizionarioMetadati[pse] = dizionarioMetadati[pse] || [];
                dizionarioMetadati[pse].push([`\n` + percorso1, nomevecchio]);
                break;
                break;
            }
          }
          let elemSelettore3 = elemSelettore2.slice(1);
          nodi(file[elemSelettore2[0]], elemSelettore3, azione,chiave,pseudonimo, percorso1);
        }
      }
    } else {
      sottoNodi(file, elemSelettore, azione, chiave);
    }
  }
}
function sottoNodi(file, elemSelettore, azione, chiave,pseudonimo) {
  if ("object" == typeof file) {
    for (let k in file) {
      if (k == elemSelettore[0]) {
        if (elemSelettore.length == 1) {
          switch (azione) {
            case "Delete":
            dizionarioMetadati[azione]=file[k]
              delete file[k];
              break;
            case "Encryption":
            dizionarioMetadati[azione]=file[k]
              file[k] = CryptoJS.AES.encrypt(
                JSON.stringify(file[k]),
                chiave
              ).toString();
              break;
            case "Pseudonymization":
            dizionarioMetadati[azione]=file[k]
              file[k] = uuidv4();

              break;
          }
        }
        let elemSelettore2 = elemSelettore.slice(1);
        if (elemSelettore2[0] == ">") {
          nodi(file[k], elemSelettore2, azione, chiave,pseudonimo);
        } else {
          sottoNodi(file[k], elemSelettore2, azione, chiave,pseudonimo);
        }
      } else {
        sottoNodi(file[k], elemSelettore, azione, chiave,pseudonimo);
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
};

function aggiungiElemento() {
  const textInput = document.getElementById("textInput");
  const choiceSelect = document.getElementById("choiceSelect");

  const enteredText = textInput.value;
  const selectedChoice = choiceSelect.value;

  if (enteredText && selectedChoice) {
    btnshow.value = true;

    dizionarioConfigurazione[enteredText] = selectedChoice;

    console.log("Dizionario:", dizionarioConfigurazione);

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

function salvaConfigurazione() {
  var jsonData = JSON.stringify(dizionarioConfigurazione);
  var blob = new Blob([jsonData], { type: "application/json" });
  var a = document.createElement("a");
  document.body.appendChild(a);
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "configuration.json";

  a.click();
  window.URL.revokeObjectURL(url);
}

function btnClear() {
  flag.value = false
  btnshow.value = false;
  dizionarioConfigurazione = {};
  let fileInput = document.getElementById("inputConfig");
  fileInput.value = null;
  let ul = document.querySelector("ul");
  ul.innerHTML = " ";
}

const selezionaFile = (input) => {
  let file = input.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        btnshow.value = true;
        let fileContent = JSON.parse(e.target.result);
        if (typeof fileContent == "object") {
          if (dizionarioConfigurazione == {}) {
            dizionarioConfigurazione = fileContent;
          } else {
            dizionarioConfigurazione = Object.assign(
              {},
              dizionarioConfigurazione,
              fileContent
            );
          }

          stampaElementiInseriti(dizionarioConfigurazione);
        } else {
          console.error("Il file non contiene dati JSON validi.");
        }
      } catch (error) {
        console.error(
          "Si è verificato un errore durante la lettura del file JSON:",
          error
        );
      }
    };
    reader.readAsText(file);
  } else {
    console.error("Nessun file selezionato.");
  }
};
function stampaElementiInseriti(dizionarioConfigurazione) {
  const outputElement = document.querySelector("ul");
  for (const [key, value] of Object.entries(dizionarioConfigurazione)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key} - ${value}`;
    outputElement.appendChild(listItem);
  }
}

function downloadFileMetadati() {
  // Converte l'array in una stringa formattata
  let formattedLines = Object.entries(dizionarioMetadati).map(
    ([key, value]) => `${key},  ${value}`
    
  );
  console.log(dizionarioMetadati);//il console log stampa in maniera più ordinata i metadati


  let txtContent = formattedLines.join("\n");

  // Crea un elemento HTML "a" per il download
  const link = document.createElement("a");
  link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
  link.download = "info.txt";
  link.style.display = "none";
  document.body.appendChild(link);

  // Simula il click sull'elemento "a" per avviare il download
  link.click();
  document.body.removeChild(link);
}

function downloadFileModificati() {
  const zip = new JSZip();

  // Creare una cartella virtuale
  const folder = zip.folder("myFolder");

  for (let i = 0; i <= arrayFiles.length - 1; i++) {
    let jsonContent = JSON.stringify(arrayFiles[i], null, 2);
    folder.file(`file${i}.json`, jsonContent);
  }

  // Generare il file ZIP
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Scaricare il file ZIP
    const zipBlob = new Blob([content], { type: "application/zip" });
    const zipUrl = window.URL.createObjectURL(zipBlob);

    const a = document.createElement("a");
    a.download = "myZipFile.zip";
    a.href = zipUrl;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(zipUrl);
  });
}
</script>
<style scoped>
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
  width: 150px; /* Larghezza personalizzata */
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




.loader {
  border: 4px solid #4CAF50; /* Colore del cerchio verde */
  border-top: 4px solid transparent; /* Parte superiore del cerchio trasparente */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite; /* Animazione di rotazione */
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
