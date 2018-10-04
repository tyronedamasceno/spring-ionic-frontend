import { Cart } from './../models/cart';
import { STORAGE_KEYS } from './../config/storage_keys.config';
import { LocalUser } from '../models/local-user';
import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
    
    getLocalUser() : LocalUser {
        let usr = localStorage.getItem(STORAGE_KEYS.localUser);
        if (usr == null) {
            return null;
        } else {
            return JSON.parse(usr);
        }
    }

    setLocalUser(obj : LocalUser) {
        if (obj == null) {
            localStorage.removeItem(STORAGE_KEYS.localUser);
        } else {
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }

    getCart() : Cart {
        let cart = localStorage.getItem(STORAGE_KEYS.localCart);
        if (cart == null) {
            return null;
        } else {
            return JSON.parse(cart);
        }
    }

    setCart(obj : Cart) {
        if (obj == null) {
            localStorage.removeItem(STORAGE_KEYS.localCart);
        } else {
            localStorage.setItem(STORAGE_KEYS.localCart, JSON.stringify(obj));
        }
    }
}