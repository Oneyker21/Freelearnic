import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectList from '../ProjectList'; // Ensure the path is correct
import { db } from '../../config/firebaseConfig'; // Ensure the path is correct
import { doc, getDoc } from 'firebase/firestore';

const HomeScreenFreelancer = ({ route }) => {
  const { freelancerId } = route.params; // Get the freelancer ID from route parameters
  console.log('Freelancer ID in HomeScreenFreelancer:', freelancerId);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancers', freelancerId); // Change 'Freelancer' to your collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Here you can handle the data if necessary
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching freelancer data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <ProjectList route={{ params: { freelancerId } }} showProposalButton={true} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfileFreelancer', { freelancerId })} // Make sure to pass freelancerId here
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Messaging', { freelancerId })} // Make sure to pass freelancerId here
        >
          <Text style={styles.buttonText}>Chats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // Spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreenFreelancer;
