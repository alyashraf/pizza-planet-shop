import OrderPage from '../components/Order/order';

function CreateOrder() {
	return (
		<>
			<OrderPage
				NewOrder={true}
				Order_ID={null}
				Size={'M'}
				Timestamp={null}
				Flavor={'BBQ'}
				Crust={'NORMAL'}
				Table_No={1}
			/>
		</>
	);
}

export default CreateOrder;
