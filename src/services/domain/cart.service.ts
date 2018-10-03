import { Cart } from './../../models/cart';
import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { ProdutoDTO } from '../../models/produto.dto';

@Injectable()
export class CartService {

    constructor(public storage: StorageService) {
    }

    createOrClearCart() : Cart {
        let cart : Cart = {items : []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        let cart : Cart = this.storage.getCart();
        if (cart == null) {
            cart = this.createOrClearCart();
        }
        return cart;
    }

    addProduto(produto : ProdutoDTO) : Cart {
        let cart = this.getCart();
        let pos = cart.items.findIndex(x => x.produto.id == produto.id);
        if (pos == -1) {
            cart.items.push({quantidade: 1, produto: produto});
        } else {
            cart.items[pos].quantidade += 1;
        }
        this.storage.setCart(cart);
        return cart;
    }

}