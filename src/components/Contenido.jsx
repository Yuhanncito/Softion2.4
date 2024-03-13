import { useEffect, useState } from "react";
import { useUserContext } from "../context/UseContext";
import Cookies from "universal-cookie";
import Header from "../components/Head";
import MigaPan from "../components/migaPan";
import { BiSolidUser } from "react-icons/bi";
import { FaRegFolderOpen } from "react-icons/fa6";
import { CONFIGURACIONES } from "../configs/confing";
CONFIGURACIONES;
import TaskForm from "../components/TaskForm";
import { GrClose } from "react-icons/gr";

function Contenido() {
  const { projectId, user } = useUserContext();
  const cookies = new Cookies();
  const [projecData, setProjecData] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getInfoProject = async () => {
      try {
        const response = await fetch(
          CONFIGURACIONES.BASEURL + "/projects/getById",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": cookies.get("x-access-user"),
            },
            body: JSON.stringify({ projectId: projectId }),
          }
        );

        console.log(response);

        const parse = await response.json();

        console.log(parse);
        if (parse.message === "ok") setProjecData(parse.data);
      } catch (error) {}
    };
    if (projectId) getInfoProject();
  }, [projectId]);

  // Función para manejar cambios en el modal
  const handleModalChange = e => {
    setSelectedTask({
      ...selectedTask,
      [e.target.name]: e.target.value
    });
  };

  // Función para actualizar la tarea
  const handleUpdate = async e => {
    e.preventDefault();
    try {
      // Agrega aquí la lógica para enviar la actualización al servidor
      // por ejemplo, un fetch con el método PUT
      // ...

      // Después de la actualización, cierra el modal y vuelve a obtener las tareas
      handleCloseModal();
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };


  
  return (
    <div className="flex pt-10 bg-white shadow-lg justify-around flex-col h-18 w-full justify-items-center items-center flex-wrap md:flex-nowrap">
      <div className="flex w-full justify-between h-20 pr-30 pl-28">
        <div className="flex flex-row items-center">
          {projecData ? (
            <FaRegFolderOpen className="w-[20%] text-2xl mx-4" />
          ) : (
            <BiSolidUser className="w-[20%] text-2xl" />
          )}
          <h1 className="flex items-center text-3xl font-bold md:text-2xl w-[80%]">
            {projecData
              ? projecData.nameProject
              : user
              ? user.name
                ? user.name.toUpperCase() + " " + user.lastName.toUpperCase()
                : ""
              : ""}
          </h1>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.status
                ? projecData.status
                : "------"
              : "------"}
          </h1>
          <h3 className="">Estado</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.started
                ? projecData.started
                : "--/--/--"
              : "--/--/--"}
          </h1>
          <h3>inicio</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.finished
                ? projecData.finished
                : "--/--/--"
              : "--/--/--"}
          </h1>
          <h3>Finalizado</h3>
        </div>
      </div>

      

      <div className=" pr-12 flex w-full h-[10%] justify-between items-center">
        <Header />
        <div className="flex w-[30%] justify-around ">
          <button
            onClick={() => setShow(!show)}
            className="  bg-blue-500 w-40 hover:bg-blue-600 h-10 font-bold text-white rounded-xl">
            Agregar Tarea
          </button>
          <button
            onClick={() => setShow(!show)}
            className="  bg-blue-500 w-40 hover:bg-blue-600 h-10 font-bold text-white rounded-xl">
            Agregar Tarea
          </button>
        </div>
      </div>

      <MigaPan />

      {show && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
          <div
            id="Contenedor"
            className={`bg-white h-[65%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${
              show ? "" : "hidden"
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShow(!show)}
                className="hover:bg-red-500 text-white p-2 rounded-full"
              >
                <GrClose className="font-bold text-2xl text-black" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-6">Editar Tarea</h2>

            <TaskForm
              handleChange={handleModalChange}
              method={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Contenido;
