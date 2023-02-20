import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Modal,
	FlatList,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";

import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

type RouteDetailParams = {
	Order: {
		number: string | number;
		order_id: string | number;
	};
};

type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

type CategoryProps = {
	id: string;
	name: string;
};

type ProductProps = {
	id: string;
	name: string;
};

type ItemProps = {
	id: string;
	product_id: string;
	name: string;
	amount: string | number;
};

export default function Order() {
	const route = useRoute<OrderRouteProps>();
	const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

	const [category, setCategory] = useState<CategoryProps[] | []>();
	const [categorySelected, setCategorySelected] = useState<
		CategoryProps | undefined
	>();

	const [amount, setAmount] = useState("1");

	const [items, setItems] = useState<ItemProps[] | []>([]);

	const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

	const [products, setProducts] = useState<ProductProps[] | []>([]);
	const [productSelected, setProductSelected] = useState<
		ProductProps | undefined
	>();

	const [modalProductVisible, setModalProductVisible] = useState(false);

	useEffect(() => {
		async function loadInfo() {
			try {
				const response = await api.get("/category");
				const { data } = response;

				setCategory(data);
				setCategorySelected(data[0]);
			} catch (error) {
				console.log("erro", error);
			}
		}

		loadInfo();
	}, []);

	useEffect(() => {
		async function loadProducts() {
			const response = await api.get("/category/product", {
				params: {
					category_id: categorySelected?.id,
				},
			});

			const { data } = response;

			setProducts(data);
			setProductSelected(data[0]);
		}

		loadProducts();
	}, [categorySelected]);

	async function handleCloseOrder() {
		try {
			const response = await api.delete("/order", {
				params: {
					order_id: route.params?.order_id,
				},
			});

			navigation.goBack();
		} catch (error) {
			console.log("erro", error);
		}
	}

	function handleChangeCategory(item: CategoryProps) {
		setCategorySelected(item);
	}

	function handleChangeProduct(item: ProductProps) {
		setProductSelected(item);
	}

	async function handleAdd() {
		if (productSelected && Number(amount) == 0) {
			return;
		}

		try {
			const response = await api.post("/order/add", {
				order_id: route.params?.order_id,
				product_id: productSelected?.id,
				amount: Number(amount),
			});

			let data = {
				id: response.data.id,
				amount: response.data.amount as string,
				product_id: productSelected?.id as string,
				name: productSelected?.name as string,
			};

			setItems((oldArray) => [...oldArray, data]);
		} catch (error) {
			console.log("erro", error);
		}
	}

	async function handleDeleteItem(item_id: string) {
		if (item_id == "") {
			return;
		}

		try {
			const response = await api.delete("/order/remove", {
				params: {
					item_id: item_id,
				},
			});

			setItems(items.filter((i) => i.id != item_id));
		} catch (error) {}
	}

	function handleFinish() {
		navigation.navigate("FinishOrder", {
			number: route.params?.number,
			order_id: route.params?.order_id,
		});
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Mesa {route.params.number}</Text>
				{items.length == 0 && (
					<TouchableOpacity onPress={handleCloseOrder}>
						<Feather name="trash-2" size={28} color="#ff3f4b" />
					</TouchableOpacity>
				)}
			</View>

			{category?.length != 0 && (
				<TouchableOpacity
					style={styles.input}
					onPress={() => setModalCategoryVisible(true)}
				>
					<Text style={{ color: "#fff" }}>{categorySelected?.name}</Text>
				</TouchableOpacity>
			)}

			{products?.length != 0 && (
				<TouchableOpacity
					style={styles.input}
					onPress={() => setModalProductVisible(true)}
				>
					<Text style={{ color: "#fff" }}>{productSelected?.name}</Text>
				</TouchableOpacity>
			)}

			<View style={styles.qtdContainer}>
				<Text style={styles.qtdText}>Quantidade</Text>
				<TextInput
					style={[styles.input, { width: "60%", textAlign: "center" }]}
					value={amount}
					onChangeText={setAmount}
					placeholderTextColor="#f0f0f0 "
					keyboardType="numeric"
				/>
			</View>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
					<Text style={styles.buttonText}>+</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.buttonAAAA, { opacity: items.length == 0 ? 0.3 : 1 }]}
					disabled={items.length == 0}
					onPress={handleFinish}
				>
					<Text style={styles.buttonText}>Avançar</Text>
				</TouchableOpacity>
			</View>

			{/* {items.length > 0 && ( */}
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, marginTop: 24 }}
				data={items}
				keyExtractor={(item: ItemProps) => item?.id}
				renderItem={({ item }) => (
					<ListItem data={item} deleteItem={handleDeleteItem} />
				)}
			/>
			{/* )} */}

			{category && (
				<Modal
					transparent={true}
					visible={modalCategoryVisible}
					animationType="slide"
				>
					<ModalPicker
						options={category}
						handleCloseModal={() => setModalCategoryVisible(false)}
						selectedItem={handleChangeCategory}
					/>
				</Modal>
			)}

			{products && (
				<Modal
					transparent={true}
					visible={modalProductVisible}
					animationType="slide"
				>
					<ModalPicker
						options={products}
						handleCloseModal={() => setModalProductVisible(false)}
						selectedItem={handleChangeProduct}
					/>
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1d1d2e",
		paddingVertical: "5%",
		paddingEnd: "4%",
		paddingStart: "4%",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		marginTop: 24,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#fff",
		marginRight: 14,
	},
	input: {
		backgroundColor: "#101026",
		borderRadius: 4,
		width: "100%",
		height: 40,
		marginBottom: 12,
		justifyContent: "center",
		paddingHorizontal: 8,
		color: "#fff",
		fontSize: 20,
	},
	qtdContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	qtdText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	actions: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
	},
	buttonAdd: {
		width: "20%",
		height: 40,
		backgroundColor: "#3fd1ff",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#101026",
		fontSize: 18,
		fontWeight: "bold",
	},

	buttonAAAA: {
		backgroundColor: "#3fffa3",
		height: 40,
		width: "75%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 4,
	},
});
