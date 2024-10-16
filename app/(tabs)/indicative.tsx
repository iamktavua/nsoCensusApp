import { addLocation, deleteLocations, getLocations, initializeDB, updateLocations, Location } from '@/database';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from 'expo-router';


const EnumerationAreaScreen = () => {
  const [enumeration_area, setEnumerationArea] = useState('');
  const [province, setProvince] = useState('Select Province');
  const [district, setDistrict] = useState('Select District');
  const [llg, setLLG] = useState('Select LLG');
  const [ward, setWard] = useState('Select Ward');
  const [census_unit, setCensusUnit] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const navigation = useNavigation();

  // Function to handle form submission 
  const fetchLocations = async () => { 
    const allLocations = await getLocations(); 
    setLocations (allLocations);
  }; 
 
  useEffect(() => { 
    const setupDatabase = async () => { 
      await initializeDB(); 
      fetchLocations(); 
    }; 
 
    setupDatabase(); 
  }, []); 
 

  const handleSubmit = async () => {
    if (
      !enumeration_area || 
      province === "Select Province" ||
      district === "Select District" ||
      llg === "Select LLG" ||
      ward === "Select Ward" ||
      !census_unit
    ) {
      Alert.alert("Error", "Please fill in all fields correctly.");
      return;
    }

    try {
      if (editingLocationId) {
        // Update existing location
        await updateLocations(
          editingLocationId, 
          enumeration_area, 
          province, 
          district, 
          llg, 
          ward,
          census_unit
        );
        console.log("Location updated successfully");
    } else {
      // Add new location
      const id = await addLocation(
        enumeration_area, 
        province, 
        district, 
        llg, 
        ward, 
        census_unit
      );
      console.log("Location added successfully");
    }
      resetForm();
      fetchLocations(); // Refresh the list after adding/updating
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteLocations(id);
      fetchLocations(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const homeAddressDashboard = () => {
    (navigation as any).navigate('homeaddress');
  }
 
  const handleUpdateClick = (location: Location) => { 
    setEnumerationArea(location.enumeration_area); 
    setProvince(location.province); 
    setDistrict(location.district); 
    setLLG(location.llg); 
    setWard(location.ward); 
    setCensusUnit(location.census_unit); 
    setEditingLocationId(location.id);
  }; 
 
  const resetForm = () => { 
    // Clear the form after submission or update 
    setEnumerationArea(""); 
    setProvince("Select Province"); 
    setDistrict("Select District"); 
    setLLG("Select LLG"); 
    setWard("Select Ward"); 
    setCensusUnit(""); 
    setEditingLocationId(null); // Reset ID for creating new entries
  }; 

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image source={require('@/assets/images/interface-head-logo.png')} style={styles.reactLogo} />
        </View>
      <Text style={styles.header}>INDICATIVE INFORMATION</Text>

      <Text style={styles.label}>Workload No./Enumeration Area:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter enumeration area"
        value={enumeration_area}
        onChangeText={setEnumerationArea}
      />

      <Text style={styles.label}>Province:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={province} 
      onValueChange={(itemValue) => setProvince(itemValue)}
      >
        <Picker.Item label={"Select Province"}/>
        <Picker.Item label="ENB" value="enb"/>
        {/* Add provinces */}
      </Picker>
      </View>

      <Text style={styles.label}>District:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={district} 
      onValueChange={(itemValue) => setDistrict(itemValue)}
      >
        <Picker.Item label={"Select District"}/>
        <Picker.Item label="Rabaul" value="rabaul"/>
        {/* Add districts */}
      </Picker>
      </View>

      <Text style={styles.label}>Local Level Government (LLG):</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={llg} 
      onValueChange={(itemValue) => setLLG(itemValue)}
      >
        <Picker.Item label={"Select LLG"}/>
        <Picker.Item label="Kombiu Rural" value="kombiurural"/>
        {/* Add LLGs */}
      </Picker>  
      </View>

      <Text style={styles.label}>Ward:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={ward} 
      onValueChange={(itemValue) => setWard(itemValue)}
      >
        <Picker.Item label={"Select District"}/>
        <Picker.Item label="01. Baai" value="01baai"/>
        {/* Add wards */}
      </Picker> 
      </View>


      <Text style={styles.label}>Census Unit (CU):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your census unit"
        value={census_unit}
        onChangeText={setCensusUnit}
        keyboardType='numeric'
      />

      <View style={styles.buttonContainer}>
        <Button
        title='Submit'
        color="#f194ff"
        onPress={handleSubmit}
        />
      <Button 
      title={selectedLocation ? "Update" : "Next"}
      color="#f194ff"
      onPress={() => {
        homeAddressDashboard()
        }} 
        />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Enumeration Area</Text>
          <Text style={styles.tableHeaderText}>Province</Text>
          <Text style={styles.tableHeaderText}>District</Text>
          <Text style={styles.tableHeaderText}>LLG</Text>
          <Text style={styles.tableHeaderText}>Ward</Text>
          <Text style={styles.tableHeaderText}>Census Unit</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>
        {locations.map((location) => (
          <View key={location.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{location.enumeration_area}</Text>
            <Text style={styles.tableCell}>{location.province}</Text>
            <Text style={styles.tableCell}>{location.district}</Text>
            <Text style={styles.tableCell}>{location.llg}</Text>
            <Text style={styles.tableCell}>{location.ward}</Text>
            <Text style={styles.tableCell}>{location.census_unit}</Text>
            <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdateClick(location)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteClick(location.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center"
  },
  label: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f194ff",
    textAlign: "center",
    marginBottom: 30,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 5,
  },
  reactLogo: {
    height:120,
    width: 375,
    top: -10,
    left: 0,
    position: 'relative'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  deleteButton: { 
    backgroundColor: "#F44336", 
    padding: 5, 
    borderRadius: 5 },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    },
    buttonText: { color: "#fff", fontWeight: "bold" },
});

export default EnumerationAreaScreen;