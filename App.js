import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import SplashScreen from "./containers/SplashScreen";
import RoomDetailsScreen from "./containers/RoomDetailsScreen";
import AroundScreen from "./containers/AroundScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [userToken, setUserToken] = useState(null);
	const [userId, setUserId] = useState(null);

	const setToken = async (token) => {
		if (token) {
			await AsyncStorage.setItem("userToken", token);
		} else {
			await AsyncStorage.removeItem("userToken");
		}

		setUserToken(token);
	};

	useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			// We should also handle error for production apps
			const userToken = await AsyncStorage.getItem("userToken");

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			setUserToken(userToken);

			const id = await AsyncStorage.getItem("id");
			setUserId(id); // Met à jour le state avec l'ID récupéré

			setIsLoading(false);
		};

		bootstrapAsync();
	}, []);

	if (isLoading === true) {
		// We haven't finished checking for the token yet
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{userToken === null ? (
					// No token found, user isn't signed in
					<>
						<Stack.Screen name="SignIn" options={{ headerShown: false }}>
							{() => <SignInScreen setToken={setToken} />}
						</Stack.Screen>
						<Stack.Screen name="SignUp" options={{ headerShown: false }}>
							{() => <SignUpScreen setToken={setToken} />}
						</Stack.Screen>
					</>
				) : (
					// User is signed in ! 🎉
					<Stack.Screen name="Tab" options={{ headerShown: false }}>
						{() => (
							<Tab.Navigator
								screenOptions={{
									headerShown: false,
									tabBarActiveTintColor: "tomato",
									tabBarInactiveTintColor: "gray",
								}}
							>
								<Tab.Screen
									name="TabHome"
									options={{
										tabBarLabel: "Home",
										tabBarIcon: ({ color, size }) => (
											<Ionicons name={"ios-home"} size={size} color={color} />
										),
									}}
								>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Home"
												options={{ headerShown: false }}
											>
												{() => <HomeScreen />}
											</Stack.Screen>

											<Stack.Screen
												name="Profile"
												options={{
													title: "User Profile",
												}}
											>
												{() => <ProfileScreen />}
											</Stack.Screen>
											<Stack.Screen
												name="RoomDetails"
												options={{ headerShown: false }}
											>
												{(props) => <RoomDetailsScreen {...props} />}
											</Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen>
								<Tab.Screen
									name="TabProfile"
									options={{
										tabBarLabel: "Profile",
										tabBarIcon: ({ color, size }) => (
											<MaterialIcons
												name="account-box"
												size={size}
												color={color}
											/>
										),
									}}
								>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="MyAccount"
												options={{
													title: "My Account",
												}}
											>
												{() => (
													<ProfileScreen
														userId={userId}
														userToken={userToken}
														setUserToken={setUserToken}
													/>
												)}
											</Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen>

								<Tab.Screen
									name="TabAroundMe"
									options={{
										tabBarLabel: "Around Me",
										tabBarIcon: ({ color, size }) => (
											<FontAwesome
												name="map-marker"
												size={size}
												color={color}
											/>
										),
									}}
								>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Around Me"
												options={{
													title: "Around Me",
												}}
											>
												{() => <AroundScreen />}
											</Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen>

								{/* <Tab.Screen
									name="TabSettings"
									options={{
										tabBarLabel: "Settings",
										tabBarIcon: ({ color, size }) => (
											<Ionicons
												name={"ios-options"}
												size={size}
												color={color}
											/>
										),
									}}
								>
									{() => (
										<Stack.Navigator>
											<Stack.Screen
												name="Settings"
												options={{
													title: "Settings",
												}}
											>
												{() => <SettingsScreen setToken={setToken} />}
											</Stack.Screen>
										</Stack.Navigator>
									)}
								</Tab.Screen> */}
							</Tab.Navigator>
						)}
					</Stack.Screen>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
