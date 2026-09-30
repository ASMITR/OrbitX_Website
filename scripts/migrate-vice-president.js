const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZwGvejoCn2df7CX_JudFKQwqVQrlDgjk",
  authDomain: "orbitx-website-f3acc.firebaseapp.com",
  projectId: "orbitx-website-f3acc",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migrateVicePresidentToChairman() {
  console.log('🔍 Scanning members collection for "Vice President" positions...\n')

  const snapshot = await getDocs(collection(db, 'members'))
  const toUpdate = []

  snapshot.docs.forEach(d => {
    const data = d.data()
    if (data.position && data.position.toLowerCase() === 'vice president') {
      toUpdate.push({ id: d.id, name: data.name, oldPosition: data.position })
    }
  })

  if (toUpdate.length === 0) {
    console.log('✅ No "Vice President" records found. Nothing to migrate.')
    process.exit(0)
  }

  console.log(`Found ${toUpdate.length} member(s) to update:\n`)
  toUpdate.forEach(m => console.log(`  - ${m.name} (${m.oldPosition})`))
  console.log()

  for (const member of toUpdate) {
    await updateDoc(doc(db, 'members', member.id), { position: 'Chairman' })
    console.log(`✅ Updated: ${member.name} → Chairman`)
  }

  console.log(`\n🎉 Migration complete. ${toUpdate.length} record(s) updated.`)
  process.exit(0)
}

migrateVicePresidentToChairman().catch(err => {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
})
