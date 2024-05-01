<script lang="ts">
  import {onMount} from 'svelte';
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Icon from '@iconify/svelte';
  import { http } from '../axios';
  import { Label, Input, Button, Card } from 'flowbite-svelte';

  export let id;

  let submissionName: string = "";
  let submissionOrigin: string = "";

  let submissionFields: any = [];
  let newFieldName: string = "";

  let submissionRecipiants: any = [];
  let newRecipiantEmail: string = "";

  const updateSubmission = () => {
    http.patch(`/api/email_submission/${id}`, {
      name: submissionName,
      origin: submissionOrigin
    }).then((res) => {
      submissionName = "";
      submissionOrigin = "";

      submissionName = res.data.email_submission.name;
      submissionOrigin = res.data.email_submission.origin;
    });
  }

  const addNewField = () => {
    http.post(`/api/email_submission/${id}/field`, {
      name: newFieldName
    }).then((res) => {
      newFieldName = "";
      submissionFields = [res.data.new_field, ...submissionFields];
    });
  }

  const removeField = (field: any) => {
    http.delete(`/api/email_submission/${field.email_submission_id}/field/${field.id}`).then((res) => {
      submissionFields = submissionFields.filter((item: any) => {
        return field.id !== item.id
      });
    });
  }

  const addNewRecipiant = () => {
    http.post(`/api/email_submission/${id}/recipiant`, {
      email: newRecipiantEmail
    }).then((res) => {
      newRecipiantEmail = "";
      submissionRecipiants = [res.data.new_recipiant, ...submissionRecipiants];
    });
  }

  const removeRecipiant = (recipiant: any) => {
    http.delete(`/api/email_submission/${recipiant.email_submission_id}/recipiant/${recipiant.id}`).then((res) => {
      submissionRecipiants = submissionRecipiants.filter((item: any) => {
        return recipiant.id !== item.id
      });
    });
  }

  onMount(async () => {
    http.get(`/api/email_submission/${id}`).then((res) => {
      const submissionRecord = res.data.email_submission;

      submissionName = submissionRecord.name;
      submissionOrigin = submissionRecord.origin;

      submissionFields = submissionRecord.fields;
      submissionRecipiants = submissionRecord.recipiants;
    });
  });
</script>

<div class="grid grid-cols-1 gap-10 w-10/12 mx-auto">

  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-6">
      <Input type="text" id="first_name" placeholder="John" required bind:value={submissionName} />
    </div>
    <div class="col-span-6">
      <Input type="text" id="last_name" placeholder="Doe" required bind:value={submissionOrigin} />
    </div>
    <div class="col-span-12">
      <Button class="w-full" on:click={updateSubmission}>Updated</Button>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-2">

    <!-- Fields -->
    <div class="col-span-6">
      <Card size="xl" class="h-full">
        <div class="grid grid-col-1 gap-2">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Form Fields</h5>

          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-10">
              <Input type="text" id="field" placeholder="Field Name" required bind:value={newFieldName} />
            </div>
            <div class="col-span-2">
              <Button class="w-full" on:click={addNewField}>Add</Button>
            </div>
          </div>
  
          <div class="flex flex-col gap-1">
            {#each submissionFields as field}
            <div class="flex flex-row justify-between">
              <div class="flex items-center">{field.name}</div>
              <Button class="!p-2" on:click={() => {removeField(field)}}><Icon width="16px" icon="mdi:trash" /></Button>
            </div>
            {/each}
          </div>
        </div>
      </Card>
    </div>

    <!-- Recipiants -->
    <div class="col-span-6">
      <Card size="xl" class="h-full">
        <div class="grid grid-col-1 gap-2">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Form Recipiants</h5>

          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-10">
              <Input type="email" id="field" placeholder="Recipiant Email" required bind:value={newRecipiantEmail} />
            </div>
            <div class="col-span-2">
              <Button class="w-full" on:click={addNewRecipiant}>Add</Button>
            </div>
          </div>
  
          <div class="flex flex-col gap-1">
            {#each submissionRecipiants as recipiant}
            <div class="flex flex-row justify-between">
              <div class="flex items-center">{recipiant.email}</div>
              <Button class="!p-2" on:click={() => {removeRecipiant(recipiant)}}><Icon width="16px" icon="mdi:trash" /></Button>
            </div>
            {/each}
          </div>
        </div>
      </Card>
    </div>

  </div>

</div>

<style>
</style>
