//tää tiedosto saattais sopia paremmin ./firebase -kansioon

import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db, COLLECTIONS } from '../../firebase/Config'
import cells from '../../cells4.json'

const usersRef = collection(db, COLLECTIONS.USERS)
const PREFIX = "oulu"

type CellUserData = {
  cellNumber: number,
  firstName?: string,
  firstSteps?: number,
  firstColor?: string,
  secondName?: string,
  secondSteps?: number,
  secondColor?: string,
  thirdName?: string,
  thirdSteps?: number,
  thirdColor?: string
}

/*
const getCellUserData = async (cellNumber: number) => {
  //palauttaa 3 alueella eniten kävellyttä käyttäjää (vain ne käyttäjät, joilla yli 0 askelta alueella)

  const cellId = String(cellNumber)

  try {
    const q = query(usersRef, where(`${PREFIX}${cellId}`, ">", 0), orderBy(`${PREFIX}${cellId}`, "desc"), limit(3))
    //const q2 = query(usersRef, where("oulu2", ">", 0), orderBy("oulu2", "desc"), limit(3))
    //...
    //...
    //...

    const querySnap = await getDocs(q)

    console.log("snap size: ", querySnap.size)

    querySnap.forEach((doc) => {
      console.log(doc.id, " => ", doc.data())
      //console.log(doc.id, " => ", doc.data().displayName)
      //console.log(doc.id, " => ", doc.get("oulu7"))
    })
  } catch (err) {
    console.error(err)
  }
}
*/

const onMapLoad = async (): Promise<CellUserData[]> => {
  /* (ajetaan kerran, kun kartta ladataan, ja sen jälkeen minuutin välein)
  * Hakee tietokannasta jokaiselle cellille kolmen eniten kävelleen käyttäjän tiedot (displayname, askelmäärä, väri (vain #1:lle))
  * Palauttaa listan (result), jossa on yksi elementti (CellUserData-objekti) jokaista celliä kohden.
  * Jokainen CellUserData-objekti sisältää seuraavat tiedot cellistä:
  * - cellin numero (cellNumber)
  * - ykkössijan displayname, askelmäärä ja väri (firstName, firstSteps, firstColor)
  * - kakkossijan displayname ja askelmäärä (secondName, secondSteps)
  * - kolmossijan displayname ja askelmäärä (thirdName, thirdSteps)
  * Mikäli cellin alueella ei ole tarpeeksi montaa kävelijää top 3:seen, vastaavat kentät
  * saavat arvon undefined, jotka täytyy käsitellä funktiota hyödyntävissä komponenteissa erikseen
  */

  const result = []
  try {
    console.log("onmapload started")
    //console.log("cells import length: ", cells.length)
    for (let i = 0; i < cells.length; i++) {
      const q = query(usersRef, where(`${PREFIX}${i + 1}`, ">", 0), orderBy(`${PREFIX}${i + 1}`, "desc"), limit(3))
      const querySnap = await getDocs(q)

      let firstName: string | undefined = undefined
      let firstSteps: number | undefined = undefined
      let firstColor: string | undefined = undefined

      let secondName: string | undefined = undefined
      let secondSteps: number | undefined = undefined
      let secondColor: string | undefined = undefined

      let thirdName: string | undefined = undefined
      let thirdSteps: number | undefined = undefined
      let thirdColor: string | undefined = undefined

      querySnap.forEach((doc) => {
        if (!firstName && !firstSteps && !firstColor) {
          //firstName = doc.data().displayName
          firstName = doc.get('displayName')
          firstSteps = doc.get(`${PREFIX}${i+1}`)
          firstColor = doc.get('userColor')
        }
        else if (!secondName && !secondSteps && !secondColor) {
          secondName = doc.get('displayName')
          secondSteps = doc.get(`${PREFIX}${i+1}`)
          secondColor = doc.get('userColor')
        }
        else if (!thirdName && !thirdSteps && !thirdColor) {
          thirdName = doc.get('displayName')
          thirdSteps = doc.get(`${PREFIX}${i+1}`)
          thirdColor = doc.get('userColor')
        }
      })

      result.push({
        cellNumber: i + 1,
        firstName: firstName,
        firstSteps: firstSteps,
        firstColor: firstColor,
        secondName: secondName,
        secondSteps: secondSteps,
        secondColor: secondColor,
        thirdName: thirdName,
        thirdSteps: thirdSteps,
        thirdColor: thirdColor
      })
    }

    console.log("onMapLoad success")

  } catch (err) {
    console.error(err)
  } finally {
    return result
  }
}

export { onMapLoad, CellUserData }