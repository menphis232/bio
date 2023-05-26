import { useIonLoading } from '@ionic/react';

export function useLoading() {
	const [present, dismiss] = useIonLoading();

	function presentLoading() {
		present({
			spinner: 'dots',
		});
	}

	function dismissLoading() {
		console.log('dismiss');
		dismiss();
	}

	return {
		presentLoading,
		dismissLoading,
	};
}
