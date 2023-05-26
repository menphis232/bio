import { Network } from '@capacitor/network';

export const currentNetworkStatus = async (): Promise<boolean> => {
	const conn = await Network.getStatus()
	return conn.connected
};
