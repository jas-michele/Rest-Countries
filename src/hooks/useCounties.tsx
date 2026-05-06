import { useEffect, useState } from "react";

interface CoutriesState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

 function useCountries<T>(url: string, options?: RequestInit): CoutriesState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    


 }

 