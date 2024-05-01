<script lang="ts">
  import {onMount} from 'svelte';
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
  import { Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup } from 'flowbite-svelte';
  import Cookies from 'js-cookie';

  import HomePage from './pages/HomePage.svelte';
  import LoginPage from './pages/LoginPage.svelte';
  import EditPage from './pages/EditPage.svelte';

  import { http } from './axios';

  export let url = "";

  onMount(async () => {
    // if(Cookies.get('XSRF-TOKEN') == null){
    //   navigate("/login", { replace: true });
    // }
  });

  
</script>

<div class="flex flex-col min-h-[100vh]">
  <header class="flex-none">
    <Navbar>
      <NavBrand href="/">
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Mailer</span>
      </NavBrand>
      <NavHamburger  />
      <NavUl >
        <Button size="sm">Logout</Button>
        <!-- <Link to="/">Home</Link>
        <Link to="/login">Login</Link> -->
      </NavUl>
    </Navbar>
  </header>
  
  <main class="grow">
    <Router {url}>
      <div>
        <Route path="/edit/:id" let:params> 
          <EditPage id="{params.id}"/>
        </Route>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={HomePage} />
      </div>
    </Router>
  </main>
  
  <footer class="flex-none p-5">
    <Footer>
      <FooterCopyright href="/" by="Jack Woodrow" year={2022} />
      <!-- <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <FooterLink href="/">About</FooterLink>
        <FooterLink href="/">Privacy Policy</FooterLink>
        <FooterLink href="/">Licensing</FooterLink>
        <FooterLink href="/">Contact</FooterLink>
      </FooterLinkGroup> -->
    </Footer>
  </footer>
</div>

<style>
</style>
