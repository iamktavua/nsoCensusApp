import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function complete() {
  return (
    <View style={styles.container}>
        <View>
          <Image source={require('@/assets/images/interface-head-logo.png')} style={styles.reactLogo} />
        </View>
      <Text style={styles.header}>"THANK YOU FOR PARTICIPATING"</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        justifyContent: "center",
      },
      header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f194ff",
        textAlign: "center",
        marginBottom: 30,
      },
      reactLogo: {
        height:120,
        width: 375,
        top: -10,
        left: 0,
        position: 'relative',
      },
})