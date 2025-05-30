import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const InfoCard = ({ title, value }) => (
    <View style={styles.card}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        flex: 1,
        margin: 6,
    },
    label: {
        color: colors.muted,
        fontSize: 18,
        fontWeight: '600',
    },
    value: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
});

export default InfoCard;
