function Canva() {
  return (
    <div className="flex">
      {/* Columna Completado */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Pendiente</h1>
        <div className="bg-gray-200 p-2 rounded mb-2">
          <p>Tarea 1</p>
          <p>Fecha: 2024-02-26</p>
        </div>
        {/* Puedes agregar más tarjetas aquí según sea necesario */}
      </div>

      {/* Columna Iniciado */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Iniciado</h1>
        <div className="bg-gray-200 p-2 rounded mb-2">
          <p>Tarea 1</p>
          <p>Fecha: 2024-02-26</p>
        </div>
        {/* Puedes agregar más tarjetas aquí según sea necesario */}
      </div>

      {/* Columna Pendiente */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Completado</h1>
        <div className="bg-gray-200 p-2 rounded mb-2">
          <p>Tarea 1</p>
          <p>Fecha: 2024-02-26</p>
        </div>
        {/* Puedes agregar más tarjetas aquí según sea necesario */}
      </div>
    </div>
  );
}

export default Canva;