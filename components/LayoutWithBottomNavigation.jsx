import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';

export default function LayoutWithBottomNavigation({ children }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
            <BottomTabNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingBottom: 60, // Leave space for bottom nav
    },
});
