import quartieri from './quartieri'; // Import the Quartieri router
import session from './session'; // Import the Session router
import circoscrizioni from './circoscrizioni'; // Import the Circoscrizioni router

const routers = {
    circoscrizioni,
    quartieri,
    session
}

export default routers; // Export the routers object
export { 
    circoscrizioni,
    quartieri,
    session
}