import { StyleSheet, Text, View, Image, TextInput, Button, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { 
  addComments, 
  initializeDB, 
  getComments, 
  updateComments, 
  deleteComments,
  Comments
} from '@/database';
import { useNavigation } from 'expo-router'; 

const confirmation = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comments[]>([]);
  const [editingCommentsId, setEditingCommentsId] = useState<number | null>(null);
  const navigation = useNavigation();

  //Function to handle form submission
  const fetchComments = async () => {
    const allComments = await getComments();
    setComments(allComments);
  };

  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDB();
    }

    setupDatabase();
  }, [])

  const handleSubmit = async () => {
    if (
      !comment
    ) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }

    try {
      if (editingCommentsId) {
        // Update existing comments
        await updateComments(
          editingCommentsId,
          comment
        );
        console.log('Comments updated successfully');
      } else {
        // Add new comments
        const id = await addComments(
          comment
        );
        console.log('Comments added successfully');
      }
      resetForm();
      fetchComments();
    } catch (error) {
      console.error("Error adding comments:", error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteComments(id);
      fetchComments(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting comments:", error);
    }
  };

  const handleUpdateClick = (comment: Comments) => {
    setEditingCommentsId(comment.id);
    setComments([comment]);
  };

  const resetForm = () => {
    setEditingCommentsId(null);
    setComments([]);
  };

  const completeDashboard = () => {
    (navigation as any).navigate('complete');
  }

  return (
      <View style={styles.container}>
        <View>
          <Image source={require('@/assets/images/interface-head-logo.png')} style={styles.reactLogo} />
        </View>
        <Text style={styles.header}>confirmation</Text>

        <Text style={styles.label}>Comments</Text>
        <TextInput
        style={styles.input}
        placeholder='Make any comments or ask questions if any.'
        />

        <Button title="Submit" 
        color="#f194ff"
        onPress={() => {
          handleSubmit();
          completeDashboard()
          }} />
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Comments</Text>
            <Text style={styles.tableHeaderText}>Actions</Text>
          </View>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{comment.id}</Text>
              <Text style={styles.tableCell}>{comment.comments}</Text>
              <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => handleUpdateClick(comment)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteClick(comment.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
  );
};

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
    position: 'relative'
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

export default confirmation;