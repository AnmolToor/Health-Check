import Header from "../components/header";
import home1 from "../assets/home1.jpg"
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <Header />
            <div className="mx-auto max-w-screen-lg">
                <div className="flex flex-col justify-center items-center">
                    <img src={home1} alt="Check New Disease" className="mt-2 w-1/4 pb-2 mobiles:mx-2 mobiles:w-7/12" />
                    <Link to="/check-symptoms">
                        <button className="font-semibold bg-blue-500 text-white px-4 py-4 rounded-md">Check For New Disease</button>
                    </Link>
                </div>
                <div className="flex flex-col my-16 border-t-4 py-8">
                    <p className="font-bold text-gray-700 text-2xl">Previous Records</p>
                </div>
            </div>
        </div>
    )
}