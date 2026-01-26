import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const TabIcon = ({focused,title}:any)=>{
    return(
    <View style={{
        alignItems:"center",
        margin:"auto"
        }} >
    <Text style={{
        fontSize:10
        }}>
        {title}
    </Text>
    </View>
    )
}

const _Layout = ()=>{
    return(
        <Tabs
        screenOptions={{
            tabBarShowLabel:false,
            tabBarItemStyle:{
                minWidth:40,
                minHeight:20
            }
        }}>
            <Tabs.Screen
            name="index"
            options={{
                headerShown:false,
                tabBarIcon:({focused})=>(
                    <TabIcon
                    focused = {focused}
                    title = 'index'/>
                )
            }}
            />
            <Tabs.Screen
            name="discover"
            options={{
                headerShown:false,
                tabBarIcon:({focused})=>(
                    <TabIcon
                    focused = {focused}
                    title = 'Discover'/>
                )
            }}
            />
            <Tabs.Screen
            name="connect"
            options={{
                headerShown:false,
                tabBarIcon:({focused})=>(
                    <TabIcon
                    focused = {focused}
                    title = 'Connect'/>
                )
            }}
            />
            <Tabs.Screen
            name="items"
            
            options={{
                headerShown:false,
                tabBarIcon:({focused})=>(
                    <TabIcon
                    focused = {focused}
                    title = 'Items'/>
                )
            }}
            />
            <Tabs.Screen
            name="settings"
            options={{
                headerShown:false,
                tabBarIcon:({focused})=>(
                    <TabIcon
                    focused = {focused}
                    title = 'Settings'/>
                )
            }}
            />
        </Tabs>
    )
}
export default _Layout;