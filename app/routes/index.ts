import quartieri from './quartieri'; // Import the Quartieri router
import session from './session'; // Import the Session router
import circoscrizioni from './circoscrizioni'; // Import the Circoscrizioni router
import generalInfo from './generalInfo'; //Import the GeneralInfo router


const routers = {
    circoscrizioni,
    generalInfo,
    quartieri,
    session
}

export default routers; // Export the routers object
export { 
    circoscrizioni,
    generalInfo,
    quartieri,
    session
}