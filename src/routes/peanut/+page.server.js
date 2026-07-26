import { fail } from '@sveltejs/kit';

const normalizeHexColor = (value) => {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim().toLowerCase();

	if (/^#[0-9a-f]{6}$/.test(trimmed)) {
		return trimmed;
	}

	if (/^#[0-9a-f]{8}$/.test(trimmed)) {
		// Drop alpha channel and keep standard #RRGGBB format.
		return trimmed.slice(0, 7);
	}

	if (/^#[0-9a-f]{3}$/.test(trimmed)) {
		return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
	}

	return null;
};

const extractUserColors = (row) => {
	if (!row || typeof row !== 'object') {
		return { fillHex: null, strokeHex: null };
	}

	const fillHex = normalizeHexColor(row.fillhex ?? row.fill_hex ?? row.fillHex);
	const strokeHex = normalizeHexColor(row.strokehex ?? row.stroke_hex ?? row.strokeHex);

	return { fillHex, strokeHex };
};

export const load = async ({ locals }) => {
	const {
		data: { user },
		error: authError,
	} = await locals.supabase.auth.getUser();

	if (authError || !user) {
		return { fillHex: null, strokeHex: null };
	}

	const { data, error } = await locals.supabase.rpc('get_user_info', {
		target_user_id: user.id,
	});

	if (error) {
		console.error('Error fetching user colors:', error);
		return { fillHex: null, strokeHex: null };
	}

	const row = Array.isArray(data) ? data[0] : data;
	return extractUserColors(row);
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const strokeHex = normalizeHexColor(formData.get('strokeHex'));
		const fillHex = normalizeHexColor(formData.get('fillHex'));

		console.log('fillHex:', fillHex);
		console.log('strokeHex:', strokeHex);

		if (!strokeHex || !fillHex) {
			return fail(400, { error: 'Invalid strokeHex or fillHex' });
		}

		const { data: { user }, error: authError } = await locals.supabase.auth.getUser();

		if (authError || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		try {
			const { error } = await locals.supabase.rpc(
            "update_user_colors"
            , {

            p_stroke_hex
            : strokeHex,

            p_fill_hex
            : fillHex,
            });
			if (error) throw error;

			const { data: userInfo, error: userInfoError } = await locals.supabase.rpc('get_user_info', {
				target_user_id: user.id,
			});

			if (userInfoError) {
				console.error('Error reading saved colors:', userInfoError);
				return { success: true, fillHex, strokeHex };
			}

			const row = Array.isArray(userInfo) ? userInfo[0] : userInfo;
			const savedColors = extractUserColors(row);

			return {
				success: true,
				fillHex: savedColors.fillHex ?? fillHex,
				strokeHex: savedColors.strokeHex ?? strokeHex,
			};
		} catch (error) {
			return fail(500, { error: error.message });
		}
	}
};
