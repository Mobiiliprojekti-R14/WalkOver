import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import { CellUserData } from '../src/utils/fetchCellData'
import { IconButton } from 'react-native-paper'
import { BarChart, barDataItem } from 'react-native-gifted-charts'

type Props = {
  modalVisible: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  cellUserData: CellUserData[] | undefined
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
          <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Cell #{debugCell}</Text>
          <View>
            <Text>
              {/*cellUserData && cellUserData[debugCell - 1] && */cellUserData[debugCell - 1].firstName ? `Current leader: ${cellUserData[debugCell - 1]?.firstName} (${cellUserData[debugCell - 1]?.firstSteps} steps)` : "This cell has not yet been captured"}
            </Text>
            <Text>
              {/*cellUserData && cellUserData[debugCell - 1] && */cellUserData[debugCell - 1].secondName ? `2nd place: ${cellUserData[debugCell - 1].secondName} (${cellUserData[debugCell - 1].secondSteps} steps)` : ""}
              {/*cellUserData ? `2nd place: ${cellUserData[debugCell - 1]?.secondName} (${cellUserData[debugCell - 1]?.secondSteps} steps)` : ""*/}
            </Text>
            <Text>
              {/*cellUserData && cellUserData[debugCell - 1] && */cellUserData[debugCell - 1].thirdName ? `3rd place: ${cellUserData[debugCell - 1].thirdName} (${cellUserData[debugCell - 1].thirdSteps} steps)` : ""}
              {/*cellUserData ? `3rd place: ${cellUserData[debugCell - 1]?.thirdName} (${cellUserData[debugCell - 1]?.thirdSteps} steps)` : ""*/}
            </Text>
            <Text>tähän kaavio? (esim pylväsdiagrammi jossa top 3 askeleet ja käyttäjän askeleet [max 4 pylvästä]?)</Text>
            {/* pylväiden värit userColorista? */}
            <View>
              <BarChart
                data={
                  [
                    { value: 1, label: "test", frontColor: '#f00' },
                    { value: 3, label: "test 2", frontColor: '#0f0' },
                    { value: 4, label: "test 3", frontColor: '#00f' }
                  ]
                }
              />
            </View>
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
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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