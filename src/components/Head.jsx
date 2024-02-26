import { NavLink } from "react-router-dom";
import { TbMenuDeep } from "react-icons/tb";

const Header = () => {
  const navLinks = [
    { to: "/List", text: "List", iconRotate: 180 },
    { to: "/Gantt", text: "Gantt", iconRotate: 180 },
    { to: "/Canva", text: "Canva", iconRotate: 180 },
  ];

  return (
    <nav className="flex w-[60%] p-5">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className="text-white text-lg font-bold bg-blue-500 p-1 rounded-md hover:bg-blue-700 w-36 flex items-center justify-center mx-4"
        >
          <TbMenuDeep
            className={`nav-icon ${link.iconRotate && `rotate-${link.iconRotate}`} ${
              link.iconFlip && "scale-x-[-1]"
            }`}
          />
          <span className="ml-1">{link.text}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Header;
