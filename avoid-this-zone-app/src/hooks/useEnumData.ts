import { useEffect, useState } from 'react';
import { fetchEnumValues } from '../backend'; // Ensure this path is correct

export interface EnumData {
    [key: string]: any;
}

export const useEnumData = (initialData: EnumData | null = null) => {
    const [enumData, setEnumData] = useState<EnumData | null>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enumData) {
            const loadEnums = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await fetchEnumValues();
                    if (data) {
                        setEnumData(data);
                    } else {
                        setError('Failed to load enum data.');
                    }
                } catch (err) {
                    console.error('Error fetching enum values:', err);
                    setError('Failed to load enum data.');
                } finally {
                    setIsLoading(false);
                }
            };

            loadEnums();
        }
    }, [enumData]);

    return { enumData, isLoading, error };
};
