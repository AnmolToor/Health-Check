import { useState } from "react";
import Header from "../components/header";
import { BACKURL } from "../util/backend";
import axios from "axios";
import { toast } from 'react-toastify';
import { addNewDisease } from "../services/firebase";
import { useContext } from "react";
import UserContext from "../context/user";

export default function CheckDisease() {
    const [checkNum, setCheckNum] = useState(0);

    const [userInput, setuserInput] = useState("")
    const [synonymousSymptoms, setSynonymousSymptoms] = useState()

    const [userSelectedSymptoms, setUserSelectedSymptoms] = useState([])

    const [otherOccuringSymptoms, setOtherOccuringSymptoms] = useState()

    const [diseases, setDiseases] = useState()

    const { user } = useContext(UserContext);
    console.log(user.uid)

    const isInvalid = userInput === '';
    console.log('other', userSelectedSymptoms)

    const handleUserInputSymptoms = async () => {
        await axios.post(`${BACKURL}/synonymous-symptoms`, { "disease_input": userInput }).then((res) => {
            setSynonymousSymptoms(res.data)
            setCheckNum((checkNum) => checkNum + 1)
            console.log(res.data)
        }
        )
    }

    const handleUserSelectedSymptoms = async () => {
        if (userSelectedSymptoms.length <= 0) {
            toast.warning("Select Symptoms First!")
        } else {
            toast.success("Checking for other commonly occuring diseases")
            await axios.post(`${BACKURL}/coocurring-symptoms`, { "symptom_list": userSelectedSymptoms }).then((res) => {
                setOtherOccuringSymptoms(res.data)
                setCheckNum((checkNum) => checkNum + 1)
            }
            )
        }
    }

    const handleFinalSymptoms = async () => {
        toast.success("Wait checking possible disease")
        await axios.post(`${BACKURL}/predict-disease`, { "final_symp": userSelectedSymptoms }).then((res) => {
            uploadToFirestore(user.uid, res.data, userSelectedSymptoms)
            setDiseases(res.data)
            setCheckNum((checkNum) => checkNum + 1)
        })
    }

    const uploadToFirestore = async (userId, diseases, userSelectedSymptoms) => {
        let obj = {};

        diseases.forEach((v) => {
            obj[v[0]] = v[1];
        });
        await addNewDisease(userId, obj, userSelectedSymptoms)
    }


    return (
        <div>
            <Header />
            <div className="mx-auto max-w-screen-lg">
                {
                    checkNum === 0 &&
                    <div>
                        <div className='flex flex-col mb-4'>
                            <label className="font-bold text-lg py-2 text-gray-800">What Symptoms are you experiencing ?</label>
                            <p className="py-2">Enter symptoms separted by commas:</p>
                            <input className='border relative bg-gray-100 p-2' type="text" placeholder="fever, cough, sore throat, runny nose" onChange={({ target }) => setuserInput(target.value)} />
                        </div>
                        <button
                            disabled={isInvalid}
                            onClick={handleUserInputSymptoms}
                            className={`font-semibold bg-blue-500 text-white px-14 py-4 rounded-md  ${isInvalid && `opacity-50`}`}>Next</button>
                    </div>
                }
                {
                    (checkNum == 1 && synonymousSymptoms) &&
                    <div>
                        <div>
                            <p>These are the symptoms from your input that matched our database :-</p>
                            <ul className="min-h-[400px]">
                                {synonymousSymptoms.map((item, idx) =>
                                    <li className="flex py-4" key={idx}>
                                        <svg className="svg-icon w-min px-4" width="24px" viewBox="0 0 20 20">
                                            <path fill="black" d="M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z"></path>
                                        </svg>
                                        {item}
                                        <input type="checkbox" onChange={(e) => {
                                            e.target.checked ?
                                                setUserSelectedSymptoms([...userSelectedSymptoms, item]) :
                                                setUserSelectedSymptoms(userSelectedSymptoms.filter(obj => { return obj !== item; }))
                                        }} />
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-4 py-2 bg-gray-500 mx-4 rounded-md" onClick={() => setCheckNum(0)}>Go Back</button>
                            <button
                                className={`px-4 py-2 bg-blue-500 text-white mx-4 rounded-md `}
                                onClick={handleUserSelectedSymptoms}
                            >Proceed Further</button>
                        </div>
                    </div>
                }
                {
                    checkNum == 2 && otherOccuringSymptoms && <div>
                        <h3 className="py-8"><span className="font-bold text-gray-700 text-xl">Select Other Symptoms </span>(These are the symptoms that generally occur with your selected symptoms)</h3>
                        <ul className="grid grid-cols-3 gap-y-2 overflow-y-scroll max-h-[300px]">
                            {otherOccuringSymptoms.map((item, idx) => (
                                <li key={idx} className="flex items-center py-2">
                                    <svg className="svg-icon w-min px-4" width="24px" viewBox="0 0 20 20">
                                        <path fill="black" d="M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z"></path>
                                    </svg>
                                    <p className="px-4">{item[0]}</p>
                                    <input type="checkbox" onChange={(e) => {
                                        e.target.checked ?
                                            setUserSelectedSymptoms([...userSelectedSymptoms, item[0]]) :
                                            setUserSelectedSymptoms(userSelectedSymptoms.filter(obj => { return obj !== item[0]; }))
                                    }} />
                                </li>
                            )
                            )}
                        </ul>
                        <div className="mt-8 py-4 border-t-4">
                            <p> Your final selected symptoms are: </p>
                            <div className="flex flex-wrap">
                                {userSelectedSymptoms.map((item) => (
                                    <div className="flex pt-4">
                                        <svg className="svg-icon w-min px-4" width="24px" viewBox="0 0 20 20">
                                            <path fill="red" d="M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z"></path>
                                        </svg>
                                        <p>{item}</p>
                                    </div>))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className={`px-4 py-2 bg-blue-500 text-white mx-4 rounded-md `}
                                onClick={handleFinalSymptoms}
                            >Proceed Further</button>
                        </div>
                    </div>
                }
                {
                    checkNum == 3 && diseases &&
                    (
                        <div>
                            <h1 className="text-xl mb-8">Top 10 Possible disease based on your symptoms are:</h1>
                            <div>
                                {diseases.map((disease) => (
                                    <p className={`py-2 text-lg`}>{disease[0]} <span className={`py-2 ${disease[1] <= 0.490 && "text-green-500"} ${disease[1] >= 0.50 && disease[1] < 0.59 && "text-yellow-500"}  ${disease[1] >= 0.59 && "text-red-500"} `}>(Probability: {disease[1]})</span></p>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}