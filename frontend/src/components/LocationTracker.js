import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSquad } from '../context/SquadContext';
import { useSelector } from 'react-redux';

const LocationTracker = () => {
    const location = useLocation();
    const { socket, squadId } = useSquad();
    const user = useSelector(state => state?.user?.user);

    useEffect(() => {
        if (socket && squadId && user?.name) {
            const path = location.pathname;
            let pageName = "Browsing";

            if (path === "/") pageName = "Home Page";
            else if (path.includes("/product/")) pageName = "Product Details";
            else if (path === "/cart") pageName = "Shopping Cart";
            else if (path === "/search") pageName = "Search Results";

            socket.emit("update_location", {
                squadId,
                userName: user.name,
                location: pageName
            });
        }
    }, [location, socket, squadId, user?.name]);

    return null;
};

export default LocationTracker;