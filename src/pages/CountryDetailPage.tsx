import { useParams, useNavigate } from "react-router-dom";
import useCountries from "../hooks/useCounties";

console.log("Detail Pag Loaded")

export default function CountryDetailPage() {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name || "");
    const navigate = useNavigate();

    const { data: countries, loading, error } =
        useCountries<any[]>(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(decodedName)}`
        );

    if (loading) return <p>Loading country... </p>
    if (error) return <p>{error.message}</p>
    if (!countries) return null;

    const country = countries?.[0];

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
                <div style={{ marginTop: "10px"}}>
                    <h3>Border Countries</h3>

                    {country.borders.map((code: string) => (
                        <span key={code} style={{ marginRight: "10px"}}>
                            {code}
                        </span>
                    ))}
                 </div>
            )}
        </div>
    )
}