class User {
  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public id: number;
  public email: string;
  public firstName: string;
  public lastName: string;
}

export default User;