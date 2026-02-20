import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import { CellUserData } from '../src/utils/fetchCellData'
import { IconButton } from 'react-native-paper'
import { BarChart, barDataItem } from 'react-native-gifted-charts'
import { useAuth } from '../src/auth/AuthProvider'
import { MaterialIcons } from '@expo/vector-icons'


type Props = {
  modalVisible: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  cellUserData: CellUserData[]
  debugCell: number
}

export default function CellInfoModal({ modalVisible, setModalVisible, cellUserData, debugCell }: Props) {

  const errorModal = (
    <Modal
      animationType='slide'
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <IconButton
            style={{ alignSelf: 'flex-end' }}
            icon='close'
            onPress={() => {
              setModalVisible(false)
            }}
          />
          <View style={{ paddingHorizontal: 32, marginBottom: 64, marginTop: 32 }}>
            <Text style={{ textAlign: 'center' }}>Alueen tietoja ladattaessa tapahtui virhe, yritä myöhemmin uudelleen</Text>
          </View>
        </View>
      </View>
    </Modal>
  )

  if (debugCell < 1) {
    //console.log("CellInfoModal: debugCell < 1")
    return errorModal;
  }

  if (!cellUserData) {
    //console.log("CellInfoModal: cellUserData is undefined")
    return errorModal;
  }
  if (cellUserData.length < debugCell) {
    //console.log("CellInfoModal: cellUserData has too few elements")
    return errorModal;
  }

  const { profile } = useAuth()

  const barchartData: barDataItem[] = []
  if (cellUserData[debugCell - 1].firstName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].firstSteps,
      label: "#1",
      frontColor: cellUserData[debugCell - 1].firstColor
    })
  }
  if (cellUserData[debugCell - 1].secondName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].secondSteps,
      label: "#2",
      frontColor: cellUserData[debugCell - 1].secondColor
    })
  }
  if (cellUserData[debugCell - 1].thirdName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].thirdSteps,
      label: "#3",
      frontColor: cellUserData[debugCell - 1].thirdColor
    })
  }
  if (profile && profile.cells && profile.displayName && profile.userColor
    && (profile.displayName != cellUserData[debugCell - 1].firstName)
    && (profile.displayName != cellUserData[debugCell - 1].secondName)
    && (profile.displayName != cellUserData[debugCell - 1].thirdName)
  ) {
    barchartData.push({
      value: profile.cells[debugCell - 1],
      label: 'Minä',
      frontColor: profile.userColor
    })
  }

  return (
    <Modal
      animationType='slide'
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <IconButton
            style={{ alignSelf: 'flex-end' }}
            icon='close'
            onPress={() => {
              setModalVisible(false)
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Alue #{debugCell}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            {cellUserData[debugCell - 1].firstName ? (
              <Text>
                <MaterialIcons name="emoji-events" size={25} color="#ebb00e" />
                {`#1: ${cellUserData[debugCell - 1].firstName} (${cellUserData[debugCell - 1].firstSteps} askelta)`}
              </Text>
            ) : (
              <Text>Aluetta ei ole vielä valloitettu</Text>
            )}
            {cellUserData[debugCell - 1].secondName && (
              <Text>
                <MaterialIcons name="emoji-events" size={25} color="#b9b1b1" />
                {`#2: ${cellUserData[debugCell - 1].secondName} (${cellUserData[debugCell - 1].secondSteps} askelta)`}
              </Text>
            )}
            {cellUserData[debugCell - 1].thirdName && (
              <Text>
                <MaterialIcons name="emoji-events" size={25} color="#c4874a" />
                {`#3: ${cellUserData[debugCell - 1].thirdName} (${cellUserData[debugCell - 1].thirdSteps} askelta)`}
              </Text>
            )}
          </View>
          <View style={{alignItems: 'center', marginTop: 16}}>
            {
              (cellUserData[debugCell - 1].firstName &&
                profile?.displayName != cellUserData[debugCell - 1].firstName &&
                profile?.displayName != cellUserData[debugCell - 1].secondName &&
                profile?.displayName != cellUserData[debugCell - 1].thirdName
              ) && (
                <Text>
                  Omat askeleet alueella: {(profile && profile.cells) ? profile.cells[debugCell - 1] : 0}
                </Text>
              )
            }
          </View>
          <View style={{ /* padding: 16, margin: 16, */ margin: 24 }}>
            {cellUserData[debugCell - 1].firstName && (
              <BarChart
                data={barchartData}
                noOfSections={4}
                initialSpacing={20}
                width={250}
                spacing={30}
                endSpacing={0}
                isAnimated
                disablePress
              />)}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
})