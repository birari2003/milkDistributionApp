import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AreaScreen() {
  const [areaName, setAreaName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddArea = async () => {
    setSuccessMessage('');
    if (!areaName || !landmark) {
      setSuccessMessage('');
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.43.175:3000/api/add-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area_name: areaName, landmark }),
      });

      const data = await response.json();
      if (data.success) {
        setAreaName('');
        setLandmark('');
        setSuccessMessage('Area added successfully!');
      } else {
        setSuccessMessage('');
        alert(data.message || 'Failed to add area');
      }
    } catch (err) {
      setSuccessMessage('');
      alert('Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Area</Text>

      <TextInput
        style={styles.input}
        placeholder="Area Name"
        value={areaName}
        onChangeText={setAreaName}
      />
      <TextInput
        style={styles.input}
        placeholder="Landmark"
        value={landmark}
        onChangeText={setLandmark}
      />

      <Button title="Add Area" onPress={handleAddArea} />

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  successText: {
    color: 'green',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
