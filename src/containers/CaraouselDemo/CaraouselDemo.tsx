import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Caraousel from './components/Caraousel';


interface ScreenProps extends NativeStackScreenProps<any> {

}

const IMAGES = [
    "https://images.unsplash.com/photo-1660659236367-710aa4ae7e19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1520564816385-4f9d711941aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1512850183-6d7990f42385?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
]

const CaraouselDemo: React.FC<ScreenProps> = () => {


    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>
                Images Caraousel Demo
            </Text>

            <Caraousel
                data={IMAGES}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10
    },
    title: {
        fontSize: 24,
        marginVertical: 40,
        fontWeight: 'bold',
        textAlign: 'center',

    },

});

export default CaraouselDemo;