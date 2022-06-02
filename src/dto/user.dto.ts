export default class UserDto {
  email;
  id;
  isActivated;
  userNickName;
  userName;

  constructor(model: any) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.userNickName = model.userNickName;
    this.userName = model.userName;
  }
}
