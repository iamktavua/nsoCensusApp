import { Alert, StyleSheet, Text, TextInput, View, Image, ScrollView, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    addHomeAddress,
    getHomeAddress,
    updateHomeAddress,
    deleteHomeAddress,
    initializeDB,
    HomeAddress
} from '@/database';
import { useNavigation } from 'expo-router'; 

const homeaddress = () => {
    // States for input
    const [locality, setLocality] = useState('');
    const [section, setSection] = useState('');
    const [lot, setLot] = useState('');
    const [structureRecordNo, setStructureRecordNo] = useState('');
    const [pdNo, setPdNo] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [homeAddresses, setHomeaddress] = useState<HomeAddress[]>([]);
    const [selectedHomeaddress, setSelectedHomeaddress] = useState<HomeAddress | null>(null);
    const [editingHomeaddressId, setEditingHomeaddressId] = useState<number | null>(null);
    const navigation = useNavigation();

    // Function to handle form submission
    const fetchHomeaddress = async () => {
        const allHomeaddress = await getHomeAddress();
        setHomeaddress(allHomeaddress);
    };

    useEffect(() => {
        const setupDatabase = async () => {
            await initializeDB();
            fetchHomeaddress();
        };

        setupDatabase();
    }, []);

    const handleSubmit = async () => {
        if (
            !locality || 
            !section || 
            !lot || 
            !structureRecordNo || 
            !pdNo || 
            !houseNo
        ) {
            Alert.alert('Error', 'Please fill in all fields correctly');
            return;
        }

        try {
            if (editingHomeaddressId) {
                // Update existing homeaddress
                await updateHomeAddress(
                    editingHomeaddressId,
                    locality,
                    section,
                    lot,
                    structureRecordNo,
                    pdNo,
                    houseNo
                );
                console.log('Homeaddress updated successfully');
            } else {
                // Add new homeaddress
                const id = await addHomeAddress(
                    locality,
                    section,
                    lot,
                    structureRecordNo,
                    pdNo,
                    houseNo
                );
                console.log('Homeaddress created successfully with ID:', id);
            }
            resetForm();
            fetchHomeaddress(); // Refresh the list after saving
        } catch (error) {
            console.error('Error saving homeaddress:', error);
        }
    };

    const handleDeleteClick = async (id: number) => {
        try {
            await deleteHomeAddress(id);
            console.log('Homeaddress deleted successfully');
            fetchHomeaddress(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting homeaddress:', error);
        }
    };

    const indicativeDashboard = () => {
        (navigation as any).navigate('indicative');
    }

    const registryDashboard = () => {
        (navigation as any).navigate('registry');
    }

    const handleUpdateClick = (homeaddress: HomeAddress) => {
        // Populate the form with the selected homeaddress's data
        setLocality(homeaddress.locality);
        setSection(homeaddress.section);
        setLot(homeaddress.lot);
        setStructureRecordNo(homeaddress.structure_record_no);
        setPdNo(homeaddress.pd_no);
        setHouseNo(homeaddress.house_no);
        setEditingHomeaddressId(homeaddress.id);
    };

    const resetForm = () => {
        // Clear the form after submission or update
        setLocality("");
        setSection("");
        setLot("");
        setStructureRecordNo("");
        setPdNo("");
        setHouseNo("");
        setEditingHomeaddressId(null); // Reset the ID for creating new entries
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <Image style={styles.reactLogo} source={require('@/assets/images/interface-head-logo.png')} />
                </View>
                <Text style={styles.header}>Home Address</Text>
                {/* Text Input */} 
                <Text style={styles.label}>Locality</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current locality'
                value={locality}
                onChangeText={setLocality}
                placeholderTextColor="#888"
                />
                {/* Number Input */}
                <Text style={styles.label}>Section</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current section No.'
                value={section}
                onChangeText={setSection}
                keyboardType='numeric'
                placeholderTextColor="#888"
                />

                <Text style={styles.label}>Lot</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current lot No.'
                value={lot}
                onChangeText={setLot}
                keyboardType='numeric'
                placeholderTextColor="#888"
                />

                <Text style={styles.label}>Structure Record No.</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current record No.'
                value={structureRecordNo}
                onChangeText={setStructureRecordNo}
                keyboardType='numeric'
                placeholderTextColor="#888"
                />

                <Text style={styles.label}>Pd No.</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current PD No.'
                value={pdNo}
                onChangeText={setPdNo}
                keyboardType='numeric'
                placeholderTextColor="#888"
                />

                <Text style={styles.label}>House No.</Text>
                <TextInput
                style={styles.input}
                placeholder='Enter current house No.'
                value={houseNo}
                onChangeText={setHouseNo}
                keyboardType='numeric'
                placeholderTextColor="#888"
                />

                <Button
                title={selectedHomeaddress ? "Update" : "Submit"}
                onPress={handleSubmit}
                color="#f194ff"
                /> 

                <View style={styles.buttonContainer}>
                <Button
                title='Prev'
                color="#f194ff"
                onPress={indicativeDashboard} />

                <Button 
                title="Next" 
                color="#f194ff"
                onPress={registryDashboard} />
                </View>

                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Locality</Text>
                        <Text style={styles.tableHeaderText}>Section</Text>
                        <Text style={styles.tableHeaderText}>Lot</Text>
                        <Text style={styles.tableHeaderText}>Structure Record No.</Text>
                        <Text style={styles.tableHeaderText}>Pd No.</Text>
                        <Text style={styles.tableHeaderText}>House No.</Text>
                        <Text style={styles.tableHeaderText}>Actions</Text>

                    </View>
                    {homeAddresses.map((homeaddress) => (
                        <View key={homeaddress.id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{homeaddress.locality}</Text>
                            <Text style={styles.tableCell}>{homeaddress.section}</Text>
                            <Text style={styles.tableCell}>{homeaddress.lot}</Text>
                            <Text style={styles.tableCell}>{homeaddress.structure_record_no}</Text>
                            <Text style={styles.tableCell}>{homeaddress.pd_no}</Text>
                            <Text style={styles.tableCell}>{homeaddress.house_no}</Text>
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={() => handleUpdateClick(homeaddress)}
                                >
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteClick(homeaddress.id)}
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
        gap: 5,
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
    submitButton: {
        color:"#f194ff"
    }

});

export default homeaddress;


