import { writable } from 'svelte/store';
import { Router, Link, Route, navigate } from "svelte-routing";

export const authenticated = writable<boolean>(false);

authenticated.subscribe((value: boolean) => {
  if(value){
    navigate('/');
  } else {
    navigate('/login');
  }
});