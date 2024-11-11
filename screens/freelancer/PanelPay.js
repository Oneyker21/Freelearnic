import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const PanelPay = ({ freelancerId }) => {
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const freelancerAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId);
                const docSnap = await getDoc(freelancerAccountRef);

                if (docSnap.exists()) {
                    setTotalBalance(docSnap.data().totalBalance);
                } else {
                    console.log("No se encontró la cuenta del freelancer.");
                }
            } catch (error) {
                console.error("Error al obtener el balance del freelancer:", error);
            }
        };

        if (freelancerId) {
            fetchBalance();
        } else {
            console.log("Freelancer ID no proporcionado");
        }
    }, [freelancerId]);

    return (
        <View style={styles.container}>
            <Text style={styles.balanceText}>Balance Total: ${totalBalance}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default PanelPay;
