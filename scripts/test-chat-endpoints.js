// Test des endpoints de chat pour le système Fleet Wise Operations
console.log('🚀 Démarrage des tests des endpoints de chat...');

const BASE_URL = 'http://localhost:5000';
const INTERVENTION_ID = 1; // ID d'intervention pour le test

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur requête vers ${url}:`, error.message);
    throw error;
  }
}

async function testChatEndpoints() {
  console.log('📱 Test des endpoints de chat pour l\'intervention', INTERVENTION_ID);
  console.log('=' .repeat(60));

  try {
    // Test 1: Récupérer les messages du chat
    console.log('\n📨 Test 1: GET /api/interventions/:id/chat');
    const messages = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/chat`);
    console.log(`   ✅ ${messages.length} messages récupérés`);

    // Test 2: Créer un nouveau message
    console.log('\n💬 Test 2: POST /api/interventions/:id/chat - Message texte');
    const messageData = {
      LIB100: 'Message chat',
      COMMENTAIRE: 'Bonjour, ceci est un message de test depuis le chat !',
      CDUSER: 'TST',
    };

    const newMessage = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    
    console.log(`   ✅ Message créé avec ID: ${newMessage.IDACTION}`);

    // Test 3: Créer un message de réponse
    console.log('\n↩️ Test 3: POST /api/interventions/:id/chat - Message de réponse');
    const replyData = {
      LIB100: 'Message chat',
      COMMENTAIRE: 'Ceci est une réponse au message précédent',
      CDUSER: 'TST',
      REPLY_TO: newMessage.IDACTION,
    };

    const replyMessage = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData),
    });
    
    console.log(`   ✅ Réponse créée avec ID: ${replyMessage.IDACTION}`);

    // Test 4: Vérifier les messages mis à jour
    console.log('\n📨 Test 4: GET /api/interventions/:id/chat - Messages mis à jour');
    const updatedMessages = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/chat`);
    console.log(`   ✅ ${updatedMessages.length} messages après ajouts`);
    
    if (updatedMessages.length > 0) {
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      console.log(`   📄 Dernier message: ID=${lastMessage.IDACTION}, REPLY_TO=${lastMessage.REPLY_TO || 'aucun'}`);
    }

    // Test 5: Simuler un partage de fichier
    console.log('\n📎 Test 5: Partage de fichier via chat');
    const fileMessageData = {
      LIB100: 'Photo partagée',
      COMMENTAIRE: 'Photo: test-photo.jpg',
      CDUSER: 'TST',
    };

    const fileMessage = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileMessageData),
    });
    
    console.log(`   ✅ Message fichier créé avec ID: ${fileMessage.IDACTION}`);

    // Créer un document lié à ce message
    const documentData = {
      LIB100: 'test-photo.jpg',
      FILEREF: 'test-photo.jpg',
      COMMENTAIRE: 'Partagé dans le chat: test-photo.jpg',
      CDUSER: 'TST',
      ID2GENRE_DOCUMENT: 1, // 1=Image
      TRGCIBLE: `ACT${fileMessage.IDACTION}`,
    };

    const newDocument = await makeRequest(`${BASE_URL}/api/interventions/${INTERVENTION_ID}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentData),
    });
    
    console.log(`   ✅ Document lié créé avec ID: ${newDocument.IDDOCUMENT || newDocument.ID}`);

    console.log('\n🎉 TOUS LES TESTS ONT RÉUSSI !');
    console.log('=' .repeat(60));
    console.log('✨ Le système de chat est opérationnel et prêt à être utilisé');

  } catch (error) {
    console.error('\n❌ ERREUR LORS DES TESTS:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Fonction pour vérifier si le serveur est prêt
async function waitForServer() {
  console.log('⏳ Attente du serveur...');
  let retries = 10;
  
  while (retries > 0) {
    try {
      const response = await fetch(`${BASE_URL}/api/db-test`);
      if (response.ok) {
        console.log('✅ Serveur prêt !');
        return true;
      }
    } catch (error) {
      // Serveur pas encore prêt
    }
    
    retries--;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Le serveur ne répond pas après 10 tentatives');
}

// Point d'entrée principal
async function main() {
  try {
    await waitForServer();
    await testChatEndpoints();
  } catch (error) {
    console.error('❌ Impossible de lancer les tests:', error.message);
    process.exit(1);
  }
}

// Lancer les tests si ce fichier est exécuté directement
if (require.main === module) {
  main();
}

module.exports = { testChatEndpoints, waitForServer }; 
setTimeout(testChatEndpoints, 3000); 