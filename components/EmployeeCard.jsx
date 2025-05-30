import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const EmployeeCard = ({ name }) => (
    <View style={styles.container}>
        <Image
            source={require('../assets/user.png')}
            style={styles.avatar}
        />
        <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>Milk Distributor</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
        marginRight: 16,
    },
    name: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '600',
    },
    role: {
        fontSize: 15,
        color: colors.primary,
    },
});

export default EmployeeCard;
