import { useParams, useNavigate } from "react-router-dom";
import useCountries from "../hooks/useCounties";
import { useState, useEffect } from "react";


console.log("Detail Pag Loaded")

export default function CountryDetailPage() {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name || "");
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if(stored) {
            setFavorites(JSON.parse(stored))
        }
    }, [])



    const { data: countryData, loading, error } =
        useCountries<any[]>(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(decodedName)}`
        );

        const {data: allCountries} = 
            useCountries<any[]>(
                 "https://restcountries.com/v3.1/all?fields=name,cca3"
            )

    if (loading) return <p>Loading country... </p>
    if (error) return <p>{error.message}</p>
    if (!allCountries || !countryData) return null;

    const country = countryData?.[0];
    

    if (!country) return <p>Country not found</p>

    console.log("Decoded", decodedName)

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate(-1)}>⬅ Back</button>

            <h1>{country.name.common}</h1>

            <img
                src={country.flags.png}
                alt={country.name.common}
                style={{ width: "200px", marginTop: "10px" }}
            />

            <p><strong>Capital:</strong> {country.capital?.[0]} </p>
            <p><strong>Region:</strong> {country.region} </p>
            <p><strong>Population</strong> {country.population.toLocaleString()} </p>

            {country.borders && (
                <div style={{ marginTop: "10px" }}>
                    <h3>Border Countries</h3>

                    {country.borders.map((code: string) => {
                        const borderCountry = allCountries.find(
                            (c) => c.cca3 === code
                        );

                        if (!borderCountry) return null;

                        return (
                            <button
                                key={code}
                                onClick={() =>
                                    navigate(
                                        `/country/${encodeURIComponent(borderCountry.name.common)}`
                                    )
                                }
                                style={{ marginRight: "10px" }}
                            >
                                {borderCountry.name.common}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}