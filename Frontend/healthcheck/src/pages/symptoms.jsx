import { useEffect } from "react"

import axios from "axios";
import { useState } from "react";
import { BACKURL } from "../util/backend";

export default function SymptomPage() {
    const [data, setData] = useState("anonymous")

    const [symptoms, setSymptoms] = useState("");

    const handleInputChange = (e) => {
        setSymptoms(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(symptoms);
        await axios.get(`${BACKURL}/symptoms/?symptoms=${symptoms}`, {})
            .then((response) => {
                setData(response.data)
                console.log(response)
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        // axios.get(`${BACKURL}/user/harsh`, {})
        //     .then((response) => {
        //         setData(response.data)
        //         console.log(response)
        //     })
        //     .catch((err) => console.log(err));
    }, [])

    return (
        <div className="bg-gray-200">
            <p>Hello</p>
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label>Symptoms</label>
                    <input
                        type="text"
                        name="symptoms"
                        // value={symptoms}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-control">
                    <label></label>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <p>{data.response}</p>
        </div>
    )
}