import { writable } from 'svelte/store';
import { Router, Link, Route, navigate } from "svelte-routing";
import Cookies from 'js-cookie';

export const authenticated = writable<boolean>(false);

authenticated.subscribe((value: boolean) => {
  if(value){
    navigate('/');
  } else {
    Cookies.remove('XSRF-TOKEN');
    navigate('/login');
  }
});