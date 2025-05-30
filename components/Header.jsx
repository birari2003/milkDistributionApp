import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const Header = ({ title, onMenuPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuIcon}>
                <Ionicons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.border,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        marginTop: 30,
        shadowOffset: { width: 0, height: 2 },
    },
    menuIcon: {
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
});

export default Header;
