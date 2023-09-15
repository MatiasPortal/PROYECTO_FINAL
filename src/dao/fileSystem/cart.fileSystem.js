import fs from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    getCarts = async() => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8"); //leo el archivo de carts.
            this.carts = JSON.parse(data); //parseo el archivo de carts.
            return this.carts;
        } catch(err) {
            return  [];
        }
    }

    getCartById = async(id) => {
        try {
            await this.getCarts();
            const cartId = this.carts.findIndex((cart) => cart.id === id); //busco en array de carts si existe el id pasado.

            if(cartId >= 0) { //si encuntro el id, retorno el resultado.
                return this.carts[cartId];
            }
        }catch(err) {
            console.log(err)
        }
    }

    addCart = async(cart) => {
        try {
            await this.getCarts(); //leo el archivo de carts.
            this.carts.push(cart); //agrego el cart al array de carts.
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return cart;
        } catch(err) {
            return  err;
        }
    }

    addProductToCart = async(cartId, productId) => {
        try {
            await this.getCarts();
            const cart = this.carts.find((cart) => cart.id === cartId); //busco en array de carts si existe el id pasado.
            const productRepeat = cart.products.findIndex((prod) => prod.product === productId);//verificar si el producto se encuntra repetido.

            if(productRepeat < 0) {
                cart.products.push({ product: productId, quantity: 1 }); //si no está repetido, agrego el producto al array de productos.
            } else {
                cart.products[productRepeat].quantity++; //si el producto está repetido, incremento la cantidad.
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2)); //actualizo el array de carts.
            return "Producto añadido al carrito";
        } catch(err) {
            return err;
        }
    }
}

export default CartManager;
