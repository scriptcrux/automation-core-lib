import { faker } from '@faker-js/faker';

export class DataGenerator {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      userName: faker.internet.username(), // Verified correct for Faker v9/v10+
      password: faker.internet.password({ length: 10 })
    };
  }
}
