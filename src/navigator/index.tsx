import React, { FC } from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Main from "containers/Main";

import { setNavigator } from "./navHelper";



const Stack = createNativeStackNavigator()

const Routers = () => {

    return (
        <NavigationContainer
            ref={(ref) => setNavigator(ref)}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>

                <Stack.Screen name="Main" component={Main} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routers