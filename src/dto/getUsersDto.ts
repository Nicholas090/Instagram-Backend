import {IUserModel} from "../models/user.model";

export const getUsersDto = (data: IUserModel[]) => {
        console.log()
        return data.map((user) => {
                return {userNickName: user.userNickName, isActivated: user.isActivated}
        })
}
