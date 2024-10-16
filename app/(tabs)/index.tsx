import { Image, StyleSheet, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, {useState} from 'react';
import {Text, TextInput, View, Button, Alert} from 'react-native';
//import { userNavigation } from "@react-navigation/native";
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); 

  const handleSignIn = () => {
    if (username && password) {
      Alert.alert('SIGN IN SUCCESSFUL');
      indicativeDashboard();
    } else {
      Alert.alert('Please enter both username and password');
    }
  };

    const indicativeDashboard = () => {
      (navigation as any).navigate("indicative");
    }
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.reactLogo} source={require('@/assets/images/interface-head-logo.png')} />
      </View>
      <ThemedText style={styles.title} type="title">Get Started</ThemedText>
      <ThemedText type="subtitle">Username</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />
      
      <ThemedText type="subtitle">Password</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      
      <Button
        title="Sign In"
        color="#f194ff"
        onPress={handleSignIn}
      />

      <Text style={styles.forgottext}>Forgot password?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  forgottext: {
    top: 10,
    left: 245,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 250,
    width: 185,
    left: 95,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  reactLogo: {
    height:120,
    width: 375,
    top: -10,
    left: 0,
    position: 'relative'
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
  },
  title: {
    color:"#f194ff",
  },
  signinbutton: {
    borderRadius: 8,
  },
  logininter: {
    top: 100,
  }
});
