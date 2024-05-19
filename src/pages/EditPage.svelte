<script lang="ts">
  import {onMount} from 'svelte';
  import Icon from '@iconify/svelte';
  import dayjs from 'dayjs';
  import { http } from '../axios';
  import { Label, Input, Button, Card, InputAddon, ButtonGroup, Toggle } from 'flowbite-svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

  export let id;

  let submissionName: string = "";
  let submissionOrigin: string = "";
  let turnstileEnabled: boolean = false;
  let turnstileSecret: string = "";

  let submissionFields: any = [];
  let newFieldName: string = "";

  let submissionRecipiants: any = [];
  let newRecipiantEmail: string = "";

  let submissionLogs: any = [];

  const updateSubmission = () => {
    http.patch(`/api/email_submission/${id}`, {
      name: submissionName,
      origin: submissionOrigin,
      turnstile_enable: turnstileEnabled,
      turnstile_secret: turnstileSecret,
    }).then((res: any) => {
      submissionName = res.data.email_submission.name;
      submissionOrigin = res.data.email_submission.origin;
      turnstileEnabled = Boolean(res.data.email_submission.turnstile_enable);
      turnstileSecret = res.data.email_submission.turnstile_secret;
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

  const resendSubmissionLog = (submissionlog: any) => {
    http.post(`/api/email_submission/${submissionlog.email_submission_id}/log/${submissionlog.id}/resend`).then((res) => {
      console.log(res);
    });
  }

  onMount(async () => {
    http.get(`/api/email_submission/${id}`).then((res) => {
      const submissionRecord = res.data.email_submission;

      console.log('submissionRecord', submissionRecord);

      submissionName = submissionRecord.name;
      submissionOrigin = submissionRecord.origin;
      turnstileEnabled = submissionRecord.turnstile_enable;
      turnstileSecret = submissionRecord.turnstile_secret;

      submissionFields = submissionRecord.fields;
      submissionRecipiants = submissionRecord.recipiants;

      submissionLogs = submissionRecord.logs;
    });
  });
</script>

<div class="grid grid-cols-1 gap-10 w-10/12 mx-auto">

  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-6">
      <Label for="first_name" class="mb-2">Form Name</Label>
      <Input type="text" id="first_name" placeholder="Submission Names" required bind:value={submissionName} />
    </div>
    <div class="col-span-6">
      <Label for="first_name" class="mb-2">Form Origin</Label>
      <ButtonGroup class="w-full">
        <InputAddon>http://</InputAddon>
        <Input type="text" id="last_name" placeholder="Submission Origin" required bind:value={submissionOrigin} />
      </ButtonGroup>
    </div>
    <div class="col-span-12">
      <Button class="w-full" on:click={updateSubmission}>Updated</Button>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-2">

    <div class="col-span-12">
      <p><b>POST:</b>{import.meta.env.VITE_API_ENDPOINT}/api/submit/{submissionName}</p>
    </div>

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

    <!-- Turnstile -->
    <div class="col-span-12">
      <Card size={'9xl'} class="h-full">
        <div class="grid grid-col-1 gap-2">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Clouflair Turnstile</h5>

          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-3 flex justify-center items-center">
              <Toggle bind:checked={turnstileEnabled}>Enable Turnstile</Toggle>
            </div>
            <div class="col-span-7">
              <Input type="text" placeholder="Turnstile Secret" required bind:value={turnstileSecret} disabled={!turnstileEnabled} />
            </div>
            <div class="col-span-2">
              <Button class="w-full" on:click={updateSubmission}>Save</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>

  </div>

  <div class="grid grid-cols-12 gap-2">
    <div class="col-span-12">
      <Table shadow class="grid-cols-12">
        <TableHead>
          <TableHeadCell>ID</TableHeadCell>
          {#each submissionFields as submissionField}
            <TableHeadCell>{submissionField.name}</TableHeadCell>
          {/each}
          <TableHeadCell>Sent At</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each submissionLogs as submissionLog}
            <TableBodyRow>
              <TableBodyCell>{submissionLog.id}</TableBodyCell>

              {#each submissionFields as submissionField}
                <TableBodyCell>{submissionLog.submission_data[submissionField.name]}</TableBodyCell>
              {/each}

              <TableBodyCell>{dayjs(submissionLog.created_at).format('YYYY-MM-DD HH:mm')}</TableBodyCell>

              <TableBodyCell>
                <Button on:click={() => resendSubmissionLog(submissionLog)}>Resend</Button>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </div>

</div>

<style>
</style>
