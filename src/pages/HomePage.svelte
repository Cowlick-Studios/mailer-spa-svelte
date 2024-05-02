<script lang="ts">
  import {onMount} from 'svelte';
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { Label, Input, Button } from 'flowbite-svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, InputAddon, ButtonGroup } from 'flowbite-svelte';
  import dayjs from 'dayjs';
  import { http } from '../axios';

  let searchString: string = '';
  let emailSubmissions: any[] = [];
  let newSubmissionName: string = '';
  let newSubmissionOrigin: string = '';

  const getAllSubmissions = async () => {
    return http.get('/api/email_submission');
  }

  const editEmailSubmission = (emailSubmission: any) => {
    navigate(`/edit/${emailSubmission.id}`, { replace: true });
  }

  const deleteEmailSubmission = (emailSubmission: any) => {
    http.delete(`/api/email_submission/${emailSubmission.id}`).then((res) => {
      emailSubmissions = emailSubmissions.filter((item: any) => {
        return item.id !== emailSubmission.id;
      });
    });
  }

  const createNewSubmission = () => {
    http.post(`/api/email_submission`, {
      name: newSubmissionName,
      origin: newSubmissionOrigin
    }).then((res) => {
      newSubmissionName = "";
      newSubmissionOrigin = "";

      emailSubmissions = [res.data.email_submission, ...emailSubmissions];
    });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  onMount(async () => {
    emailSubmissions = (await getAllSubmissions()).data.email_submissions;
  });

  $: filteredItems = emailSubmissions.filter((item) => item.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 || item.origin.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
</script>

<div class="grid grid-cols-1 gap-5">
  <div class="w-2/3 mx-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-5">
        <Input type="text" id="first_name" placeholder="Submission Name" required bind:value={newSubmissionName} />
      </div>
      <div class="col-span-5">
        <ButtonGroup class="w-full">
          <InputAddon>http://</InputAddon>
          <Input type="text" id="last_name" placeholder="Submission origin" required bind:value={newSubmissionOrigin} />
        </ButtonGroup>
      </div>
      <div class="col-span-2">
        <Button class="w-full" on:click={createNewSubmission}>Create</Button>
      </div>
    </div>
  </div>

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
            <TableBodyCell class="cursor-pointer" on:click={() => {copyToClipboard(item.name)}}><b>{item.name}</b></TableBodyCell>
            <TableBodyCell><b>{item.origin}</b></TableBodyCell>
            <TableBodyCell>{dayjs(item.created_at).format('YYYY-MM-DD')}</TableBodyCell>
            <TableBodyCell>{dayjs(item.updated_at).format('YYYY-MM-DD')}</TableBodyCell>
            <TableBodyCell>
              <Button size="sm" on:click={() => {editEmailSubmission(item)}}>Edit</Button>
              <Button size="sm" on:click={() => {deleteEmailSubmission(item)}}>Delete</Button>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableSearch>
  </div>
</div>

<style>
</style>
