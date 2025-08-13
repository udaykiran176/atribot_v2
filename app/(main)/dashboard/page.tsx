
import { getCurrentUser } from "@/server/users";

const DashboardPage = async () => {
    const { currentUser } = await getCurrentUser();

    //welcome message based on time
    const date = new Date();
    const hour = date.getHours();
    let greeting;
    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    
    return (
        <div className="py-2 px-2">
            <p className="text-2xl font-bold">{greeting}, {currentUser?.childName}.</p>
        </div>
    );
};

export default DashboardPage;
