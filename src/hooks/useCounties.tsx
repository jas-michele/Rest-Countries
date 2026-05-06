import { useEffect, useState } from "react";

interface CountriesState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

function useCountries<T>(url: string, options?: RequestInit): CountriesState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch(url, { ...options, signal: controller.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch counties")
                }
                return res.json();
            })
            .then((data: T) => {
                setData(data);
                setLoading(false)
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    setError(err);
                    setLoading(false)
                }
            })

        return () => controller.abort();
    }, [url, options])

    return { data, loading, error };

}

export default useCountries;