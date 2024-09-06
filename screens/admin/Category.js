import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const navigation = useNavigation();

    const handleAddCategory = async () => {
        if (!categoryName) {
            Alert.alert('Error', 'Por favor ingresa un nombre de categoría');
            return;
        }

        try {
            const categoryId = `categoria_${Date.now()}`; // Generar un ID único
            await setDoc(doc(db, "categorias", categoryId), {
                nombre: categoryName,
                fecha_creacion: new Date().toISOString(),
            });

            Alert.alert('Éxito', 'Categoría añadida correctamente');
            setCategoryName(''); // Limpiar el input
        } catch (error) {
            console.error('Error al añadir la categoría: ', error);
            Alert.alert('Error', 'No se pudo añadir la categoría');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir Categoría</Text>
            <TextInput 
                style={styles.input} 
                value={categoryName} 
                onChangeText={setCategoryName} 
                placeholder="Nombre de la categoría" 
            />
            <TouchableOpacity onPress={handleAddCategory} style={styles.button}>
                <Text style={styles.buttonText}>Añadir</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AddCategory;
