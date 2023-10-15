<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  export let data;

  const today = new Date();
</script>
<div class="container mt-4 mx-auto">
  <Header>Dashboard</Header>
  {#each data.bills as bill}
    <Header tag="h2" color="secondary">
      {bill.bills.billName} <small>&ndash; {bill.bills.dueDate} (due in {today.getDate() - bill.bills.dueDate} day(s))</small>
    </Header>
  {/each}
</div>