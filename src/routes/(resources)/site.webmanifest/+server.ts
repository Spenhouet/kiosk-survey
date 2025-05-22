import { jsonResponse } from '$lib/utils/response';
import type { RequestHandler } from './$types';
import { resolveRoute } from '$app/paths';


export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	return jsonResponse({
        id: 'kiosk-survey',
		name: 'KioskSurvey',
		short_name: 'KioskSurvey',
        description: 'KioskSurvey is a survey application that allows users to create and manage offline surveys easily.',
		icons: [
			{
				src: resolveRoute('/android-chrome-192x192.png', {}),
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: resolveRoute('/android-chrome-512x512.png', {}),
				sizes: '512x512',
				type: 'image/png'
			}
		],
        start_url: ".",
		theme_color: '#eed7f9',
		background_color: '#ffffff',
		display: 'standalone'
	});
};