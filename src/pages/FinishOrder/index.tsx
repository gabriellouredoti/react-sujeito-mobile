import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";

import { api } from "../../services/api";

type RouteFinishParams = {
	FinishOrder: {
		number: string | number;
		order_id: string | number;
	};
};

type FinishRouteProps = RouteProp<RouteFinishParams, "FinishOrder">;

export default function FinishOrder() {
	const route = useRoute<FinishRouteProps>();
	const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

	async function sendOrder() {
		try {
			const response = await api.put("order/send", {
				order_id: route.params?.order_id,
			});

			navigation.popToTop();
		} catch (error) {
			console.log("erro", error);
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.alert}>Você deseja finalizar este pedido?</Text>
			<Text style={styles.title}>Mesa {route.params?.number}</Text>

			<TouchableOpacity style={styles.button} onPress={sendOrder}>
				<Text style={styles.textButton}>Finalizar Pedido</Text>
				<Feather size={20} color="#1d1d2e" name="shopping-bag" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1d1d2e",
		paddingVertical: "5%",
		paddingHorizontal: "4%",
	},
	alert: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 12,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 12,
	},
	button: {
		backgroundColor: "#3fffa3",
		flexDirection: "row",
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		width: "65%",
		borderRadius: 4,
	},
	textButton: {
		fontSize: 18,
		marginRight: 8,
		fontWeight: "bold",
		color: "#1d1d2e",
	},
});
