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

type UserData = {
  userId: string,
  username: string,
  displayName: string,
  userColor: string
} & Record<string, any>

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

const onMapLoad2 = async (): Promise<UserData[]> => {
  const result: UserData[] = []
  try {
    const snapshot = await getDocs(usersRef);

    snapshot.forEach(doc => {
      const data = doc.data();

      // Poimi vain ouluX-kentät
      const areaSteps = Object.fromEntries(
        Object.entries(data).filter(([key]) => key.startsWith("oulu"))
      );

      result.push({
        userId: doc.id,
        username: data.username,
        displayName: data.displayName,
        userColor: data.userColor,
        ...areaSteps
      });
    });
  } catch (err) {
    console.error("Error loading users:", err);
  } finally {
    return result
  }
}

const cellUserDataFrom = (users: UserData[]) => {
  const result = []
  if (!users || users.length === 0) return [];

  const areaKeys = Object.keys(users[0]).filter(k => k.startsWith("oulu"));

  for (let i = 0; i < areaKeys.length; i++) {
    const key = `${PREFIX}${i + 1}`

    const data = users.map(user => {
      const obj: { steps: number, displayName: string, userColor: string } = { steps: user[key], displayName: user.displayName, userColor: user.userColor };
      return obj
    })

    const sortedData = data.sort((a, b) => {
      return b.steps - a.steps
    })

    let firstName: string | undefined = undefined
    let firstSteps: number | undefined = undefined
    let firstColor: string | undefined = undefined

    let secondName: string | undefined = undefined
    let secondSteps: number | undefined = undefined
    let secondColor: string | undefined = undefined

    let thirdName: string | undefined = undefined
    let thirdSteps: number | undefined = undefined
    let thirdColor: string | undefined = undefined

    if (sortedData) {
      if (sortedData[0]?.steps > 0) {
        firstName = sortedData[0].displayName
        firstSteps = sortedData[0].steps
        firstColor = sortedData[0].userColor

        if (sortedData[1]?.steps > 0) {
          secondName = sortedData[1].displayName
          secondSteps = sortedData[1].steps
          secondColor = sortedData[1].userColor

          if (sortedData[2]?.steps > 0) {
            thirdName = sortedData[2].displayName
            thirdSteps = sortedData[2].steps
            thirdColor = sortedData[2].userColor
          }
        }
      }
    }

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
  return result
}

export { CellUserData, onMapLoad2, cellUserDataFrom }