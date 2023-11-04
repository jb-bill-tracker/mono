<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  import { PencilIcon, TrashIcon, XIcon } from "lucide-svelte";
  import type { ActionResult } from "@sveltejs/kit";
  import { invalidate } from "$app/navigation";
  import { getToastStore } from '@skeletonlabs/skeleton';

  export let data;

  let editModal: HTMLDialogElement;
  let deleteModal: HTMLDialogElement;

  let selectedBill: typeof data.bills[number] = data.bills[0];

  const toastStore = getToastStore();

  async function submitForm(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    // Cancel this
    e.preventDefault();
    // Grab the action for the current form
    const action = e.currentTarget.action;

    const url = new URL(action);

    // Create the form data
    const data = new FormData(e.currentTarget);

    // Get the response of the action
    const response = await fetch(action, {
      method: 'post',
      body: data
    }).then(r => r.json()) as ActionResult;

    if(response.type === 'success' && response.status >= 200 && response.status <= 299) {
      await invalidate(url.pathname);
      editModal.close();
    } else if(response.type === 'error') {
      toastStore.trigger({
        message: response.error.message,
        timeout: 3000,
      });
    }

  }
</script>

<svelte:head>
  <title>
    Sungmanito &ndash; Bills
  </title>
</svelte:head>

<dialog bind:this={editModal} class="p-4 rounded bg-surface-active-token shadow shadow-gray-400 text-token backdrop:bg-surface-600">
  <form method="dialog" action="?/updateBill" on:submit={submitForm}>
    <input type="hidden" name="bill-id" value={selectedBill.billId}>
    <div class="min-w-max flex flex-col gap-2">
      <header class="h4 flex justify-between items-center text-token">
        <div>
          Edit {selectedBill.billName}
        </div>
        <div>
          <button type="button" class="btn-icon btn-icon-sm" on:click={() => editModal.close()}>
            <XIcon size="1em" />
          </button>
        </div>
      </header>
      <section>
        <label>
          <span>Bill Name</span>
          <input class="input variant-filled px-3 py-2" name="bill-name" type="text" value={selectedBill.billName}>
        </label>
        <label>
          <span>Due Date</span>
          <input class="input variant-filled px-3 py-2" name="due-date" type="number" value={selectedBill.billDueDate}>
        </label>
        <label>
          <span>
            Household
          </span>
          <select name="household-id" class="input variant-filled px-3 py-2">
            {#each data.households as { households } }
              <option value={households.id} selected={households.id === selectedBill.householdId}>
                {households.name}
              </option>
            {/each}
          </select>
        </label>
      </section>
      <footer class="flex justify-end gap-3">
        <button type="button" on:click={() => editModal.close()} class="btn btn-sm variant-outline">
          Close
        </button>
        <button type="submit" class="btn btn-sm variant-filled-primary">
          Submit
        </button>
      </footer>
    </div>
  </form>
</dialog>



<Header class="mt-4">Bills</Header>

<table class="table table-compact table-hover">
  <thead>
    <tr>
      <th>
        Bill name
      </th>
      <th>
        Due date
      </th>
      <th>
        Household
      </th>
      <th>
        Actions
      </th>
    </tr>
  </thead>
  <tbody>
    {#each data.bills as bill}
      <tr on:click={() => console.info(bill)}>
        <td>
          {bill.billName}
        </td>
        <td>
          {bill.billDueDate}
        </td>
        <td>
          {bill.householdName}
        </td>
        <td>
          <div class="flex gap-2">

            <button class="btn-icon btn-icon-sm variant-filled-secondary" title={`Edit Bill ${bill.billName}`} on:click={() => {
              selectedBill = bill;
              editModal.showModal();
            }}>
              <PencilIcon size='1em' />
            </button>

            <button class="btn-icon btn-icon-sm variant-filled-secondary" title={`Delete bill ${bill.billName}`}>
              <TrashIcon size='1em' />
            </button>

          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
