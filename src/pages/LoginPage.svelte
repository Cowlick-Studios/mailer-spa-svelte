<script lang="ts">
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';

  import { http } from '../axios';

  let email: string = "";
  let password: string = "";

  const login = () => {
    http.post('/login', {
      email: email,
      password: password
    }).then((res) => {

      email = "";
      password = "";

      if(res.status == 200){
        navigate("/", { replace: true });
      }
    });
  }
</script>

<Card class="mx-auto">
  <form class="flex flex-col space-y-6">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Sign in</h3>
    <Label class="space-y-2">
      <span>Email</span>
      <Input type="email" name="email" placeholder="test@example.com" required bind:value={email} />
    </Label>
    <Label class="space-y-2">
      <span>Your password</span>
      <Input type="password" name="password" placeholder="password" required bind:value={password} />
    </Label>
    <!-- <div class="flex items-start">
      <Checkbox>Remember me</Checkbox>
      <a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"> Lost password? </a>
    </div> -->
    <Button class="w-full" on:click={login}>Login to your account</Button>
    <!-- <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
      Not registered? <a href="/" class="text-primary-700 hover:underline dark:text-primary-500"> Create account </a>
    </div> -->
  </form>
</Card>

<style>
</style>
