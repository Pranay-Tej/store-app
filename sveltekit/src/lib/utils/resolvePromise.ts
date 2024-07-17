export const resolvePromise = async <T>(
	promise: Promise<T>
): Promise<[T, null] | [null, unknown]> => {
	try {
	const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
};
