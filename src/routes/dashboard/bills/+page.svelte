<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  export let data;
</script>

<Header class="mt-4">Bills</Header>

<table class="table table-compact table-hover">
  <thead>
    <tr>
      <th>
        Bill Name
      </th>
      <th>
        Household
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
          {bill.householdName}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
