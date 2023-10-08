<script lang="ts">
  import Button from "$lib/components/button/button.svelte";
  import { fly, slide} from 'svelte/transition';
  import { enhance } from '$app/forms';
  import Header from "$lib/components/header/header.svelte";
  import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form: ActionData
  let households = data.households;
  $: households = data.households;

  function toggleHouseholds() {
    const el = document.getElementById('create-household');
    if(!(el instanceof HTMLDialogElement)) {
      return false;
    }
    if(el.hasAttribute('open')) {
      el.close()
    } else {
      el.showModal();
    }
  }

  
</script>

<div class="container mx-auto mt-4">
  <Header>
    Households
    <svelte:fragment slot="actions">
      <Button on:click={toggleHouseholds}>Add</Button>
    </svelte:fragment>
  </Header>

  {#each households as household}
    <div class="p-2 border rounded my-2" in:fly={{ y: 20}} out:slide>
      <form action="?/deleteHousehold" method="post" use:enhance>
        <input type="hidden" value={household.id} name="household-id"/>
        <strong>{household.name}</strong>
         - {household.users.length} members
         <Button type="submit">Delete</Button>
      </form>
    </div>
  {/each}

</div>

<dialog id="create-household" class="rounded-lg p-2 max-w-7xl">
  <form action="?/addHousehold" method="post" use:enhance>
    <label>
      <input name="household-name" type="text" class="p-2 border rounded" placeholder="New Household name">
    </label>
    <footer class="p-4 flex justify-end">
      <Button on:click={toggleHouseholds}>Add</Button>
    </footer>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgb(from theme('colors.zinc.800') / 40);
  }
</style>