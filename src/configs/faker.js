import { Faker, en } from "@faker-js/faker";

const faker = new Faker({ locale: [en] })

// generar producto mock.
export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        stock: faker.number.int(50),
        thumbnail: faker.image.urlLoremFlickr(),
        code: faker.string.alphanumeric(10),
        description: faker.commerce.productDescription()
    }
}