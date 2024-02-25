import { useState, useEffect } from "react";

const Gantt = () =>{
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTask = document.getElementById('scrollTaskBar');
            const scrollGantt = document.getElementById('scrollBarGantt');
            if (scrollTask && scrollGantt) {
                scrollTask.scrollTop = scrollGantt.scrollTop;
            }
        };

        document.getElementById('scrollBarGantt').addEventListener('scroll', handleScroll);
        return () => {
            document.getElementById('scrollBarGantt').removeEventListener('scroll', handleScroll);
        };
    }, []);

    const task = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    
    return(
        <div className="h-screen w-screen">
            <div className="h-full w-full flex flex-col">
                <div className="flex w-full h-[5%]">
                    <div className="flex w-[30%] justify-center items-center border-b-2 bg-white">
                        <h1 className="text-3xl font-bold">
                            Tareas
                        </h1>
                    </div>
                    <div className="flex overflow-x-scroll w-[70%] border-l-2 bg-white">

                    </div>
                </div>
                <div className="flex h-[95%]">
                    <div id="scrollTaskBar" className="flex w-[30%] bg-white items-center overflow-y-scroll flex-col">
                        {
                            task.map((item,index)=>(
                                <div key={index} className="border-gray-300 border shadow-lg py-5 px-2 hover:scale-105 transition-all duration-200 hover:bg-gray-100 w-[90%] my-2 h-[40px] flex justify-center items-center">
                                    <h1 className="text-xl font-semibold">Tarea {index+1} </h1>
                                </div>
                            ))
                        }
                    </div>
                    <div id="scrollBarGantt" className="flex w-[70%] overflow-y-scroll flex-col">
                        {
                            task.map((item,index)=>(
                                <div key={index} className="border-gray-300 border shadow-lg py-5 px-2 hover:scale-105 transition-all duration-200 hover:bg-gray-100 w-[100%] my-2 h-[40px] flex justify-center items-center">
                                    <h1 className="text-xl font-semibold">Tarea {index+1} </h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gantt;