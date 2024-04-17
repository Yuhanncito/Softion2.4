
function WorksCarts({data, userId, event}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 hover:scale-105 transition-all bg-white" onClick={event}>
        <h2 className="text-xl mb-2">{data.workSpaceName} de {data.propetaryUser.name}</h2>
        <p>Total de proyectos: {data.projects.length}</p>
        <p>{userId === data.propetaryUser._id ? "Dueño" : "Participante"}</p>
    </div>
  )
}

export default WorksCarts