<script lang="ts">
  import {onMount} from 'svelte';
  import { Label, Input, Button } from 'flowbite-svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
  import dayjs from 'dayjs';
  import { http } from '../axios';

  let searchString: string = '';
  let emailSubmissions: any[] = [];

  const getAllSubmissions = async () => {
    return http.get('/api/email_submission');
  }

  const editEmailSubmission = (emailSubmission: any) => {
    console.log(emailSubmission);
  }

  onMount(async () => {
    emailSubmissions = (await getAllSubmissions()).data.email_submissions;
  });

  $: filteredItems = emailSubmissions.filter((item) => item.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 || item.origin.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
</script>

<div>
  <TableSearch placeholder="Search by name and origin" hoverable={true} bind:inputValue={searchString}>
    <TableHead>
      <TableHeadCell>ID</TableHeadCell>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Origin</TableHeadCell>
      <TableHeadCell>CreatedAT</TableHeadCell>
      <TableHeadCell>UpdatedAT</TableHeadCell>
      <TableHeadCell>Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each filteredItems as item}
        <TableBodyRow>
          <TableBodyCell>{item.id}</TableBodyCell>
          <TableBodyCell>{item.name}</TableBodyCell>
          <TableBodyCell>{item.origin}</TableBodyCell>
          <TableBodyCell>{dayjs(item.created_at).format('DD/MM/YYYY')}</TableBodyCell>
          <TableBodyCell>{dayjs(item.updated_at).format('DD/MM/YYYY')}</TableBodyCell>
          <TableBodyCell><Button size="sm" on:click={() => {editEmailSubmission(item)}}>Edit</Button></TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </TableSearch>
</div>

<style>
</style>
