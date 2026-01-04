import SummaryApi from "../common";
import { toast } from 'react-toastify'

const addToCart = async(e, id, socket, squadId) => {
    e?.stopPropagation();
    e?.preventDefault();

    const response = await fetch(SummaryApi.addToCartProduct.url, {
        method : SummaryApi.addToCartProduct.method,
        headers : {
            "content-type" : "application/json",
            "squad-id": squadId // Pass squad info to backend
        },
        credentials : 'include',
        body : JSON.stringify({
            productId : id,
            squadId : squadId // Send squadId to link the product to the squad
        })
    });

    const dataResponse = await response.json();

    if(dataResponse.success){
        toast.success(dataResponse.message);
        // SIGNAL THE PARTNER
        if(socket && squadId){
            socket.emit("send_cart_update", { squadId });
        }
    }

    if(dataResponse.error){
        toast.error(dataResponse.message);
    }

    return dataResponse;
}

export default addToCart;