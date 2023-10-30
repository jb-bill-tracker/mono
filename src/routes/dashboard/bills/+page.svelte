<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  export let data;
</script>

<Header class="mt-4">Bills</Header>

{#each data.bills as bill}
  <p>{bill.billName} - {bill.householdName}</p>
{/each}
