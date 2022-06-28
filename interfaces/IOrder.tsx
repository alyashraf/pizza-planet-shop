export interface IOrder {
	Crust: string | undefined;
	Flavor: string | undefined;
	Order_ID: number | null | undefined;
	Size: string | undefined;
	Table_No: number | undefined;
	Timestamp: Date | null | undefined;
	NewOrder: boolean | undefined;
}
