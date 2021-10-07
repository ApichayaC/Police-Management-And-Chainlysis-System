import { Link } from 'react-router-dom'

const MENU = [
    {
        path: '/manual',
        name: 'Manual'
    },
    {
        path: '/label',
        name: 'Label'
    }
]

const Topbar = () => {
    return (
        <div className='flex justify-between items-center px-10 py-5 shadow-md bg-blue-700'>
            <div className="logo font-bold cursor-pointer text-xl">
                <Link to="/" className="text-white hover:text-white">
                    BLOCK Tracer
                </Link>
            </div>
            <div className="flex space-x-10 text-white ">
                {MENU.map((item) => (
                    <div key={item.name}>
                        <Link to={item.path} className="text-white hover:text-white">{item.name}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Topbar
