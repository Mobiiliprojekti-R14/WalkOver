import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import { CellUserData } from '../src/utils/fetchCellData'
import { IconButton } from 'react-native-paper'
import { BarChart, barDataItem } from 'react-native-gifted-charts'
import { useAuth } from '../src/auth/AuthProvider'

type Props = {
  modalVisible: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  cellUserData: CellUserData[]
  debugCell: number
}

export default function CellInfoModal({modalVisible, setModalVisible, cellUserData, debugCell}: Props) {

  if (debugCell < 1) return;

  if (!cellUserData) {
    console.log("CellInfoModal: cellUserData is undefined")
    return;
  }
  if (cellUserData.length < debugCell) {
    console.log("CellInfoModal: cellUserData has too few elements")
    return;
  }

  const { profile } = useAuth()

  const barchartData: barDataItem[] = []
  if (cellUserData[debugCell - 1].firstName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].firstSteps,
      label: cellUserData[debugCell - 1].firstName,
      frontColor: cellUserData[debugCell - 1].firstColor
    })
  }
  if (cellUserData[debugCell - 1].secondName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].secondSteps,
      label: cellUserData[debugCell - 1].secondName,
      frontColor: cellUserData[debugCell - 1].secondColor
    })
  }
  if (cellUserData[debugCell - 1].thirdName) {
    barchartData.push({
      value: cellUserData[debugCell - 1].thirdSteps,
      label: cellUserData[debugCell - 1].thirdName,
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
      label: 'Me',
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
            <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Cell #{debugCell}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>
              {cellUserData[debugCell - 1].firstName ? `Current leader: ${cellUserData[debugCell - 1]?.firstName} (${cellUserData[debugCell - 1]?.firstSteps} steps)` : "This cell has not yet been captured"}
            </Text>
            {cellUserData[debugCell - 1].secondName && (
              <Text>
                2nd place: {cellUserData[debugCell - 1].secondName} ({cellUserData[debugCell - 1].secondSteps} steps)
              </Text>
            )}
            {cellUserData[debugCell - 1].thirdName && (
              <Text>
                3rd place: {cellUserData[debugCell - 1].thirdName} ({cellUserData[debugCell - 1].thirdSteps} steps)
              </Text>
            )}
            {
              (cellUserData[debugCell - 1].firstName &&
                profile?.displayName != cellUserData[debugCell - 1].firstName &&
                profile?.displayName != cellUserData[debugCell - 1].secondName &&
                profile?.displayName != cellUserData[debugCell - 1].thirdName
              ) && (
                <Text>
                  My steps in cell: {(profile && profile.cells) ? profile.cells[debugCell - 1] : 0}
                </Text>
              )
            }
          </View>
          <Text>Muuta pylväiden labelit numeroiksi!</Text>
          <View style={{ /* padding: 16, margin: 16, */ margin: 24 }}>
            {cellUserData[debugCell - 1].firstName && (
              <BarChart
                data={barchartData}
                noOfSections={4}
                initialSpacing={20}
                width={250}
                spacing={30}
                endSpacing={0}
                xAxisTextNumberOfLines={2}
                rotateLabel
                labelsExtraHeight={16}
                labelsDistanceFromXaxis={16}
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
    //alignItems: 'center',
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    //alignItems: 'center',
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