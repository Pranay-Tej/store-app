export const resolvePromise = async <T>(
	promise: Promise<T>
): Promise<[T, null] | [null, unknown]> => {
	try {
		const t0 = performance.now();
		const data = await promise;
		const t1 = performance.now();
		console.log(`Resolved in: ${t1 - t0}ms`);
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
};
