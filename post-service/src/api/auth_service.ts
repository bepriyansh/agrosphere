import { apiAuthServiceClient } from "./axios";

export interface UserData {
    id: string;
    username: string;
    profilePicture?: string | null;
    [key: string]: any; // Allow additional properties
}

export const getUserData = async (userIds:string[]): Promise<UserData[]> => {
    try {
        const response = await apiAuthServiceClient.post('/user/get', {userIds});
        if(response.data.success){
            return response.data.data.users as UserData[];
        }
        return [];
    } catch (error) {
        console.log("Error while fetching user data from auth service", error);
        throw error;
    }
}