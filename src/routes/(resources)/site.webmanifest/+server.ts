import { jsonResponse } from '$lib/utils/response';
import type { RequestHandler } from './$types';
import { resolveRoute } from '$app/paths';


export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	return jsonResponse({
		name: 'KioskSurvey',
		short_name: 'KioskSurvey',
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
		theme_color: '#ffffff',
		background_color: '#ffffff',
		display: 'standalone'
	});
};