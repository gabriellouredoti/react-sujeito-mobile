import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

export type StackParams = {
	Dashboard: undefined;
	Order: {
		number: number | string;
		order_id: number | string;
	};
	FinishOrder: {
		number: number | string;
		order_id: number | string;
	};
};

const Stack = createNativeStackNavigator<StackParams>();

function AppRoutes() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Dashboard"
				component={Dashboard}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Order"
				component={Order}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="FinishOrder"
				component={FinishOrder}
				options={{
					title: "Finalizando",
					headerStyle: {
						backgroundColor: "#1d1d2e",
					},
					headerTintColor: "#fff",
					headerTransparent: true,
				}}
			/>
		</Stack.Navigator>
	);
}

export default AppRoutes;
