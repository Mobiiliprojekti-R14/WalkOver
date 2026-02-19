import { View, Text, Modal, Button, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Checkbox } from '@futurejj/react-native-checkbox';

type Props = {
    showTutorial: boolean
    setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>
    dontShowAgain: boolean
    setDontShowAgain: React.Dispatch<React.SetStateAction<boolean>>
    closeTutorial: () => void
}

export default function PopUpGuideModal({ showTutorial, setShowTutorial, dontShowAgain, setDontShowAgain, closeTutorial }: Props) {

    return (
        <View>
            <Modal
                animationType='none'
                visible={showTutorial}
                transparent={true}
                onRequestClose={closeTutorial}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>Tervetuloa peliin!</Text>
                        <Text style={styles.modalText}>Aloita pelaaminen keräämällä askelia alueilla ja valtaa alueet keräämällä 
                            suurimmat askelmäärät. Oman profiilivärisi näet oikealla ylhäällä olevasta ikonista, alue muuttuu profiilivärisi 
                            mukaiseksi kun olet valloittanut alueen.{"\n"}
                            Voit tarkastella alueen tilastoja painamalla tiettyä aluetta.
                            {"\n"}{"\n"}Kun olet valmis valloitusmatkallesi, paina Aloita pelaaminen-painiketta</Text>
                        <View style={styles.checkBox}>
                        <Checkbox
                        status={dontShowAgain ? "checked" : "unchecked"}
                        onPress={() => setDontShowAgain(!dontShowAgain)}
                        ></Checkbox>
                        <Text>Älä näytä uudelleen</Text>
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={closeTutorial}>
                            <Text style={styles.textStyle}>Sulje</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
        </View>
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
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,

    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    checkBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    }
});