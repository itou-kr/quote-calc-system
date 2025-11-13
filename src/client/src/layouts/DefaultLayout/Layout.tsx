import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            Default Layout
            <Outlet />
        </div>
    )
}

export default Layout;