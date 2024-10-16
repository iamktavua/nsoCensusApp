import React, { Component, useEffect, useState } from 'react'
import { 
    Alert, 
    Button, 
    Text, 
    TextInput, 
    View, 
    StyleSheet, 
    ScrollView, 
    Image, 
    Platform, 
    TouchableOpacity
} from 'react-native'
import { 
    addRegistry, 
    getRegistry, 
    updateRegistry, 
    deleteRegistry, 
    initializeDB, 
    Registry 
} from '@/database';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Date Picker
import { Checkbox, RadioButton as PaperRadioButton } from 'react-native-paper';
import { useNavigation } from 'expo-router'; 

const registry = () => {
    // States for input
    const [occupants, setOccupants] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [sex, setSex] = useState('');
    const [dob, setDob] = useState(new Date());
    const [maritalStatus, setMaritalStatus] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [selectedDob, setSelectedDob] = useState('');
    const [country, setCountry] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false); // Handle visibility of Date Picker
    const [registries, setRegistries] = useState<Registry[]>([]);
    const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(null);
    const [editingRegistryId, setEditingRegistryId] = useState<number | null>(null);
    const navigation = useNavigation();
    

    const onChangeDob = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === "ios");
        setDob(currentDate);
      };

    // Function to handle form submission
    const fetchRegistries = async () => {
        const allRegistries = await getRegistry();
        setRegistries(allRegistries);
    };

    useEffect(() => {
        const setupDatabase = async () => {
            await initializeDB();
            fetchRegistries();
        };

        setupDatabase();
    }, []);

    const handleSubmit = async () => {
        if (
            !occupants ||
            !firstName ||
            !lastName ||
            relationship === "Select Relationship" ||
            !sex ||
            maritalStatus === "Select Marital Status" ||
            !citizenship
        ) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            if (editingRegistryId) {
                // Update existing registry
                await updateRegistry(
                    editingRegistryId,
                    occupants,
                    firstName,
                    lastName,
                    relationship,
                    sex,
                    dob.toISOString(),
                    maritalStatus,
                    citizenship
                );
                console.log('Registry updated successfully with ID:', editingRegistryId);
            } else {
                // Add new registry
                const id = await addRegistry(
                    occupants,
                    firstName,
                    lastName,
                    relationship,
                    sex,
                    dob.toISOString(),
                    maritalStatus,
                    citizenship
                );
                console.log('Registry added successfully with ID:', id);
            }
            resetForm();
            fetchRegistries(); // Refresh the list after saving
        } catch (error) {
            console.error('Error saving registry:', error);
        }
    };

    const handleDeleteClick = async (id: number) => {
        try {
            await deleteRegistry(id);
            console.log('Registry deleted successfully');
            fetchRegistries(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting registry:', error);
        }
    };

    const homeAddressDashboard = () => {
        (navigation as any).navigate('homeaddress');
    }

    const confirmationDashboard = () => {
        (navigation as any).navigate('confirmation');
    }

    const handleUpdateClick = (registry: Registry) => {
        // Populate the form with the selected registry's data
        setOccupants(registry.occupants);
        setFirstName(registry.firstName);
        setLastName(registry.lastName);
        setRelationship(registry.relationship);
        setSex(registry.sex);
        setDob(new Date(registry.dob));
        setMaritalStatus(registry.maritalStatus);
        setCitizenship(registry.citizenship);
        setEditingRegistryId(registry.id);
    };

    const resetForm = () => {
        // Clear the forms after submission or update
        setOccupants('');
        setFirstName('');
        setLastName('');
        setRelationship("Select Relationship");
        setSex('');
        setDob(new Date());
        setMaritalStatus("Select Marital Status");
        setCitizenship('');
        setEditingRegistryId(null); // Reset the ID for creating new entries
    };
    
    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <Image style={styles.reactLogo} source={require('@/assets/images/interface-head-logo.png')} />
                </View>
                <Text style={styles.label}>Number of Occupants:</Text>
                <TextInput
                style={styles.input}
                placeholder="Enter number of occupants"
                value={occupants}
                onChangeText={setOccupants}
                />
                <Text style={styles.label}>Name:</Text>
                <View style={styles.nameContainer}>
                    <TextInput
                    style={styles.nameInput}
                    placeholder="Enter first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    />
                    <TextInput
                    style={styles.nameInput}
                    placeholder="Enter last name"
                    value={lastName}
                    onChangeText={setLastName}
                    /> 
                </View>

                <Text style={styles.label}>Relation to Head of Household:</Text>
                <View style={styles.pickerContainer}>
                <Picker selectedValue={relationship} 
                onValueChange={(itemValue) => setRelationship(itemValue)}
                >
                    <Picker.Item label={"Select Relationship"}/>
                    <Picker.Item label="Head of Household" value="head"/>
                    <Picker.Item label="Husband/Wife" value="spouse"/>
                    <Picker.Item label="Unmarried Children" value="unmarried"/>
                    <Picker.Item label="Married Children and their family" value="married"/>
                    <Picker.Item label="Other Relatives" value="others"/>
                    <Picker.Item label="Non-Relatives/visitors" value="non"/>
                    {/* Add provinces */}
                </Picker>
                </View>


                <Text style={styles.label}>Sex:</Text>
                <View style={styles.nameContainer}>
                <PaperRadioButton 
                value="Male"
                status={sex === 'Male' ? 'checked' : 'unchecked'}
                onPress={() => setSex('Male')}
                />
                <Text>Male</Text>
                <PaperRadioButton 
                value="Female"
                status={sex === 'Female' ? 'checked' : 'unchecked'}
                onPress={() => setSex('Female')}
                />
                <Text>Female</Text>
                </View>


                <Button
                color="#f194ff" 
                title="Select Date of Birth" 
                onPress={() => setShowDatePicker(true)} 
                ></Button> 
                {showDatePicker && (
                    <DateTimePicker
                    value={dob} 
                    mode="date" 
                    display="default" 
                    onChange={onChangeDob}
                    /> 
                )}

                <Text style={styles.dateText}> 
                Date of Birth: {dob.toString()} 
                </Text>
                
                <Text style={styles.label}>Marital Status:</Text>
                <View style={styles.pickerContainer}>
                <Picker selectedValue={maritalStatus} 
                onValueChange={(itemValue) => setMaritalStatus(itemValue)}
                >
                    <Picker.Item label={"Select Relationship"}/>
                    <Picker.Item label="Not Married" value="not_married"/>
                    <Picker.Item label="Married" value="married"/>
                    <Picker.Item label="Separated" value="separated"/>
                    <Picker.Item label="Devorced" value="devorced"/>
                    <Picker.Item label="Widowed" value="widowed"/>
                </Picker>
                </View>

                <Text style={styles.label}>Citizenship:</Text>
                <View style={styles.nameContainer}>
                <PaperRadioButton 
                value="PNG Citizen"
                status={citizenship === 'PNG Citizen' ? 'checked' : 'unchecked'}
                onPress={() => setCitizenship('PNG Citizen')}
                />
                <Text>PNG Citizen</Text>
                <PaperRadioButton 
                value="Non-PNG Citizen"
                status={citizenship === 'Non-PNG Citizen' ? 'checked' : 'unchecked'}
                onPress={() => setCitizenship('Non-PNG Citizen')}
                />
                <Text>Non-PNG Citizen</Text>
                </View>
                {citizenship === 'Non-PNG Citizen' && (
                    <TextInput
                    style={styles.input}
                    placeholder="Enter your country"
                    value={country}
                    onChangeText={setCountry}
                    />
                )}

                <Button
                title={selectedRegistry ? "Update" : "Submit"}
                onPress={handleSubmit}
                color="#f194ff"
                /> 

                <View style={styles.buttonContainer}>
                <Button
                title='Prev'
                color="#f194ff"
                onPress={homeAddressDashboard}
                />

                <Button 
                title="Next" 
                color="#f194ff"
                onPress={confirmationDashboard} />
                </View>

                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Occupants</Text>
                        <Text style={styles.tableHeaderText}>First Name</Text>
                        <Text style={styles.tableHeaderText}>Last Name</Text>
                        <Text style={styles.tableHeaderText}>Relationship</Text>
                        <Text style={styles.tableHeaderText}>Sex</Text>
                        <Text style={styles.tableHeaderText}>DOB</Text>
                        <Text style={styles.tableHeaderText}>Marital Status</Text>
                        <Text style={styles.tableHeaderText}>Citizenship</Text>
                        <Text style={styles.tableHeaderText}>Country</Text>
                        <Text style={styles.tableHeaderText}>Actions</Text>
                    </View>
                    {registries.map((registry, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{registry.occupants}</Text>
                            <Text style={styles.tableCell}>{registry.firstName}</Text>  
                            <Text style={styles.tableCell}>{registry.lastName}</Text>
                            <Text style={styles.tableCell}>{registry.relationship}</Text>
                            <Text style={styles.tableCell}>{registry.sex}</Text>
                            <Text style={styles.tableCell}>{registry.dob}</Text>
                            <Text style={styles.tableCell}>{registry.maritalStatus}</Text>
                            <Text style={styles.tableCell}>{registry.citizenship}</Text>
                            <Text style={styles.tableCell}>{registry.country}</Text>
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={() => handleUpdateClick(registry)}
                                >
                                <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteClick(registry.id)}
                                >
                                <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        gap: 5
    },
    label: {
        marginVertical: 10,
        fontWeight: "bold",
    },
    reactLogo: {
        height:120,
        width: 375,
        top: -10,
        left: 0,
        position: 'relative'
    },
    dateText: {
        marginTop: 10,
        marginBottom: 20,
        fontSize: 16,
        color: "#666",
    },
    nameInput: {
        flex: 1,
        marginRight: 5,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    nameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 5,
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
        borderRadius: 5 
    },
    updateButton: {
        backgroundColor: "#4CAF50",
        padding: 5,
        borderRadius: 5,
        marginRight: 5,
    },
    buttonText: { color: "#fff", fontWeight: "bold" },
});

export default registry