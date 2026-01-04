import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import Context from './index';

const SquadContext = createContext();

export const SquadProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [squadId, setSquadId] = useState(localStorage.getItem("squadId") || null);
    const [partnerLocation, setPartnerLocation] = useState("");
    const mainContext = useContext(Context);

    useEffect(() => {
        const socketUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";
        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on("connect", () => {
            const savedId = localStorage.getItem("squadId");
            if (savedId) {
                newSocket.emit("join_squad", { squadId: savedId, userName: "User" });
                if(mainContext?.fetchUserAddToCart) mainContext.fetchUserAddToCart();
            }
        });

        newSocket.on("receive_cart_update", () => {
            if (mainContext?.fetchUserAddToCart) {
                mainContext.fetchUserAddToCart();
                toast.success("Squad cart updated!");
            }
        });

        newSocket.on("receive_location_update", ({ userName, location }) => {
            setPartnerLocation(`${userName} is viewing ${location}`);
        });

        newSocket.on("receive_webrtc_signal", (data) => {
            console.log("WebRTC signal received", data);
        });

        newSocket.on("squad_notification", (msg) => toast.info(msg));

        setSocket(newSocket);
        return () => {
            newSocket.off("receive_cart_update");
            newSocket.off("receive_location_update");
            newSocket.off("receive_webrtc_signal");
            newSocket.close();
        };
    }, [mainContext]);

    const joinSquad = (id, name) => {
        setSquadId(id);
        localStorage.setItem("squadId", id);
        socket?.emit("join_squad", { squadId: id, userName: name });
        if(mainContext?.fetchUserAddToCart) mainContext.fetchUserAddToCart();
    };

    const leaveSquad = () => {
        setSquadId(null);
        localStorage.removeItem("squadId");
        window.location.reload();
    };

    return (
        <SquadContext.Provider value={{ socket, squadId, joinSquad, leaveSquad, partnerLocation }}>
            {children}
        </SquadContext.Provider>
    );
};

export const useSquad = () => useContext(SquadContext);