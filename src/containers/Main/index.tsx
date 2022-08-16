import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


const github_url = "https://github.com/poojan010"

const portfolio_url = "https://poojan-bhatt.netlify.app/"


interface ScreenProps extends NativeStackScreenProps<any> {

}

const Main: React.FC<ScreenProps> = () => {

    const openGithub = () => {
        Linking.openURL(github_url)
    }

    const openPortfolio = () => {
        Linking.openURL(portfolio_url)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                {"Hello Rn Dev \n\n Enjoy this awesome template created by "}
                <Text style={styles.name}>Poojan Bhatt</Text>
            </Text>

            <TouchableOpacity onPress={openGithub}>
                <Text style={styles.linkText}>
                    Checkout my Github Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openPortfolio}>
                <Text style={styles.linkText}>
                    Checkout my Portfolio
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    greeting: {
        margin: 16,
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        marginHorizontal: 40
    },
    name: {
        color: 'red',
        fontSize: 20
    },
    linkText: {
        margin: 16,
        fontSize: 16,
        color: 'blue',
        textAlign: 'center',

    }
});

export default Main;