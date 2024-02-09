import { useRouteError, Link } from "react-router-dom";

const NotFound = () => { 

    const error = useRouteError();
    console.log(error);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-2xl font-semibold text-gray-700">Página no encontrada</p>
            <p className="text-lg text-gray-500">{error.statusText || error.message}</p>
            <Link to={"/"} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Volver al Inicio</Link>
        </div>
    );
};

export default NotFound;