import { useState } from "react"
import axios from 'axios';

//icons
import { GoPencil } from "react-icons/go";

export default function createTarea() {

    const [isopen,setIsopen] = useState(false);

        const [selectedFile, setSelectedFile] = useState(null);
      
        const handleFileUpload = (event) => {
          setSelectedFile(event.target.files[0]);
        };
      
        const handleUpload = () => {
          const formData = new FormData();
          formData.append('file', selectedFile);
          axios.post('/api/upload', formData)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        };

  return (
        <div>
            <button className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 right-5" onClick={()=>setIsopen(true)}><GoPencil className="h-6" />Crear tarea</button>
            {
                isopen &&(
                      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
                        <div className="bg-white p-5 rounded flex flex-col justify-center items-center gap-5">
                            <div className="flex flex-col h-[100%] w-[100%] justify-around justify-items-center items-center flex-wrap md:flex-nowrap ml-4">
                              <label htmlFor="tituloProject">
                              Escribe el nombre del proyecto
                              </label>
                                <input id="tituloProject" type="text" className="w-64 px-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 duration-200" placeholder=" " />
                                <input type="text" className="p-3 text-1xl  md:text-2xl h-[12vh] border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 duration-200" />
                                <div>
                                    <input type="file" onChange={handleFileUpload} />
                                    <button onClick={handleUpload}></button>
                                </div>
                                <button className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded bottom-4 right-5"><GoPencil className="h-6" />Crear tarea</button>
                                <div>
                                    <button className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded bottom-4 right-5" onClick={()=>setIsopen(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
  )
}
