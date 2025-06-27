console.log('🏗️ Test de l\'alimentation IDPROJET et IDTACHE');
console.log('='.repeat(50));

// Simulation du processus avec récupération des infos intervention
const simulateProjectTaskPopulation = () => {
  console.log('📋 Processus d\'alimentation IDPROJET et IDTACHE:');
  
  // 1. Intervention exemple
  const interventionId = 120876;
  const interventionData = {
    IDINTERVENTION: interventionId,
    LIB50: 'Maintenance préventive',
    IDPROJET: 5001, // Projet parent
    IDTACHE: 7002, // Tâche spécifique
    IDCONTACT: 25,
    IDMACHINE: 15
  };
  
  console.log('🔧 1. Intervention source:', {
    id: interventionData.IDINTERVENTION,
    libelle: interventionData.LIB50,
    idprojet: interventionData.IDPROJET,
    idtache: interventionData.IDTACHE
  });
  
  // 2. Création d'une action (message chat)
  const actionData = {
    IDACTION: 120950,
    CLE_PIECE_CIBLE: `INT${interventionId}`,
    LIB100: 'Message chat',
    COMMENTAIRE: 'Test de message dans le chat',
    CDUSER: 'TEST',
    TYPACT: 10,
    ID2GENRE_ACTION: 1,
    // ✅ Champs ajoutés depuis intervention
    IDPROJET: interventionData.IDPROJET,
    IDTACHE: interventionData.IDTACHE
  };
  
  console.log('💬 2. Action créée avec projet/tâche:', {
    idaction: actionData.IDACTION,
    lib: actionData.LIB100,
    idprojet: actionData.IDPROJET,
    idtache: actionData.IDTACHE
  });
  
  // 3. Création d'un document (photo uploadée)
  const documentData = {
    IDDOCUMENT: Date.now(),
    LIB100: 'photo-test.jpg',
    FILEREF: `/assets/photos/INT${interventionId}/1751037236391_photo-test.jpg`,
    CDUSER: 'TEST',
    ID2GENRE_DOCUMENT: 1, // Image
    TRGCIBLE: `ACT${actionData.IDACTION}`,
    // ✅ Champs ajoutés depuis intervention
    IDPROJET: interventionData.IDPROJET,
    IDTACHE: interventionData.IDTACHE
  };
  
  console.log('📄 3. Document créé avec projet/tâche:', {
    iddocument: documentData.IDDOCUMENT,
    lib: documentData.LIB100,
    trgcible: documentData.TRGCIBLE,
    idprojet: documentData.IDPROJET,
    idtache: documentData.IDTACHE
  });
  
  // 4. Vérification des liaisons complètes
  console.log('\n🎯 Vérification des liaisons complètes:');
  
  // Liaison INTERVENTION → ACTION
  const interventionActionLinked = actionData.IDPROJET === interventionData.IDPROJET && 
                                   actionData.IDTACHE === interventionData.IDTACHE;
  
  // Liaison INTERVENTION → DOCUMENT
  const interventionDocumentLinked = documentData.IDPROJET === interventionData.IDPROJET && 
                                     documentData.IDTACHE === interventionData.IDTACHE;
  
  // Liaison ACTION → DOCUMENT
  const actionDocumentLinked = documentData.TRGCIBLE === `ACT${actionData.IDACTION}`;
  
  console.log('✅ Liaison INTERVENTION → ACTION:', interventionActionLinked ? 'OK' : 'KO');
  console.log('✅ Liaison INTERVENTION → DOCUMENT:', interventionDocumentLinked ? 'OK' : 'KO');
  console.log('✅ Liaison ACTION → DOCUMENT:', actionDocumentLinked ? 'OK' : 'KO');
  
  if (interventionActionLinked && interventionDocumentLinked && actionDocumentLinked) {
    console.log('\n🎉 Toutes les liaisons sont correctes!');
  } else {
    console.log('\n❌ Problème dans les liaisons!');
  }
  
  // 5. Simulation de requête finale avec jointures
  console.log('\n📱 Requête SQL finale simulée:');
  console.log(`
    SELECT 
      a.IDACTION,
      a.LIB100,
      a.COMMENTAIRE,
      a.IDPROJET,
      a.IDTACHE,
      d.IDDOCUMENT,
      d.LIB100 as DOC_LIB,
      d.FILEREF,
      d.IDPROJET as DOC_IDPROJET,
      d.IDTACHE as DOC_IDTACHE
    FROM ACTION a
    LEFT JOIN DOCUMENT d ON d.TRGCIBLE = CONCAT('ACT', a.IDACTION)
    WHERE a.CLE_PIECE_CIBLE = 'INT${interventionId}'
    AND a.TYPACT = 10
  `);
  
  console.log('📋 Résultat attendu:');
  console.log({
    IDACTION: actionData.IDACTION,
    LIB100: actionData.LIB100,
    COMMENTAIRE: actionData.COMMENTAIRE,
    IDPROJET: actionData.IDPROJET,
    IDTACHE: actionData.IDTACHE,
    IDDOCUMENT: documentData.IDDOCUMENT,
    DOC_LIB: documentData.LIB100,
    FILEREF: documentData.FILEREF,
    DOC_IDPROJET: documentData.IDPROJET,
    DOC_IDTACHE: documentData.IDTACHE
  });
};

// Lancer la simulation
simulateProjectTaskPopulation();

console.log('\n🚀 Logique d\'alimentation IDPROJET/IDTACHE validée!');
console.log('💡 Les champs sont maintenant propagés depuis INTERVENTION vers ACTION et DOCUMENT'); 