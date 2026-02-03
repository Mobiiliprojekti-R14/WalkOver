import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export function DummyTestScreen() {
    return (
        <View style={styles.container}>
            <Text>DummyTestScreen</Text>
            <Text>Dummy sivu navigaation testaamiseen</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})