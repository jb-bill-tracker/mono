<script lang="ts">
  import Button from "$lib/components/button/button.svelte";

  import { enhance } from '$app/forms';
  export let data;
  let households = data.households;
  $: households = data.households;

  function toggleHouseholds() {
    const el = document.getElementById('create-household');
    if(!(el instanceof HTMLDialogElement)) {
      return false;
    }
    el.showModal();
  }
</script>

<div class="container mx-auto mt-4">
  <header class="flex justify-between items-end">
    <h1 class="text-4xl font-bold dark:text-emerald-400 text-emerald-800 ">Households</h1>
    <section class="actions">
      <Button on:click={toggleHouseholds}>Add</Button>
    </section>
  </header>

  
  {#each households as household}
    {JSON.stringify(household)}
    <strong>{household.name}</strong>
  {/each}

</div>

<dialog id="create-household" class="rounded-lg p-2 max-w-7xl">
  <form action="?/addHousehold" method="post" use:enhance>
    <label>
      <input type="text" class="p-2 border rounded" placeholder="New Household name">
    </label>
    <footer class="p-4 flex justify-end">
      <Button>Add</Button>
    </footer>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgb(from theme('colors.zinc.800') / 40);
  }
</style>