import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Query ordenada por data
const comunicadosRef = query(collection(db, "comunicados"), orderBy("criadoEm", "desc"));

let isInitialLoad = true;
const initialDocs = [];

// Escuta em tempo real
onSnapshot(comunicadosRef, (snapshot) => {
  const changes = snapshot.docChanges();

  // No primeiro carregamento, agrupa todos os documentos antes de renderizar
  if (isInitialLoad) {
    changes.forEach(change => {
      if (change.type === "added") {
        const dados = change.doc.data();
        dados.id = change.doc.id;
        initialDocs.push(dados);
      }
    });
    // Renderiza todos os documentos iniciais de uma vez, na ordem correta
    initialDocs.forEach(doc => window.addComunicadoToList(doc, true));
    isInitialLoad = false;
  } else {
    // Após o carregamento inicial, adiciona novos comunicados um a um no topo
    changes.forEach((change) => {
      if (change.type === "added") {
        const dados = change.doc.data();
        dados.id = change.doc.id;
        window.addComunicadoToList(dados, false);
      }
    });
  }
});
